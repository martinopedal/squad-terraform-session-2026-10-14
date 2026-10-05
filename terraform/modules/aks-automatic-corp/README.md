# Private AKS Automatic with existing Corp networking

This child module declares a fresh, private AKS Automatic cluster using caller-supplied network, identity, and DNS resource IDs. Platform engineers can use this guide to understand the interface, run isolated local checks, and identify the prerequisites for a separately approved private consumer.

**Offline qualification passed on Terraform 1.16.4 with AzAPI 2.12.0.** All 52 module cases and both caller cases passed, including fail-restore-pass proofs for two deliberate mutations. The combined private/Automatic/hosted-system/UDR request has not been accepted in Azure. See [validation status and evidence](#validation-status-and-evidence).

## Agent setup

Use [CONTRIBUTING.md](CONTRIBUTING.md) for the file-backed
[terraform-coder](.github/agents/terraform-coder.agent.md),
[terraform-validator](.github/agents/terraform-validator.agent.md),
[read-only reviewer](.github/agents/terraform-reviewer.agent.md), and
[local qualification skill](.github/skills/qualify-agent-setup/SKILL.md).
Select profiles through `/agent` in the existing Copilot CLI window.

The three-lane flow is: Squad or the maintainer scopes the work,
`terraform-coder` edits, `terraform-validator` runs only approved offline checks
under native prompts, and a separate `/new` context with `terraform-reviewer`
reviews the exact diff and sanitized results before human acceptance. The coder
can edit but has no shell. The validator has no `edit` tool, but its shell
can still write files; the command list is enforced only by its instructions
and native approval prompts. The reviewer is read-only.

Coder and reviewer have read-only MCP grounding for Microsoft Learn and the
public Terraform Registry. MCP policy is hosted first. Microsoft Learn is cloud-hosted; HashiCorp has no
documented hosted Terraform MCP, so Terraform MCP uses Docker. Docker Desktop
must be running and pre-pull `hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5`. Network access is required for Microsoft
Learn and registry docs. The native Terraform MCP binary is not used for this
demo.
Copilot CLI and Copilot cloud agent honor `mcp-servers`; VS Code custom agents
ignore that frontmatter. MCP results are documentation lookups, not validation or
Azure acceptance, and private inputs must never be sent to an MCP server.

This independent repository needs no Squad installation. The session repository
uses the same profiles alongside its existing Squad coordinator. Configuration
readiness is not evidence that a native agent ran or that Azure accepted a request.

## Resource and ownership boundary

The module manages only `azapi_resource.this`, of type `Microsoft.ContainerService/managedClusters@2026-04-01`. AKS creates additional service-managed infrastructure; one Terraform resource is not the complete Azure footprint.

| Area | Fixed behavior |
| --- | --- |
| SKU | `Automatic`, tier `Standard`. No Base-to-Automatic conversion. |
| API access | Private cluster and VNet integration enabled; public FQDN disabled. Uses the supplied API-server subnet and custom private DNS zone. |
| System and user nodes | `hostedSystemProfile.enabled = true`; `nodeSubnetID` receives `subnet_ids.user_nodes`, and `systemNodeSubnetID` receives `subnet_ids.system_nodes`. Node provisioning mode and default node pools are both `Auto`. No manual `agentPoolProfiles`. |
| Networking | Azure CNI overlay, Cilium, Standard load-balancer SKU, and `outboundType = "userDefinedRouting"`. Pod/service ranges come from the caller. |
| Identity and access | Existing UserAssigned identity, managed Entra integration, Azure RBAC, local accounts disabled, OIDC issuer enabled, and workload identity enabled. |
| Schema and lifecycle | AzAPI schema validation stays enabled. `prevent_destroy` blocks Terraform destruction/replacement while the resource configuration remains present; it is not an Azure resource lock. |

The caller owns the existing resource group, VNet, three subnets, NSGs, routes/egress, private DNS and links, identity permissions, provider configuration, authentication, and backend/state. This module does not create those dependencies, assign roles, or import estate resources.

There are no Kubernetes/application resources, ingress stacks, estate deployment workflows, public-network fallback, manual pool settings, or arbitrary Kubernetes-version/VM-size overrides. Workload identity federation and application deployment remain separate work.

## Requirements

| Component | Declared requirement and qualification boundary |
| --- | --- |
| Terraform | `>= 1.14.8, < 2.0`. The minimum is a declared constraint, not evidence of a successful run on 1.14.8. Record the exact qualification binary/version. |
| AzAPI | `Azure/azapi ~> 2.12.0`. Initial executable callers must select and lock **2.12.0** until another version is separately qualified. The example pins it exactly. |
| TFLint | The checked-in configuration targets 0.64.0 and its bundled Terraform ruleset 0.15.0. Lint does not establish Azure acceptance. |

Provider configuration and a backend belong in the caller, never this child. Each executable root owns its lock file; a child module's local qualification lock does not control another caller's provider selection.

## Inputs

All eight inputs are required, have no defaults, and reject top-level `null`.

| Input | Type | Contract |
| --- | --- | --- |
| `cluster_identity_id` | `string` | Complete existing user-assigned identity ID with a UUID subscription component. AzAPI 2.12.0 requires the exact resource-type spelling `Microsoft.ManagedIdentity/userAssignedIdentities`. The caller grants network and DNS permissions separately. |
| `location` | `string` | Lowercase public-cloud region string, starting with a letter and containing only letters/digits. Syntax does not prove regional availability. |
| `name` | `string` | 2-63 alphanumeric/hyphen characters, with alphanumeric ends. Use a stable name for a fresh workload. |
| `network` | `object({ pod_cidr = string, service_cidr = string, dns_service_ip = string })` | Canonical IPv4 network CIDRs without host bits or leading-zero octets. Pod/service ranges must not overlap. DNS must be inside the service range, excluding its network, first service, and broadcast addresses. |
| `private_dns_zone_id` | `string` | Existing `Microsoft.Network/privateDnsZones` ID for `private.<location>.azmk8s.io` or one 1-32-character subzone label before it. `system` and `none` are unsupported. Another subscription is allowed syntactically; permissions, tenant compatibility, registrations, and links remain caller checks. |
| `resource_group_id` | `string` | Complete existing workload resource-group ID. Its subscription must match the supplied VNet subscription. No resource group is created or imported. |
| `subnet_ids` | `object({ api_server = string, user_nodes = string, system_nodes = string })` | Three non-null, distinct subnet IDs in one VNet and the cluster subscription. Comparisons are case-insensitive; supplied values are preserved. |
| `tags` | `map(string)` | At most 50 entries; nonblank keys up to 512 characters; non-null values up to 256 characters; no case-insensitive duplicate keys. `{}` is allowed. No organization-specific mandatory tags are invented. |

The identity resource-type casing is a narrow [AzAPI 2.12.0 parser requirement](https://github.com/Azure/terraform-provider-azapi/blob/v2.12.0/internal/services/parse/user_assigned_identity.go), not a general case-sensitive ARM-ID rule. Other identity ID scope/name casing may vary. The module passes identity IDs through unchanged; it does not normalize them. Subnet comparisons remain case-insensitive.

ID and CIDR validation cannot establish resource existence, subnet capacity/delegation, NSGs, compatible firewall/UDR egress, connected-network overlap, DNS resolution, identity permissions, or effective policy.

## Outputs

AzAPI response fields are read as objects, without `jsondecode` or a catch-all null fallback. Computed values may remain unknown until a response is available; mocked values are fixtures.

| Output | Value | Limit |
| --- | --- | --- |
| `id` | Cluster ARM resource ID | Identifies this cluster, not every service-managed resource. |
| `name` | Cluster name | Does not establish provisioning success. |
| `node_resource_group` | Service-managed node resource-group **name**, not ID | The module does not independently manage that group. |
| `oidc_issuer_url` | OIDC issuer URL | No federated credentials or application identities are created. |
| `private_fqdn` | Private API-server FQDN | Does not prove caller DNS resolution or connectivity. |
| `provisioning_state` | Resource provisioning state | Does not prove workload health or end-to-end acceptance. |

## Offline qualification

Use a clean, uncredentialed, network-isolated shell. Remove inherited Terraform argument/variable overrides and cloud-authentication environment values from that shell before qualification. Review the tests: every provider must be mocked, and each run must use `command = plan`.

Pre-stage the selected Terraform binary, TFLint 0.64.0, and the verified AzAPI 2.12.0 package for the host platform. Preserve the supplied lock files. A plugin cache alone is not an offline installation policy.

Create a local CLI configuration outside the repository, for example `C:\terraform-offline\terraform.tfrc`, pointing at an already populated provider mirror:

```hcl
disable_checkpoint = true

provider_installation {
  filesystem_mirror {
    path    = "C:\\terraform-offline\\providers"
    include = ["registry.terraform.io/azure/azapi"]
  }
}
```

There is intentionally no `direct` installation fallback. Missing packages or checksum mismatches must stop qualification, not trigger an unreviewed download, provider upgrade, or lock rewrite.

From the module directory, run these PowerShell commands individually. Inspect each exit code and stop on failure:

```powershell
$env:TF_CLI_CONFIG_FILE = 'C:\terraform-offline\terraform.tfrc'
$env:CHECKPOINT_DISABLE = '1'
$env:TF_IN_AUTOMATION = '1'
terraform version
tflint --version
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
tflint --config=.tflint.hcl --no-color
terraform test -no-color
```

The module suite is `tests\contract.tftest.hcl`. Follow the [caller example](examples/corp-existing/README.md) for its separate initialization and mocked tests. Do not substitute an ordinary Terraform plan or deployment for these offline commands. Real execution belongs to a separately approved private consumer.

## Validation status and evidence

Qualification ran on October 1, 2026, using Terraform 1.16.4 on Windows AMD64, AzAPI 2.12.0, and TFLint 0.64.0 with its bundled Terraform ruleset 0.15.0. The exact commands, boundaries, and mutation outcomes are summarized in [VALIDATION.md](VALIDATION.md). Raw logs remain private; these results do not certify Azure acceptance.

| Gate | Status | Evidence reference |
| --- | --- | --- |
| Formatting, validation, and configured lint | Passed for module and caller | [Local qualification](VALIDATION.md#executed-local-qualification) |
| Module positive/negative contract tests | 52 passed: four positive, 48 targeted negatives | [Local qualification](VALIDATION.md#executed-local-qualification) |
| Caller example and output forwarding | 2 passed with the explicit synthetic var-file | [Local qualification](VALIDATION.md#executed-local-qualification) |
| Labeled mutation, expected assertion failure, restoration, and rerun | Both mutations detected; unchanged suite passed after each restoration | [Mutation proof](VALIDATION.md#mutation-proof) |
| Authorized nonproduction Corp target and budget | Deferred by the user | Pending separate decision |
| Source-scope/private-policy assumptions and effective Azure policy | Unverified | Pending authorized verification |
| Real resource plan, deployment/read-back, and cleanup | Unverified; no authorization implied | Pending separate approval and evidence |

Static checks and mocked tests cannot clear the environment gates. The platform owner must verify supported private Automatic networking, API/system/user subnet requirements, UDR/firewall compatibility, DNS, identity, region, quota, monitoring, and policy. Cleanup must account for `prevent_destroy` and service-managed resources.

Hosted CI is active for the independent module repository. Terraform matrix run 36990206303 passed on commit b7133679a89b1e2b36677400d659a03907c0f3f6 for Terraform 1.14.8 and 1.16.4. The native agent-setup job passed in hosted run 37286068987 on commit 00787f59ac19e3db0c3869a96ff45805c6cb523d; the contracts (1.14.8), contracts (1.16.4), and agent-setup jobs all concluded success. A later genuine clean recording must disclose the qualification work; this implementation is not already-filmed evidence.

## Attribution

See [NOTICE.md](NOTICE.md) for the public source repositories and pinned revisions, and [LICENSE](LICENSE) for the applicable MIT terms. Preserve both files with every distribution of this module.
