# Qualification evidence

The module and synthetic caller passed local qualification on October 1, 2026. This is not an Azure deployment or policy-compliance result.

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

A workflow has been prepared to repeat credential-free formatting, initialization, validation, lint, and mock tests on Terraform 1.14.8 and 1.16.4 with locked AzAPI 2.12.0. It contains no Azure login, secrets, ordinary Terraform plan, or apply. It has not been installed: the publication login lacks GitHub workflow permission. The source release therefore does not claim a hosted CI result.

The local results above establish only Terraform 1.16.4. Treat minimum-version and Linux compatibility as pending until the corresponding published CI run passes. CI provider downloads are not an air-gapped execution claim.

## Remaining environment gates

Before a real deployment, separately confirm the authorized Corp scope and budget, supported region/quota, subnet properties, UDR/firewall compatibility, private DNS, identity permissions, monitoring, effective policies, and the actual resource plan.

Only a reviewed and approved real deployment with matching read-back can establish Azure service acceptance. No such deployment, new recording, or human stage rehearsal is claimed here.
