# Online landing zone variant: same module, real guardrails

A question-driven appendix to the session. The main talk targets a private Corp cluster; this variant answers "what does it take to ship the same module somewhere simpler?" The honest answer: simpler topology, same guardrails, everything through a pipeline, and a module that got better because a real consumer used it.

Source: [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic): `deployments/online/`, `manifests-online/`, `.github/workflows/deploy-online.yml`, `scripts/start-online-runner.ps1`.

## Talk it in keywords

- **Same module.** Thin root `deployments/online/` with `source = "../.."`. The module stays provider-free.
- **Guardrails decide the design.** Three landing-zone controls shaped the topology more than any code choice.
- **Secure by default.** OIDC, environment gate, private state, no plan artifact, least privilege.
- **Proof, not hope.** The pipeline fails unless the app answers over HTTPS.
- **Prompts that rerun.** The lessons became step 1 of the [prompt pack](prompt-pack.md).

## What gets deployed

| Layer | Choice | Why |
| --- | --- | --- |
| Network | BYO VNet, NSG on every subnet | Landing zone denies subnets without an NSG |
| Egress | NAT Gateway on the node subnet, static public IP | `egress_type = "userAssignedNATGateway"`; stable egress IP |
| API server | Public endpoint limited to authorized IPs, VNet integration, Entra RBAC only | Only the deploy runner's static egress IP; local accounts disabled |
| Identity | User-assigned, Network Contributor on the two AKS subnets only | Granted before the cluster exists; AKS requires it for BYO subnets |
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
| The module sends `sku.name = "Base"` (AKS Standard SKU) with Automatic-style features | Azure read-back; an in-place switch to `Automatic` was rejected (needs Azure Policy, Key Vault secrets provider, ephemeral OS disks, SSH disabled on the system pool) | Documented and pinned by a guard test; true Automatic needs the Corp module's `hostedSystemProfile` shape and a rebuild |

This is the point of consuming your own module like a customer: the Corp path had never exercised these combinations.

## The secure deployment chain

1. **Pull request** to the module repository; required review.
2. **Dispatch** `deploy-online.yml` from a protected branch.
3. **Environment gate** `online`: a human approves before any Azure token exists.
4. **OIDC** federated credential; no stored Azure secret.
5. **One job** on an ephemeral, VNet-integrated runner: plan, apply, app deploy, proof. The plan is never uploaded as an artifact (public repository).
6. **Locked API server**: only the runner's static egress IP is authorized; the value comes from the GitHub environment, not code.
7. **App deploy** with an Entra-only kubeconfig (`kubelogin`) and namespace-scoped writes.
8. **Proof step**: fails unless `http://` returns 308 to HTTPS and `https://` returns 200; results go to the run summary.

## Run it

```powershell
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

All in the public repository [`martinopedal/terraform-azapi-aks-automatic`](https://github.com/martinopedal/terraform-azapi-aks-automatic). Identifiers for subscriptions, tenants, and principals are deliberately omitted.

| Claim | Evidence |
| --- | --- |
| Deployed through the pipeline and proven over HTTPS | Actions run 37480835592: apply, app rollout, HTTPS 200 with page title "Welcome to .NET - aspnetapp", `force-ssl-redirect` true, TLS present |
| No drift after the module fixes | Plan-only runs 37481481669 and 37485919880: "No changes. Your infrastructure matches the configuration." |
| HTTP redirects to HTTPS | External check from the internet: `http://` returns 308 to `https://`. (The runner's NSG allows outbound 443 only, so the pipeline proves the redirect from the live Ingress configuration.) |
| Security settings | Azure read-back: Entra RBAC, local accounts disabled, user-assigned identity, `outboundType = userAssignedNATGateway`, API server authorized IPs limited to the runner's egress IP, VNet integration, workload identity, OIDC issuer, image cleaner, stable and NodeImage upgrade channels |
| Least privilege in the cluster | Pipeline identity: `can-i create deployments -n online-demo` = yes; listing cluster nodes = forbidden |
| Module changes are tested | Module suite: 15 passed, 0 failed (each fix written as a failing test first) |
| Change history | Pull requests #118 to #134 |

## Limits

- The cluster is AKS Standard SKU with Automatic-style features (node auto-provisioning, Azure CNI Overlay with Cilium, Entra RBAC, workload identity, managed NGINX), not the Automatic SKU. See the findings table.
- The ingress uses the NGINX default certificate. For production, store the certificate in Key Vault (the module can grant the App Routing identity access).
- The runner is started manually per run; it is a demo control, not a scaled runner pool.
- One module finding remains open (`count` on a plan-time-unknown ID); see the findings table.
- The demo resources expire on 2026-10-31 and are cleaned up with the rest of the session resources.
