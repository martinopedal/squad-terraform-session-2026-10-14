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
| Public demo hostname | `https://aks-online-demo.swedencentral.cloudapp.azure.com/` is served through a dedicated App Routing `NginxIngressController` with an Azure default DNS label. The NGINX certificate is self-signed by design for the demo; accept the browser warning when opening it manually |
| Time-boxed break-glass App Routing write | Custom role `AKS App Routing Controller Writer (online demo)` scopes the demo pipeline to `NginxIngressController` resources in group `approuting.kubernetes.azure.com`. The ABAC attribute is preview, the condition does not constrain the resource name, and the grant is demo-only and time-boxed, documented in the demo-env runbook, and removed during teardown |
| No plan artifact in a public repo | Plan, apply, deploy, and runtime check run in one job; `tfplan` is never uploaded |
| Runtime check or fail | The run fails unless the hostname returns HTTPS 200 and HTTP redirects to HTTPS. `Test-OnlineSecurity.ps1` now has 29 checks, including hostname resolution to the ingress address. The latest full pass on record is 28/28 from the demo-env repository on 2026-10-08; the 29-check pass is still pending. |

## 2. Platform guardrails we designed for, not around

The Azure Landing Zone policies were treated as requirements. No exemption was requested.

- **Enforced and met:** `Deny-Subnet-Without-Nsg` (every subnet has an NSG in the same apply), `Enforce-AKS-HTTPS`, minimum TLS, Azure Compute Security Baseline, `Deny-MgmtPorts-From-Internet` (the demo VM has no public IP and an explicit deny-all inbound rule).
- **Audit-only (`DoNotEnforce`) and reported:** the `Enforce-GR-*` assignments. Findings are listed, not suppressed. A transient "subnet without NSG" Defender finding on new subnets is assessment lag; older subnets show Healthy.
- **DeployIfNotExists side effects handled:** policy adds monitoring, ChangeTracking, GuestAttestation, and Azure Policy extensions plus a backup vault. The pipeline retries and waits rather than fighting them.

## 3. Workload and VM hardening

- **Cluster:** AKS Automatic (managed system node pools), Entra ID only with local accounts disabled, Kubernetes RBAC through Azure, user-assigned identity, NAT Gateway egress.
- **App namespace:** AKS managed namespace with Pod Security `restricted`, default-deny ingress and egress, resource quota. The pipeline identity cannot list nodes, by design.
- **App:** branded NIC demo page, NetworkPolicy admitting only the ingress controller, HTTPS-only Ingress through the dedicated App Routing controller.
- **Demo VM:** no public IP; Azure Bastion Standard only; Entra sign-in with MFA; an ABAC condition limits the pipeline's role-assignment right to two roles granted to users; the local admin password is generated per run, marked ephemeral and sensitive, and never stored; PowerShell is installed from a hash- and signature-verified MSI; auto-shutdown nightly.

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

- **MCP for sources:** Microsoft Learn for product rules (for example, that Base to Automatic migration is not supported, and that B2B guests cannot use Entra VM sign-in). Azure read-back for the deployed state. The agent cites the source, and the claim is re-checked by a test or a read-back.
- **Skills and instructions:** repository Terraform instructions, a secret-handling skill (never read `.env` or write secrets into committed state), and a reviewer protocol that locks a rejected author out of the revision.
- **Tests as oracles:** 52 module contract cases plus 2 caller/example `terraform test` cases; 29 Online read-back checks including negative tests from the internet, with 28/28 the latest full pass on record; 14 demo VM checks.
- **Humans approve:** every merge and every Azure write passed a human decision.

## 6. Honest gaps

- All pull requests were merged by the single maintainer using an admin override of the review requirement; `prevent_self_review` is off. With two maintainers, remove the override.
- The environment gate sits before the job's plan. Mitigation: a plan-only run is reviewed first, and the apply run's plan is compared before it proceeds.
- Real identifiers remain in git history.
- Checkov does not interpret azapi request bodies. Cluster security properties are covered by contract tests, Azure Policy, and read-back instead.
- The public demo hostname uses the NGINX self-signed certificate by design. Accept the browser warning for the demo; production should use a Key Vault certificate.
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
