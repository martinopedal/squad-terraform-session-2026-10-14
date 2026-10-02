# Root-owned configuration for an offline example. Tests must mock this provider.
# Authentication discovery and resource-provider registration are not part of
# offline qualification. A real consumer supplies separately reviewed auth.
# Any later approved real execution sources its subscription from
# ARM_SUBSCRIPTION_ID, never a subscription literal in this provider block.
provider "azapi" {
  enable_preflight           = false
  skip_provider_registration = true
  use_cli                    = false
  use_msi                    = false
  use_oidc                   = false
}
