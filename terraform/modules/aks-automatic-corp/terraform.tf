terraform {
  required_version = ">= 1.14.8, < 2.0"

  required_providers {
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.12.0"
    }
  }
}

# The initial minimum follows the pinned upstream sample; it is not a claim
# that this module has been tested locally on Terraform 1.14.8.
# Executable callers must select and lock AzAPI 2.12.0 until another version
# is separately qualified. Provider configuration and backend belong to callers.
