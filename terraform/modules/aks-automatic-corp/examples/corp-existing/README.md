# Offline caller example for existing Corp networking

Terraform module consumers can use this root to inspect the child-module call and run isolated checks with synthetic inputs. It calls the real local module through `source = "../.."` and forwards all eight inputs and six outputs.

**This is an offline fixture, not a deployable environment.** Both mocked caller tests passed with the explicit synthetic var-file on Terraform 1.16.4 and AzAPI 2.12.0. Real execution belongs to a separately approved private consumer. Target and budget are deferred, and source-scope/private-policy assumptions and Azure acceptance remain unverified. See the [module validation status](../../README.md#validation-status-and-evidence).

## What the example owns

`terraform.tf` requires Terraform `>= 1.14.8, < 2.0` and pins AzAPI `= 2.12.0`. Its own `.terraform.lock.hcl` selects 2.12.0. `providers.tf` configures AzAPI only in this caller root:

| Setting | Fixture value | Purpose |
| --- | --- | --- |
| `enable_preflight` | `false` | No live preflight validation during offline qualification. |
| `skip_provider_registration` | `true` | No automatic resource-provider registration. |
| `use_cli` | `false` | Disable Azure CLI authentication discovery. |
| `use_msi` | `false` | Disable managed-identity authentication discovery. |
| `use_oidc` | `false` | Disable OIDC authentication discovery. |

These flags do not constitute a network sandbox or neutralize every inherited credential. Use the clean offline shell described below, and keep the test provider mocked.

No backend is configured here. Local initialization is only for offline checks; an actual consumer owns a separate protected backend and authentication configuration. The provider block contains no subscription literal. Any later authorized real consumer obtains its reviewed subscription through `ARM_SUBSCRIPTION_ID`, not from these fixture resource IDs.

## Synthetic input file

[terraform.tfvars.example](terraform.tfvars.example) repeats the existing `variables.tf` defaults. Pass it directly to this root; it contains variable assignments, not a child-module provider, backend, or nested module block.

| Fixture | Existing default |
| --- | --- |
| Cluster and region | `aks-corp-example`, `swedencentral`; regional availability is not verified. |
| Workload, identity, and network IDs | Subscription `00000000-0000-0000-0000-000000000000`; three distinct subnets in `vnet-corp-example`. |
| Custom DNS zone ID | Subscription `11111111-1111-1111-1111-111111111111`; `private.swedencentral.azmk8s.io`. |
| Address ranges | Pod `172.20.0.0/16`, service `10.240.0.0/16`, DNS `10.240.0.10`. |
| Tags | `environment = "example"`, `purpose = "offline-contract-validation"`. |

The different fictional DNS subscription exercises a permitted string-level boundary, not cross-subscription authority. None of these values comes from a real estate or platform IPAM allocation.

## Run offline checks

First follow the module's [offline qualification setup](../../README.md#offline-qualification): approved local tools, a populated AzAPI 2.12.0 filesystem mirror, no direct registry fallback, an uncredentialed network-isolated shell, and preserved lock files.

From this example directory, run each PowerShell command separately and stop if its exit code is nonzero:

```powershell
$env:TF_CLI_CONFIG_FILE = 'C:\terraform-offline\terraform.tfrc'
$env:CHECKPOINT_DISABLE = '1'
$env:TF_IN_AUTOMATION = '1'
terraform version
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
terraform test -var-file terraform.tfvars.example -no-color
```

`tests\example.tftest.hcl` mocks AzAPI and uses plan-mode runs. It checks the local child call, output forwarding, and caller overrides. Its computed response includes `MockOnly` and `.invalid` hostnames: these are fixtures, not provisioning, DNS, or connectivity evidence. The child suite separately checks its request body.

Don't run an ordinary plan, deployment, import, or estate workflow from these defaults. Private-network capacity/delegation, NSGs, UDR/firewall egress, DNS links, identity permissions, region, policy, and scope need separate review in the real consumer. Preserve the module's destruction guard.

The [qualification summary](../../VALIDATION.md) records the executed local checks and their limits. A later disclosed clean recording does not retroactively make this implementation filmed.
