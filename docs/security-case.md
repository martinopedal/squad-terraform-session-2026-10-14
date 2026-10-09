# Security case: how the demo deploys securely, and what AI contributed

This is an evidence-based account of the controls around the Online AKS demo and the demo VM. Each claim names how to check it. Identifiers stay private. Gaps are listed at the end, not hidden.

Evidence date: 2026-10-08. Demo-env repository: [`martinopedal/aks-automatic-demo-env`](https://github.com/martinopedal/aks-automatic-demo-env). Module repository: [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic), which now holds only the reusable module and no deployment environment or Azure federated credential (removed 2026-10-08 after re-validation from the demo-env repository).

## 1. The delivery chain

| Control | Evidence |
|---|---|
| All change through pull requests to protected `main` branches | Demo-env checks: Terraform Validate, Trivy IaC Scan, Checkov, TFLint. Module checks: Terraform Validate, Style Check, CodeQL, Checkov, TFLint, Trivy IaC Scan. Both are strict (up to date) with 1 approving review |
| Human gate before any Azure write | `online` environment: required reviewer, protected branches only, admin bypass off |
| No stored cloud secrets | GitHub OIDC federation to a user-assigned identity; the workflow holds no client secret |
| Private state | Tenant policy forces `publicNetworkAccess=Disabled` on storage; state is reached only through a private endpoint. `Test-OnlineSecurity.ps1` confirms anonymous internet access is refused |
| Ephemeral, identity-less runner | VNet-integrated Container Apps Job, one execution per run, no managed identity, outbound 443 only |
| Locked API server | Authorized IP ranges contain only the runner's static NAT egress IP |
| Public demo hostname | `https://aks-online-demo.swedencentral.cloudapp.azure.com/` is served through a dedicated App Routing `NginxIngressController` with an Azure default DNS label. The demo presents the default NGINX self-signed certificate because no trusted certificate is configured; accept the browser warning when opening it manually |
| Time-boxed break-glass App Routing write | Custom role `AKS App Routing Controller Writer (online demo)` scopes the demo pipeline to `NginxIngressController` resources in group `approuting.kubernetes.azure.com`. The ABAC attribute is preview, the condition does not constrain the resource name, and the grant is demo-only and time-boxed, documented in the demo-env runbook, and removed during teardown |
| No plan artifact in a public repo | Plan, apply, deploy, and runtime check run in one job; `tfplan` is never uploaded |
| Runtime check or fail | The run fails unless the hostname returns HTTPS 200, HTTP redirects to HTTPS, and DNS resolves to the App Routing controller Service address. Apply runs 37771532872 and 37772290635 both succeeded with plan "No changes", DNS matching the ingress IP, HTTPS 200 by hostname, and page title "AKS Automatic \| NIC 2026 demo". `Test-OnlineSecurity.ps1` is 29/29 PASS at 13:48 on 2026-10-08. |

### Same gate map for every change

Whether a change is human-authored or agent-assisted, the change goes through the same gate map: PR under GitHub identity → checks/scans → review + protected `main` → plan → environment approval → OIDC apply → runtime check and Actions audit trail. These are the gates documented above, with the known limits still visible: the single maintainer can use an admin override, `prevent_self_review` is off, the environment gate sits before the apply job's plan, identifiers remain in history, and Checkov does not interpret azapi request bodies. The compensating evidence is a reviewed plan-only run, in-job plan comparison before apply, and runtime checks scoped to the Online path they exercise.

## 2. Platform guardrails we designed for, not around

The Azure Landing Zone policies were treated as requirements. No exemption was requested.

- `Deny-Subnet-Without-Nsg` (every subnet has an NSG in the same apply), `Enforce-AKS-HTTPS`, minimum TLS, Azure Compute Security Baseline, and `Deny-MgmtPorts-From-Internet` are enforced and met. The demo VM has no public IP and an explicit deny-all inbound rule.
- The `Enforce-GR-*` assignments are audit-only (`DoNotEnforce`) and reported. Findings are listed, not suppressed. A transient "subnet without NSG" Defender finding on new subnets is assessment lag. Older subnets show Healthy.
- DeployIfNotExists side effects are handled. Policy adds monitoring, ChangeTracking, GuestAttestation, and Azure Policy extensions plus a backup vault. The pipeline retries and waits rather than fighting them.

## 3. Workload and VM hardening

- The cluster uses AKS Automatic (managed system node pools), Entra ID only with local accounts disabled, Kubernetes RBAC through Azure, a user-assigned identity, and NAT Gateway egress.
- The app namespace uses an AKS managed namespace with Pod Security `restricted`, default-deny ingress and egress, and a resource quota. The pipeline identity cannot list nodes, by design.
- The app is the branded NIC 2026 page served by `nginx-unprivileged` pinned by digest, with the same pod hardening, CSP headers, a NetworkPolicy that admits only the ingress controller, and HTTPS-only Ingress through the dedicated App Routing controller.
- The demo VM has no public IP and uses Azure Bastion Standard only. Martin uses Entra sign-in with MFA. Haflidi uses a local account through Bastion because B2B guests cannot use Entra VM sign-in. The credential is handed over out of band and not stored. An ABAC condition limits the pipeline's role-assignment right to two roles granted to users. PowerShell is installed from a hash- and signature-verified MSI. Auto-shutdown runs nightly.

## 4. GitHub Advanced Security baseline

The module and demo-env repositories: CodeQL default setup, secret scanning with push protection, Dependabot security updates. Open alerts on 2026-10-07: 0 code scanning, 0 secret scanning, 0 Dependabot. Session-repo CodeQL alerts (11) were dismissed individually with written reasons: 2 false positives (blob URL handling), 9 in vendored third-party bundles.

GHAS covers what it can see: source code, committed secrets, dependency advisories, and the IaC scanners' SARIF. It does not know that a policy will deny a subnet, that an API version needs a field, or that a scanner silently skipped a file.

## 5. What AI contributed beyond GHAS

Copilot CLI with Squad did the investigation and the fixes. MCP servers, skills, and tests made those claims checkable. Every item below was found during this work and fixed by pull request.

| Finding | How it was found | Why GHAS alone missed it |
|---|---|---|
| Checkov had not scanned the module's `main.tf` since August (parser rejected bare `for` keys), so the cluster definition was never checked | Agent reproduced Checkov's HCL parser locally and compared the file list | The job was green; a skipped file is not an alert |
| Security Scan workflow silently `disabled_inactivity` | Workflow state audit via GitHub API | No alert is raised when a scheduled scan stops |
| AKS feature monitor reported green while crashing on import | Agent split the pure scanner and made failures fail the job | Exit code masked the failure |
| `Invalid count argument` for callers that create subnets in the same root | Real consumer apply; regression test with a caller fixture reproduces it | Not a security or dependency pattern |
| Real subscription and resource IDs in a public repo | Repository sweep; removed (history not rewritten, identifiers not credentials) | Secret scanning targets credentials, not identifiers |
| Corp example manifests ran as root on port 80 | Trivy plus manual review; hardened to non-root, read-only, pinned | Trivy flagged it; the agent fixed and scoped the one remaining exception |
| Approval race: approving right after dispatch silently failed | Observed in a real run; `Invoke-GatedRun.ps1` waits for the gate | Runtime behavior, not code |
| VM cleanliness check blind to per-user installs (Run Command runs as SYSTEM) | Dry run of the C0 install path | Runtime behavior, not code |
| Base to Automatic in-place migration attempted | Microsoft Learn via MCP: not supported; cluster rebuilt | Product rule, not code |
| B2B guests cannot use Entra VM sign-in | Microsoft Learn (Bastion FAQ) via MCP | Product rule, not code |

What made the AI output trustworthy enough to merge:

- Microsoft Learn via MCP grounded product rules such as Base to Automatic migration not being supported and B2B guests not being able to use Entra VM sign-in. Azure read-back grounded the deployed state. The agent cites the source, and the claim is re-checked by a test or a read-back.
- Repository Terraform instructions, a secret-handling skill (never read `.env` or write secrets into committed state), and a reviewer protocol lock a rejected author out of the revision.
- Tests act as oracles: 52 module contract cases plus 2 caller/example `terraform test` cases, 29/29 Online read-back checks including negative tests from the internet and hostname resolution to the ingress address, and 14 demo VM checks.
- Every merge and every Azure write passed a human decision.

## 6. Honest gaps

- All pull requests were merged by the single maintainer using an admin override of the review requirement; `prevent_self_review` is off. With two maintainers, remove the override.
- The environment gate sits before the job's plan. Mitigation: a plan-only run is reviewed first, and the apply run's plan is compared before it proceeds.
- Real identifiers remain in git history.
- Checkov does not interpret azapi request bodies. Cluster security properties are covered by contract tests, Azure Policy, and read-back instead.
- The public demo hostname presents the default NGINX self-signed certificate because no trusted certificate is configured. Accept the browser warning for the demo; production should use a Key Vault-backed certificate.
- The Corp example manifests are not runtime-validated; their registry does not exist.

## Reproduce

From the demo-env repository, with `$env:AZURE_SUBSCRIPTION_ID_ONLINE` set:

```powershell
./scripts/Test-OnlineSecurity.ps1     # 29 checks, exit 1 on failure
./scripts/Test-DemoVm.ps1             # 14 checks, exit 1 on failure
```

From the module repository:

```powershell
terraform test                        # module contract and regression tests
gh api repos/martinopedal/terraform-azapi-aks-automatic/branches/main/protection
gh api repos/martinopedal/aks-automatic-demo-env/branches/main/protection
```
