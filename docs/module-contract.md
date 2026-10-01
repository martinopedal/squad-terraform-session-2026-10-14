# Public Corp AKS module contract

Implement a small reusable Terraform module for a fresh, private AKS Automatic cluster using existing approved Corp networking. This is an implementation contract, not deployment evidence.

## Ownership

The child module owns the cluster resource. Its caller owns the existing resource group, network/subnets, routes, private DNS, identities, credentials, provider configuration, and state. AKS creates additional service-managed infrastructure; one Terraform resource is not the entire Azure footprint.

Do not copy the starting root's Kubernetes application configuration, duplicate backend/provider declarations, environment files, or deployment workflows.

## Interface

All inputs are required and non-null:

- `name` and `location`: valid cluster name and canonical Azure region.
- `resource_group_id`: approved existing workload resource group.
- `subnet_ids`: distinct `api_server`, `user_nodes`, and `system_nodes` subnet IDs in the same VNet. The initial scope keeps the VNet and cluster in one subscription.
- `cluster_identity_id`: an existing user-assigned managed identity with separately approved platform permissions.
- `private_dns_zone_id`: an existing supported custom private DNS zone, not `system` or `none`.
- `network`: IPv4 `pod_cidr`, `service_cidr`, and a usable `dns_service_ip` within the service range. Pod and service ranges must not overlap.
- `tags`: caller-supplied Azure tags with valid counts and lengths. Do not invent a universal organization tag policy.

The platform must separately verify subnet size/delegation/NSGs, supported UDR/firewall routing, DNS links and resolution, identity permissions, region support, and effective policy. String validation cannot establish those facts.

## Fixed private contract

Use `Microsoft.ContainerService/managedClusters@2026-04-01` with:

- SKU `Automatic`, tier `Standard`.
- UserAssigned identity.
- Private cluster enabled, public FQDN disabled, VNet integration enabled, and the supplied API-server subnet and private DNS zone.
- Hosted system profile enabled with supplied user-node and system-node subnet IDs.
- Node provisioning `mode = "Auto"` and `defaultNodePools = "Auto"`.
- Azure CNI overlay, Cilium, Standard load-balancer SKU, and outbound type `userDefinedRouting`.
- Managed Entra/Azure RBAC, local accounts disabled, OIDC issuer and workload identity enabled.

Do not send manual `agentPoolProfiles`, public IP allowlists, arbitrary Kubernetes/VM-size overrides, or an optional public-network escape. Do not migrate an existing Base cluster.

Export only the required private FQDN, node resource group, OIDC issuer URL, and provisioning state. Use AzAPI's object output directly, without `jsondecode` or a catch-all null that hides a required field.

## Module, example, and tests

The module lives at `terraform\modules\aks-automatic-corp\` and contains provider requirements, not configured providers or a backend. Keep `prevent_destroy` on the cluster.

Qualify the initial implementation against Terraform 1.14.8 or later and AzAPI 2.12.0, using a reviewed provider requirement and an exact root-example lock. Do not change the inherited source's lock file. Compatible version choices must be documented, not silently upgraded.

The `examples\corp-existing\` directory is a separate caller root with synthetic inputs, root provider configuration, documentation, and its own lock file. Real backend and environment configuration remain outside this public repository.

Tests must use plan mode and mock every provider. Assert the actual configured request body, fixed private/Automatic/UDR settings, input propagation, absence of manual system pools, and useful outputs. Cover invalid IDs, duplicate/different-VNet subnets, DNS configuration, CIDR overlap, DNS placement, and tags. Include a labeled mutation that proves the private/SKU assertion fails, then restore and rerun it.

Formatting, validation, lint, mock tests, actual Azure plan, and approved deployment/read-back remain distinct evidence. Do not claim Azure end-to-end success from local tests.

## Sources

- [Private AKS Automatic quickstart](https://learn.microsoft.com/azure/aks/automatic/quick-automatic-private-custom-network)
- [Automatic networking capabilities](https://learn.microsoft.com/azure/aks/intro-aks-automatic#networking)
- [Pinned official AzAPI private-network sample](https://github.com/Azure/terraform/tree/0af68bf1013a6e7edc498db58b1db5c55563bda3/quickstart/101-aks-automatic-private-custom-network-azapi)
- [Managed-cluster API 2026-04-01](https://learn.microsoft.com/azure/templates/microsoft.containerservice/2026-04-01/managedclusters)
- [AzAPI 2.12.0 resource contract](https://github.com/Azure/terraform-provider-azapi/blob/v2.12.0/docs/resources/resource.md)

Retain applicable upstream MIT notices in the implementation. This contract uses only generic/public information; no estate-specific values are supplied.
