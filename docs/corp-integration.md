# Consume the module in a Corp landing zone

Keep the reusable module public and the environment-specific deployment root separate. A Corp archetype name is not proof of effective Azure Policy, available networking, or an authorized deployment target.

This document describes an integration contract, not a completed Azure deployment or a published module release.

## Separate responsibilities

| Owner | Responsibility |
| --- | --- |
| Platform team | Approved network/subnets, private DNS, egress, shared monitoring, policy, and platform access assignments. |
| Workload root | Explicit providers, isolated backend, approved environment inputs, module version pin, workload resources, plan review, and cleanup ownership. |
| Reusable child module | The documented AKS infrastructure contract. No embedded account IDs, credentials, platform state, or estate resource imports. |
| Presentation package | A verified copy of the released module, sanitized examples, and reviewed evidence. |

After publication, pin the module to an immutable release commit. For a Git source, replace the placeholder below with the approved full commit SHA; don't use a moving branch:

```text
git::https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp.git?ref=<RELEASE_COMMIT_SHA>
```

The presentation copy must match the selected module tree. Record the release revision and tree digest without including private inputs.

## Integration inputs

These are concepts to bind to the module's documented variables, not a runnable configuration:

| Input | Placeholder |
| --- | --- |
| Approved Corp workload target | `<WORKLOAD_SUBSCRIPTION>` and `<WORKLOAD_RESOURCE_GROUP>` |
| Location and ownership | `<APPROVED_REGION>`, `<OWNER>`, `<EXPIRY>` |
| Existing network | `<VNET_RESOURCE_ID>` |
| AKS subnets | `<API_SUBNET_ID>`, `<USER_NODE_SUBNET_ID>`, `<MANAGED_SYSTEM_SUBNET_ID>` |
| Cluster identity | `<CLUSTER_MANAGED_IDENTITY_ID>` |
| Private connectivity | `<APPROVED_PRIVATE_API_DNS_CONFIGURATION>` |
| Egress | `<SERVICE_SUPPORTED_OUTBOUND_CONFIGURATION>` |
| Monitoring | `<APPROVED_MONITORING_DESTINATION>` |

Verify current Automatic service requirements, managed system pools, subnet delegation/capacity, NSGs, and supported outbound routing. Confirm that the runner can resolve and reach the private API. Don't convert an existing Base cluster, weaken policy, add exemptions, or hide policy-induced drift to make an example pass.

## Keep state and credentials separate

Use a workload-only state partition with explicitly scoped access. A different Terraform workspace or filename alone isn't access control. Don't consume the platform's full state just to obtain a few resource IDs; use approved inputs or exact lookups.

Keep backend settings and OIDC configuration in the private root/workflow. Separate plan and apply authorization, inspect effective permissions, and approve the exact saved plan before apply. Public CI should run credential-free checks, not reach private state or infrastructure. Isolate workload workflow triggers from platform deployment triggers.

Local mocks and static checks do not establish Azure compliance. Before deployment, verify target parentage, inherited policy assignments and parameters, exclusions/exemptions, and the actual plan. After separately authorized apply, read back the cluster, connectivity, diagnostics, and policy results.

Keep real inputs, state, plans, credentials, internal evidence, and raw recordings out of public repositories and clips. Use local sanitized takes without redeploying the platform. Agree the budget, expiry, and cleanup procedure before any cloud deployment.
