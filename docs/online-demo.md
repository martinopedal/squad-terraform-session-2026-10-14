# Online consumer: upstream Automatic module, real guardrails

This appendix shows the upstream Automatic module's Online consumer. It is not the independently pinned Corp teaching copy used in the main talk. The topology is simpler, guardrails remain and the consumer uses a gated pipeline; findings pushed fixes into its upstream module.

Source: [`martinopedal/aks-automatic-demo-env`](https://github.com/martinopedal/aks-automatic-demo-env): `deployments/online/`, `manifests/online/`, `.github/workflows/deploy-online.yml`, `scripts/start-online-runner.ps1`. The root pins the reusable module [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic) by tag `v0.6.0`.

Audience: presenters and approved AKS consumer operators. Use [the repo
map](repositories.md): this session clone is teaching/source material, not the
live deployment entry. The independent public Corp teaching module has a
different unchanged source-copy pin/manifest.

## Current AKS evidence versus the separate native sandbox

Earlier October 12 Online/Corp metadata was Succeeded/Running. Fresh 10:47 UTC
reviewer: branded app/source-matching assets and two responding replicas PASS
with explicit TLS bypass. Canonical 26 PASS/2 BLOCKED/1 report-only, not 29/29;
corrected supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`;
source requires direct-pod `/healthz` 200 `ok`, not that external route).
Native Kubernetes access unavailable/ResourceHealth provider unregistered;
full cluster health unproved. Eleven noncompliant resources are in the demo RG
across AKS/network/state, not 11 cluster failures or subscription-wide.
No renewed 29/29 or full trusted TLS. Historical Oct 8 checks stay dated.
C1 fresh OnlineSecurity 29/DemoVM is scheduled Oct 13, not completed here.

Native ACA MicroVMs use the same Online placement direction but a **separate
SandboxGroup and resource group**, not inside AKS or Haflidi's hosted Jobs/runner.
Standard managed networking is not Corp BYO
VNet/UAMI/FIC transplant. Independent October 12 review verified five-object
deployment/current operator access/base exec/fs/stop-resume/delete and cleanup
empty. Corrected ACA SANDBOXES runtime passes three guest checks/JSON+SHA, exit23,
causal HTTPS-denial and exact cleanup in 26.768 seconds. Acceptance complete;
native card runtime-ready after acceptance, human stage GO separate.
Hosted Apps/Jobs remains independently gated; earlier CRLF is learning history. Leave Corp untouched; a failed qualification is not
a proven Corp policy restriction or promise Online fixes it. No anonymous
MicroVM ingress or exposed credentials are authorized.

Use [two product demo flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes),
[native test coverage](aca-sandboxes.md#full-test-coverage-checklist) and [progress
matrix](sandboxing.md#october-12-progress-and-next-actions). Host Copilot/Squad
remote orchestration is distinct from optional in-MicroVM CLI/Squad proof.
Earlier USD 20 is historical planning/alert context, not execution authority; retained Corp costs
remain. MCP minreplicas 1 Oct 13/revert Oct 14, teardown Oct 17 and credential
expiry Oct 31 are scheduled separate gates.

Online is primary placement for eligible demos, not fallback/policy escape.
Corp-required private workloads stay Corp; public repo visibility is not network/
authenticated control-plane exposure. Preserve existing working AKS/Corp/Jobs.
Report TLS/native-API limits, do not automatically repair or redeploy the cluster.
The new separate native five-object Online scope/Ubuntu 1 CPU/2 GiB ten-minute
credential-free probe/new-test-ID-only deletion has scope consent; source is
accepted separately from the still-pending public source PR human review.
Base provisioning/runtime is verified, not successful-work integration GO.

## Talk it in keywords

- The demo-env repo uses the same module through a thin root in `deployments/online/` with `source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0"`. The module stays provider-free.
- Three landing-zone controls shaped the topology more than any code choice.
- OIDC, the environment gate, private state, no plan artifact, and least privilege stay in place.
- The pipeline checks the app by hostname over HTTPS, and the run fails if that check fails.
- The lessons became step 1 of the [prompt pack](prompt-pack.md).

## What gets deployed

| Layer | Choice | Why |
| --- | --- | --- |
| Cluster | **AKS Automatic SKU** with managed system node pools (`cluster_sku = "Automatic"`) | Azure Policy, Key Vault secrets provider, node resource group lockdown, and Automatic defaults managed by AKS |
| Network | BYO VNet, NSG on every subnet, dedicated system node subnet | Landing zone denies subnets without an NSG; Automatic requires a system node subnet |
| Egress | NAT Gateway on the node subnet, static public IP | `egress_type = "userAssignedNATGateway"`; stable egress IP |
| API server | Public endpoint limited to authorized IPs, VNet integration, Entra RBAC only | Only the deploy runner's static egress IP; local accounts disabled |
| Identity | User-assigned, Network Contributor on the VNet | Granted before the cluster exists; required by AKS for BYO subnets and Node Auto-Provisioning |
| Ingress | Dedicated AKS App Routing `NginxIngressController`, HTTPS only, Azure default DNS label | The public demo URL is `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; HTTP redirects to HTTPS |
| Namespace | AKS managed namespace (ARM) | Pod Security `restricted`, default-deny ingress and egress, quota |
| App | Branded NIC 2026 page served by `nginx-unprivileged` pinned by digest, with the same pod hardening and CSP headers | Replaces the ASP.NET sample; the page shows the serving pod, render time, speaker details, and the flow from brief and code through checks, planning, approval, and evidence |

## Guardrails we hit, and the compliant answer

| Guardrail | What happened | Compliant answer |
| --- | --- | --- |
| Storage public network access forced off (tenant Modify policy) | Hosted runners cannot reach Terraform state | Private endpoint; ephemeral VNet-integrated runner |
| `Deny-Subnet-Without-Nsg` | AKS-managed VNet rejected at create | Root owns the VNet with NSG-protected subnets |
| AKS RBAC Writer cannot create namespaces | `kubectl apply` of a Namespace would be denied | Namespace as an ARM managed namespace in Terraform |
| Cluster identity needs subnet rights | Pipeline identity could not write role assignments | RBAC Administrator, ABAC-limited to assigning Network Contributor to service principals |

None of these were bypassed with exemptions. Each one became an input to the design.

## What the real consumer found in the module

| Finding | Evidence | Status |
| --- | --- | --- |
| AKS rejects a system-assigned identity with BYO subnets (`OnlySupportedOnUserAssignedMSICluster`); the module used a user-assigned identity only for custom private DNS | Failed apply, then a contract test written first | Fixed: `user_assigned_identity_id` is honored whenever set |
| `outboundType = none` now means a network-isolated cluster (`bootstrapProfile.artifactSource = Cache`) | Failed apply; Microsoft Learn lists `userAssignedNATGateway` for custom VNets | Fixed: `egress_type` accepts `userAssignedNATGateway` |
| `count` keyed on `external_node_subnet_id != null` is unknown when the caller creates the subnet | `Invalid count argument` at plan | Later public-module fix: `martinopedal/terraform-azapi-aks-automatic` v0.6.0 adds `use_external_subnets`, the Online root in `martinopedal/aks-automatic-demo-env` sets `use_external_subnets = true`, and `tests/external_subnets.tftest.hcl` covers it. This repository's local Corp module copy (`terraform/modules/aks-automatic-corp`, pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`) does not have that flag. |
| Perpetual drift: `metricsProfile` and `serviceMeshProfile` sent as null, AKS echoes values back | Every plan showed one in-place change (about 6 minutes per apply) | Fixed: send the API's own shape |
| The module sent `sku.name = "Base"` (AKS Standard SKU) despite its Automatic name | Azure read-back; an in-place switch was rejected, and Microsoft Learn states Base to Automatic migration is not supported | Fixed: opt-in `cluster_sku = "Automatic"` (managed system node pools, API `2026-04-01`, the Corp module's validated shape); the Online cluster was rebuilt |
| Module-level `depends_on` in the root forced a cluster replacement whenever a dependency had a pending change | Convergence plan wanted to replace the cluster; `prevent_destroy` blocked it | Fixed in the root: implicit ordering through resource references and a `terraform_data` anchor |

This is the point of consuming your own module like a customer: the Corp path had never exercised these combinations. Seven findings: six were fixed in the first pass (five in the module with tests written first, one in the root), and the seventh was later fixed in the public module and Online root path with `use_external_subnets` plus `tests/external_subnets.tftest.hcl`. This repository's local Corp module copy does not have that flag.

## The secure deployment chain

1. **Pull request** to the demo-env repository; required review.
2. **Dispatch** `deploy-online.yml` from a protected branch in the demo-env repository.
3. **Environment gate** `online`: a human approves before any Azure token exists.
4. **OIDC** federated credential; no stored Azure secret.
5. **One job** on an ephemeral, VNet-integrated runner: plan, apply, app deploy, runtime check. The plan is never uploaded as an artifact (public repository).
6. **Locked API server**: only the runner's static egress IP is authorized; the value comes from the GitHub environment, not code.
7. **App deploy** with an Entra-only kubeconfig (`kubelogin`) and namespace-scoped writes.
8. **Runtime check step**: fails unless the hostname returns HTTPS 200, HTTP 308 to HTTPS, and DNS resolves to the App Routing controller Service address; results go to the run summary.

## Run the AKS consumer only under separate approval

The commands below belong to a separately approved deployment window, not the
native SandboxGroup scope or a request to redeploy healthy AKS now. Public
clone access is not plan/apply consent; real environment/state/identity bindings
remain private and must be explicitly confirmed against the approved target.

```powershell
# From a clone of martinopedal/aks-automatic-demo-env.

# 1. Start one ephemeral runner execution (needs az and gh).
./scripts/start-online-runner.ps1

# 2. Plan only, then read the plan in the run summary.
gh workflow run deploy-online.yml -f apply=false

# 3. Start another runner execution, then apply, deploy the app, and check it.
./scripts/start-online-runner.ps1
gh workflow run deploy-online.yml -f apply=true
```

Approve the `online` environment in the Actions UI when prompted. The current demo URL is `https://aks-online-demo.swedencentral.cloudapp.azure.com/`. It presents the default NGINX self-signed certificate because no trusted certificate is configured, so accept the browser warning when opening it manually.

## Evidence

Current demo-environment code lives in [`martinopedal/aks-automatic-demo-env`](https://github.com/martinopedal/aks-automatic-demo-env). Historical run IDs below were recorded before extraction in the module repository [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic) and remain valid. Identifiers for subscriptions, tenants, and principals are deliberately omitted.

| Claim | Evidence |
| --- | --- |
| Historical AKS Automatic SKU deployment runtime check before the branded page | Actions runs 37586137417 (Automatic cluster created) and 37589702715: app rollout, HTTPS 200 with page title "Welcome to .NET - aspnetapp", `force-ssl-redirect` true, TLS present |
| No drift | Plan-only run 37590220057 and a second check: "No changes. Your infrastructure matches the configuration." |
| HTTP redirects to HTTPS | External check from the internet: `http://` returns 308 to `https://`. (The runner's NSG allows outbound 443 only, so the pipeline checks the redirect from the live Ingress configuration.) |
| Security settings | Azure read-back: SKU Automatic/Standard, managed system node pools, Azure Policy and Key Vault secrets provider add-ons, node resource group lockdown ReadOnly, Entra RBAC, local accounts disabled, user-assigned identity, `outboundType = userAssignedNATGateway`, API server authorized IPs limited to the runner's egress IP, VNet integration, workload identity, OIDC issuer, image cleaner, stable and NodeImage upgrade channels |
| Least privilege in the cluster | Pipeline identity: `can-i create deployments -n online-demo` = yes; listing cluster nodes = forbidden |
| Module changes are tested | Module suite: 20 passed, 0 failed (each fix written as a failing test first) |
| Change history | Historical module pull requests #118 to #137; module release v0.6.0; demo environment extracted to its own repository |
| Re-validated after extraction (2026-10-08, demo-env repo) | Plan-only run 37749232571: "No changes"; apply run 37749775898: HTTPS 200, `force-ssl-redirect` true, TLS present; demo VM plan run 37750404627: "No changes"; `Test-OnlineSecurity.ps1` 28/28 and `Test-DemoVm.ps1` 14/14. The module repository no longer holds any deployment environment or Azure federated credential |
| Hostname and dedicated App Routing controller history (2026-10-08, demo-env repo) | demo-env PR #9 created a dedicated `NginxIngressController` named `online-demo` with Azure default DNS label `aks-online-demo`. Apply run 37762119783 recorded `https://aks-online-demo.swedencentral.cloudapp.azure.com/` returning 200 and HTTP returning 308 by hostname. The run was marked failed only because the runtime check compared DNS against stale Ingress status after the class switch; demo-env PR #10 fixed the check to read the App Routing controller Service. |
| Branded NIC 2026 page and Service-based runtime check (2026-10-08, demo-env repo) | demo-env PR #10 (`dca35cd`) replaced the ASP.NET sample with the branded NIC 2026 page. Apply run 37771532872 succeeded with plan "No changes"; DNS matched the ingress IP from the App Routing controller Service; HTTPS returned 200 by hostname; page title was "AKS Automatic \| NIC 2026 demo". |
| Speaker section and latest apply (2026-10-08, demo-env repo) | demo-env PR #11 (`2b0b35b`) added "Your speakers" with Martin's photo, opedal.tech, LinkedIn, and GitHub plus Haflidi's initials and GitHub. Apply run 37772290635 succeeded with plan "No changes"; DNS matched the ingress IP; HTTPS returned 200 by hostname; page title was "AKS Automatic \| NIC 2026 demo". |
| Online security checks (2026-10-08, 13:48) | `Test-OnlineSecurity.ps1` 29/29 PASS for `https://aks-online-demo.swedencentral.cloudapp.azure.com/`, including hostname resolution to the ingress address. The browser warning is expected because no trusted certificate is configured and the demo presents the default NGINX self-signed certificate. |

## Limits

- The public demo URL presents the default NGINX self-signed certificate because no trusted certificate is configured. Accept the browser warning for the demo. Let's Encrypt is intentionally out of scope; production should use a Key Vault-backed certificate.
- A time-boxed, break-glass RBAC grant (`AKS App Routing Controller Writer (online demo)`) lets the pipeline update the demo `NginxIngressController` resource. The ABAC condition (group `approuting.kubernetes.azure.com`, kind `nginxingresscontrollers`) uses a preview attribute; treat it as demo-only and remove it during teardown per the demo-env runbook.
- The runner is started manually per run; it is a demo control, not a scaled runner pool.
- This repository's local Corp module copy (`terraform/modules/aks-automatic-corp`, pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`) does not include `use_external_subnets`; the public module repo (`martinopedal/terraform-azapi-aks-automatic` v0.6.0) does, and the Online root in `martinopedal/aks-automatic-demo-env` uses it.
- The demo resources expire on 2026-10-31 and are cleaned up with the rest of the session resources.
