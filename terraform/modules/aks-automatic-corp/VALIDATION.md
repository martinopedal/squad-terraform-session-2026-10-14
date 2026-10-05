# Qualification evidence

The module and synthetic caller passed local qualification on October 1, 2026. A separate IaC-based Azure validation succeeded on October 5, 2026 for module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`. Private environment identifiers and private workflow links are intentionally omitted.

## Executed local qualification

| Component | Executed version |
| --- | --- |
| Terraform | 1.16.4, Windows AMD64 |
| AzAPI | 2.12.0 |
| TFLint | 0.64.0; bundled Terraform ruleset 0.15.0 |
| Cluster schema | `Microsoft.ContainerService/managedClusters@2026-04-01` |

Both roots were checked in clean qualification directories using verified local provider packages, backend-disabled initialization, retained readonly locks, no Azure credentials, and plan-mode mocks.

| Check | Actual outcome |
| --- | --- |
| Module and caller initialization | Exit 0 with backend disabled and locks readonly |
| `terraform fmt -check -recursive` | Exit 0 in both roots |
| Explicit `terraform.tfvars.example` formatting through stdin | Exit 0 |
| `terraform validate -no-color` | Exit 0 in both roots |
| Module `tests/contract.tftest.hcl` | 52 passed, exit 0: four positive and 48 targeted negative cases |
| Caller `tests/example.tftest.hcl` with `-var-file=terraform.tfvars.example` | Two passed, exit 0 |
| Configured TFLint | Exit 0 in both roots |

The mocks replace computed IDs and responses only. The assertions inspect the configured request body; `MockOnly` and `.invalid` fixture outputs are not Azure provisioning or connectivity evidence.

Both reviewed provider lock files have SHA-256 `1AD921D1561B6E9D62AF84AC5461C23D489653F27EE8D1998F8361A529D35835`.

## Mutation proof

In a disposable source copy, qualification changed only one contract value at a time:

1. SKU `Automatic` to `Base`.
2. Private API `true` to `false`.

Each run produced the corresponding assertion failure, 51 passed / one failed, and exit 1. After exact-byte restoration, the unchanged 52-case module suite passed with exit 0. Canonical source and test assertions were not altered to hide the failure.

The earlier validation-cycle and UAMI-casing failures were retained as diagnostic history. The fixes did not widen expected failures or replace the requested resource body with mock expectations.

## Review and source binding

Independent static review found no material functional or maintainability blocker in the reviewed runtime, fixtures, and caller. A separate publication review checked the generic source, synthetic data, attribution, and exclusions.

The runtime/test files and provider locks match that qualified snapshot. Subsequent README, evidence, ignore, line-ending, and CI packaging changes do not constitute another runtime result. Re-run the relevant checks for any code, test, provider, or platform change.

The module copy included with the presentation must match the independently published module's source manifest. Do not use a green result from another revision as evidence for changed code.

## CI verification

The credential-free module workflow is installed in the independent module repository. It repeats formatting, initialization, validation, lint, and mock tests on Terraform 1.14.8 and 1.16.4 with locked AzAPI 2.12.0. It contains no Azure login, secrets, ordinary Terraform plan, or apply. Terraform matrix run 36990206303 passed on commit b7133679a89b1e2b36677400d659a03907c0f3f6. The native agent-setup job passed in hosted run 37286068987 on commit 00787f59ac19e3db0c3869a96ff45805c6cb523d; the contracts (1.14.8), contracts (1.16.4), and agent-setup jobs all concluded success.

The local results above establish the Windows Terraform 1.16.4 qualification. Hosted Linux CI establishes the credential-free Terraform 1.14.8/1.16.4 matrix for the published module commit named above. CI provider downloads are not an air-gapped execution claim.


## Azure validation

On October 5, 2026, the module was deployed from a private platform repository through a pull-request workflow: plan on PR, followed by an environment-approved apply. The private consumer pinned module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf` and targeted a Corp private landing-zone subscription with an AVNM-managed hub-and-spoke spoke, IPAM-allocated address space, forced tunnelling to the hub firewall, and explicit AKS egress rules.

A sanitized ARM read-back job asserted the deployed cluster contract: `sku.name = Automatic`; private API server with API-server VNet integration on the delegated API subnet; `outboundType = userDefinedRouting`; local accounts disabled; OIDC issuer and workload identity enabled; the custom private DNS zone `private.<region>.azmk8s.io`; and `provisioningState = Succeeded`. The region was `swedencentral`, and the observed Kubernetes version was 1.35.8.

Operational lessons from the private validation are part of the public learning while private details stay private: the IPAM-linked VNet required IPAM Pool User for the deploying identity, the AKS resource provider, and the cluster identity; the Corp Deny-Subnet-Without-Nsg policy required subnets with inline NSGs; and this module's `prevent_destroy` correctly blocked a replace after a failed create, with recovery through untaint plus an in-place update.

This public summary does not include subscription or tenant IDs, IP addresses, resource IDs, private repository names, identity names, private workflow run URLs, or the cluster FQDN. It does not claim that the public examples contain deployable real inputs.

## Remaining environment gates

The October 5 private validation established Azure service acceptance for the pinned module revision and that authorized private consumer path. Any later environment still needs its own reviewed scope, budget, plan, policy, identity, DNS, routing, and cleanup evidence. Native profile selection, genuine recordings, and the full human stage rehearsal remain pending. Do not reuse this sanitized summary as a substitute for private operational records.
