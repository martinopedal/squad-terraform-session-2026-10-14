# How the demo consumes the AKS Automatic module

Audience: presenters and contributors reading the stack, not operators executing
an infrastructure change. Read [the stack overview](stack-overview.md) for
resource placement and the actual app ingress path, and
[the existing repository table](source-provenance.md#source-and-deployment-table)
for the broader source map.

## Source is not the deployment root

| Layer | Repository / root | Responsibility |
| --- | --- | --- |
| Consumed reusable dependency | [martinopedal/terraform-azapi-aks-automatic](https://github.com/martinopedal/terraform-azapi-aks-automatic) | Supplies the pinned AKS child-module contract. This documentation does not change its code, README, providers or release. Change it only for a separately verified bug, with evidence and owner review. |
| Existing Online deployment consumer | [martinopedal/aks-automatic-demo-env](https://github.com/martinopedal/aks-automatic-demo-env), `deployments\online` | Configures providers, authentication, backend, network and identity; calls the module; owns the managed namespace and its root state. |
| Kubernetes app consumer | Same demo-env repository, `manifests\online` | Defines the demo Deployment, Service, Ingress, controller, NetworkPolicy and generated site ConfigMap. The existing consumer workflow deploys these separately from Terraform. |
| Presentation / orchestration | [This session repository](../README.md) | Documentation, prompts, Squad coordination, native teaching profiles and deck. It is not the Azure deployment entry or the owner of all private IaC. |
| Independent Corp teaching source | [alz-avm-tf-demo/terraform-azapi-aks-automatic-corp](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp), session copy `terraform\modules\aks-automatic-corp` | Separate lineage, pinned by the unchanged [copy manifest](../terraform/module-source.json). It does not replace the Online consumer's dependency. |
| Hosted app / worker source | [haflidif/squad-on-aca](https://github.com/haflidif/squad-on-aca), separate [owned MIT fork](https://github.com/martinopedal/squad-on-aca) | Hosted application/runtime source, not this AKS module. Leave the original working service alone. Private issue target and publisher are separate consumers, not module source. |
| Resource-owner roots | Private platform owner, `infra\squad-on-aca-corp`, `infra\pool-a1`, `infra\avnm-platform` | Own or consume their respective hosted, runner and shared platform resources. See the [scope matrix](stack-overview.md#resource-group-and-subscription-matrix); no second infrastructure writer is introduced. |

## The actual source and pin

The inspected consumer revision is
[`dbb7e4c6f19a6c8fcd31ca61085e449d1a9fd87c`](https://github.com/martinopedal/aks-automatic-demo-env/tree/dbb7e4c6f19a6c8fcd31ca61085e449d1a9fd87c),
on `feat/aca-sandboxes-online`. Its
[`deployments\online\main.tf`](https://github.com/martinopedal/aks-automatic-demo-env/blob/dbb7e4c6f19a6c8fcd31ca61085e449d1a9fd87c/deployments/online/main.tf)
contains:

```hcl
source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0"
```

This is a Git source with a tag reference, **not a Terraform Registry address**;
there is no invented Registry `version` argument. Read-only GitHub metadata on
October 13, 2026 resolved annotated tag `v0.6.0` to commit
[`b0be400f93605df314e0291eee539371ecbdee9d`](https://github.com/martinopedal/terraform-azapi-aks-automatic/tree/b0be400f93605df314e0291eee539371ecbdee9d),
tree `67b41bf65473e23bb8247c46b57c4c4659ea4cad`. The consumer still uses the
tag exactly as written; this is an observation, not a pin change or upgrade.

The inherited starting checkpoint `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24`
and the independently versioned Corp teaching copy are not this runtime pin.
Preserve the baseline and existing consumer. No in-place Base-to-Automatic
conversion, pristine-baseline repair, provider upgrade or unreviewed apply is
part of documentation work.

## Typed inputs and root-owned wiring

Types below are from the consumed revision's
[`variables.tf`](https://github.com/martinopedal/terraform-azapi-aks-automatic/blob/b0be400f93605df314e0291eee539371ecbdee9d/variables.tf);
values/references are from the actual Online root, not generic module defaults.

| Input(s) | Type | How this consumer uses them |
| --- | --- | --- |
| `location`, `resource_group_name`, `cluster_name`, `cluster_sku` | `string` | Sweden Central, the existing Online demo RG, `aks-online-demo`, and explicit `"Automatic"`; the module's default SKU is not substituted. |
| `create_resource_group` | `bool` | `false`: the existing RG is consumed, not created/imported by this module call. |
| `enable_byo_vnet`, `use_external_subnets` | `bool` | Both `true`; the root owns the VNet/subnets. Explicit external-subnet mode keeps module resource counts known while root resources are planned. |
| `external_node_subnet_id`, `external_apiserver_subnet_id`, `external_system_node_subnet_id` | `string` | References to the three root-owned subnets; dedicated delegated API-server subnet and separate system subnet. No copied live ID is needed in the module source. |
| `egress_type` | `string` | `"userAssignedNATGateway"`; root `network.tf` attaches the explicit NAT Gateway to node/system subnets. NAT is outbound, not the app ingress frontend. |
| `user_assigned_identity_id` | `string` | `terraform_data.cluster_identity.output`; root `identity.tf` orders this after Network Contributor on the VNet. Existing root references, not a new module-level `depends_on`. |
| `enable_app_gateway_for_containers`, `enable_managed_nginx` | `bool` | `false` / `true`: managed Application Routing NGINX, not AGC/ALB or classic Application Gateway. |
| `enable_private_cluster` | `bool` | `false`; public **API endpoint** with approved CIDR restrictions, Entra RBAC and disabled local accounts. This is distinct from public app ingress. |
| `authorized_ip_ranges` | `list(string)` | Root `var.api_server_authorized_ip_ranges`, supplied privately through `TF_VAR_api_server_authorized_ip_ranges`. Root validation requires a nonempty list of valid CIDRs. Do not publish the allow-list. |
| `create_acr`, `create_keyvault` | `bool` | Both `false`. Hosted ACR/Key Vault resources belong to separate owner roots, not this module invocation. |
| `tags` | `map(string)` | Root-owned tags; environment values and personal tag values are not reproduced here. |

**Existing-root excerpt, not a standalone deployment template:** these references
require the unchanged root's `network.tf` and `identity.tf`. Copying only this
excerpt into an empty folder is insufficient.

```hcl
module "aks" {
  source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0"

  location              = local.location
  resource_group_name   = "rg-aks-online-demo"
  create_resource_group = false
  cluster_name          = "aks-online-demo"
  cluster_sku           = "Automatic"

  enable_byo_vnet                = true
  use_external_subnets           = true
  external_node_subnet_id        = azapi_resource.snet_nodes.id
  external_apiserver_subnet_id   = azapi_resource.snet_apiserver.id
  external_system_node_subnet_id = azapi_resource.snet_system.id
  egress_type                    = "userAssignedNATGateway"
  user_assigned_identity_id      = terraform_data.cluster_identity.output

  enable_app_gateway_for_containers = false
  enable_managed_nginx              = true
  enable_private_cluster           = false
  authorized_ip_ranges             = var.api_server_authorized_ip_ranges
  create_acr                       = false
  create_keyvault                  = false
  tags                             = local.tags
}
```

### Providers, authentication, backend and imports

- The consumed module's
  [`terraform.tf`](https://github.com/martinopedal/terraform-azapi-aks-automatic/blob/b0be400f93605df314e0291eee539371ecbdee9d/terraform.tf)
  declares Terraform `>= 1.9`, `azure/azapi ~> 2.12.0` and
  `hashicorp/azurerm ~> 4.2`. The Online root declares the same requirements
  and owns both provider configurations. No provider upgrade is proposed.
- Root `terraform.tf` has `provider "azapi" {}`, an AzureRM configuration
  with `features {}` and `resource_provider_registrations = "none"`, and a
  partial `backend "azurerm" {}`. Existing root locks remain unchanged.
- The existing `deploy-online.yml` sets ARM environment variables and uses
  GitHub OIDC through `azure/login` and the protected `online` environment.
  Identity values, assertions and credentials are private; they are not child
  module inputs to publish or tokens to extract.
- That workflow supplies backend settings at init: `TFSTATE_RESOURCE_GROUP_ONLINE`,
  `TFSTATE_STORAGE_ACCOUNT_ONLINE`, `TFSTATE_CONTAINER_NAME_ONLINE`, and key
  `aks-automatic-online.tfstate`, with OIDC/Azure AD authentication. The
  [matrix](stack-overview.md#resource-group-and-subscription-matrix) records
  approved storage/RG metadata only. No state or saved plan was downloaded.
- Infrastructure at `module.aks` and the root-owned network, identity and
  namespace have addresses in the **consumer root's state**. The public module
  source and session clone are not independent state owners. Kubernetes
  manifests are applied by the workflow, not silently moved into this state.
- No `import` blocks were found in the inspected Online/demo-VM `.tf` roots.
  Reading an existing RG does not import it. Do not import platform resources
  into the reusable module or treat separate owner-root imports as permission
  to take over their resources.

### Outputs and their actual use

Names and semantics were checked against the consumed
[`outputs.tf`](https://github.com/martinopedal/terraform-azapi-aks-automatic/blob/b0be400f93605df314e0291eee539371ecbdee9d/outputs.tf)
and the consumer's `outputs.tf`, `namespace.tf` and deployment workflow.

| Module output / root output | Actual use and limit |
| --- | --- |
| `cluster_id` | Root `namespace.tf` uses it as the parent of ARM managed namespace `online-demo`; it is not re-exported by the Online root. |
| `cluster_name`, `resource_group_name` | Root re-exports both for operator identification. The workflow's cluster commands use the configured literal names; it does not dynamically read every output. |
| `cluster_fqdn` | Root re-exports the **Kubernetes API** FQDN, not the demo app URL. |
| `egress_type` | Root re-exports the resolved outbound type. |
| `oidc_issuer_url` | Root re-exports the issuer metadata; no claim that the static demo website federates to Azure. |
| Root-only `nat_gateway_public_ip` | Comes from root `azapi_resource.pip_nat`, not the module. The workflow reports it as outbound metadata. Do not confuse it with the ingress IP. |

The module also defines other outputs; this table intentionally describes only
the actual consumer's uses. There is no invented `app_url` or kubeconfig output
in this flow. The workflow constructs the app URL from the controller's DNS
label and cluster region, as explained in [actual ingress](stack-overview.md#actual-aks-demo-ingress).

## Read versus execute

**Source-only, from the demo-env clone:** these copyable PowerShell commands read
Git/GitHub source only; they do not authenticate to Azure, initialize a backend,
alter a provider lock or touch the module checkout.

```powershell
git status --short
git show HEAD:deployments/online/main.tf
git show HEAD:deployments/online/terraform.tf
git show HEAD:deployments/online/outputs.tf
gh workflow view deploy-online.yml --repo martinopedal/aks-automatic-demo-env --yaml
```

**Approved private plan phase, not a source-only check:** the existing workflow
has `apply=false` by default and a self-hosted runner labelled `aks-online-demo`.
Only after confirming the approved consumer ref, existing runner, private state
reachability and human `online` gate, the documented dispatch pattern is:

```powershell
gh workflow run deploy-online.yml --repo martinopedal/aks-automatic-demo-env --ref main --field apply=false
```

This dispatch changes GitHub workflow state and the run reads private Azure
state/inputs. It was **not executed for these docs** and this example grants no
approval. Do not run the runner-start helper as discovery: it registers a runner,
writes a secret, updates a Job and starts an execution. The consumer
[operations runbook](https://github.com/martinopedal/aks-automatic-demo-env/blob/dbb7e4c6f19a6c8fcd31ca61085e449d1a9fd87c/docs/operations-runbook.md)
describes that existing operator path; it is not permission to use it now.

**Separate human execution phase:** the gate precedes the run's plan. An
`apply=true` run re-plans; a previous green plan/CI result does not establish
identity of the next saved plan. Exact-plan review, target/policy/network/
authentication/budget/cleanup approval and independent read-back are required.
No apply, destroy, credential retrieval, baseline conversion or hosted-resource
change is offered by this guide. Static/mocked success is never Azure proof.
