terraform {
  required_version = ">= 1.14.8, < 2.0"

  required_providers {
    azapi = {
      source  = "Azure/azapi"
      version = "= 2.12.0"
    }
  }
}

# Retain the genuine .terraform.lock.hcl generated for this executable root.
# No backend is configured: local state is suitable only for these offline
# checks. A real consumer supplies a separate protected backend.
