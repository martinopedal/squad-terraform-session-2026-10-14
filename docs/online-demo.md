# Online landing zone variant: same module, real guardrails

A question-driven appendix to the session. The main talk targets a private Corp cluster; this variant answers "what does it take to ship the same module somewhere simpler?" The honest answer: simpler topology, same guardrails, everything through a pipeline, and a module that got better because a real consumer used it.

Source: [`martinopedal/aks-automatic-demo-env`](https://github.com/martinopedal/aks-automatic-demo-env): `deployments/online/`, `manifests/online/`, `.github/workflows/deploy-online.yml`, `scripts/start-online-runner.ps1`. The root pins the reusable module [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic) by tag `v0.6.0`.

## Talk it in keywords

- **Same module.** Thin root `deployments/online/` in the demo-env repo with `source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0"`. The module stays provider-free.
- **Guardrails decide the design.** Three landing-zone controls shaped the topology more than any code choice.
- **Secure by default.** OIDC, environment gate, private state, no plan artifact, least privilege.
- **Proof, not hope.** The pipeline fails unless the app answers over HTTPS.
- **Prompts that rerun.** The lessons became step 1 of the [prompt pack](prompt-pack.md).

## What gets deployed

| Layer | Choice | Why |
| --- | --- | --- |
| Cluster | **AKS Automatic SKU** with managed system node pools (`cluster_sku = "Automatic"`) | Azure Policy, Key Vault secrets provider, node resource group lockdown, and Automatic defaults managed by AKS |
| Network | BYO VNet, NSG on every subnet, dedicated system node subnet | Landing zone denies subnets without an NSG; Automatic requires a system node subnet |
| Egress | NAT Gateway on the node subnet, static public IP | `egress_type = "userAssignedNATGateway"`; stable egress IP |
| API server | Public endpoint limited to authorized IPs, VNet integration, Entra RBAC only | Only the deploy runner's static egress IP; local accounts disabled |
| Identity | User-assigned, Network Contributor on the VNet | Granted before the cluster exists; required by AKS for BYO subnets and Node Auto-Provisioning |
| Ingress | AKS App Routing (managed NGINX), HTTPS only | No extra controller to run; HTTP redirects to HTTPS |
| Namespace | AKS managed namespace (ARM) | Pod Security `restricted`, default-deny ingress and egress, quota |
| App | Distroless, non-root ASP.NET Core sample (MCR), pinned by digest | Read-only root filesystem, no shell, probes and limits |

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
| `count` keyed on `external_node_subnet_id != null` is unknown when the caller creates the subnet | `Invalid count argument` at plan | Documented; root passes plan-time-known IDs; boolean input planned |
| Perpetual drift: `metricsProfile` and `serviceMeshProfile` sent as null, AKS echoes values back | Every plan showed one in-place change (about 6 minutes per apply) | Fixed: send the API's own shape |
| The module sent `sku.name = "Base"` (AKS Standard SKU) despite its Automatic name | Azure read-back; an in-place switch was rejected, and Microsoft Learn states Base to Automatic migration is not supported | Fixed: opt-in `cluster_sku = "Automatic"` (managed system node pools, API `2026-04-01`, the Corp module's validated shape); the Online cluster was rebuilt |
| Module-level `depends_on` in the root forced a cluster replacement whenever a dependency had a pending change | Convergence plan wanted to replace the cluster; `prevent_destroy` blocked it | Fixed in the root: implicit ordering through resource references and a `terraform_data` anchor |

This is the point of consuming your own module like a customer: the Corp path had never exercised these combinations. Seven findings: six fixed (five in the module with tests written first, one in the root) and one documented (`count` keyed on a plan-time-unknown ID).

## The secure deployment chain

1. **Pull request** to the demo-env repository; required review.
2. **Dispatch** `deploy-online.yml` from a protected branch in the demo-env repository.
3. **Environment gate** `online`: a human approves before any Azure token exists.
4. **OIDC** federated credential; no stored Azure secret.
5. **One job** on an ephemeral, VNet-integrated runner: plan, apply, app deploy, proof. The plan is never uploaded as an artifact (public repository).
6. **Locked API server**: only the runner's static egress IP is authorized; the value comes from the GitHub environment, not code.
7. **App deploy** with an Entra-only kubeconfig (`kubelogin`) and namespace-scoped writes.
8. **Proof step**: fails unless `http://` returns 308 to HTTPS and `https://` returns 200; results go to the run summary.

## Run it

```powershell
# From a clone of martinopedal/aks-automatic-demo-env.

# 1. Start one ephemeral runner execution (needs az and gh).
./scripts/start-online-runner.ps1

# 2. Plan only, then read the plan in the run summary.
gh workflow run deploy-online.yml -f apply=false

# 3. Start another runner execution, then apply, deploy the app, and prove it.
./scripts/start-online-runner.ps1
gh workflow run deploy-online.yml -f apply=true
```

Approve the `online` environment in the Actions UI when prompted.

## Evidence

Current demo-environment code lives in [`martinopedal/aks-automatic-demo-env`](https://github.com/martinopedal/aks-automatic-demo-env). Historical run IDs below were recorded before extraction in the module repository [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic) and remain valid. Identifiers for subscriptions, tenants, and principals are deliberately omitted.

| Claim | Evidence |
| --- | --- |
| AKS Automatic SKU deployed through the pipeline and proven over HTTPS | Actions runs 37586137417 (Automatic cluster created) and 37589702715: app rollout, HTTPS 200 with page title "Welcome to .NET - aspnetapp", `force-ssl-redirect` true, TLS present |
| No drift | Plan-only run 37590220057 and a second check: "No changes. Your infrastructure matches the configuration." |
| HTTP redirects to HTTPS | External check from the internet: `http://` returns 308 to `https://`. (The runner's NSG allows outbound 443 only, so the pipeline proves the redirect from the live Ingress configuration.) |
| Security settings | Azure read-back: SKU Automatic/Standard, managed system node pools, Azure Policy and Key Vault secrets provider add-ons, node resource group lockdown ReadOnly, Entra RBAC, local accounts disabled, user-assigned identity, `outboundType = userAssignedNATGateway`, API server authorized IPs limited to the runner's egress IP, VNet integration, workload identity, OIDC issuer, image cleaner, stable and NodeImage upgrade channels |
| Least privilege in the cluster | Pipeline identity: `can-i create deployments -n online-demo` = yes; listing cluster nodes = forbidden |
| Module changes are tested | Module suite: 20 passed, 0 failed (each fix written as a failing test first) |
| Change history | Historical module pull requests #118 to #137; module release v0.6.0; demo environment extracted to its own repository |

## Limits

- The ingress uses the NGINX default certificate. For production, store the certificate in Key Vault (the module can grant the App Routing identity access).
- The runner is started manually per run; it is a demo control, not a scaled runner pool.
- One module finding remains open (`count` on a plan-time-unknown ID); see the findings table.
- The demo resources expire on 2026-10-31 and are cleaned up with the rest of the session resources.
