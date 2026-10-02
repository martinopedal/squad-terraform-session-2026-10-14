variable "cluster_identity_id" {
  type        = string
  description = "Synthetic existing UAMI ID for offline example qualification. Replace only in a separately approved consumer."
  default     = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-corp-example/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-aks-corp-example"
  nullable    = false
}

variable "location" {
  type        = string
  description = "Requested example location; regional service availability is not verified by this example."
  default     = "swedencentral"
  nullable    = false
}

variable "name" {
  type        = string
  description = "Synthetic name used by the offline example."
  default     = "aks-corp-example"
  nullable    = false
}

variable "network" {
  type = object({
    pod_cidr       = string
    service_cidr   = string
    dns_service_ip = string
  })
  description = "Synthetic nonoverlapping network ranges, not an allocation from any real platform IPAM."
  default = {
    pod_cidr       = "172.20.0.0/16"
    service_cidr   = "10.240.0.0/16"
    dns_service_ip = "10.240.0.10"
  }
  nullable = false
}

variable "private_dns_zone_id" {
  type        = string
  description = "Synthetic custom private-zone ID. Its different fictional subscription demonstrates the permitted string-level boundary, not cross-subscription authorization."
  default     = "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-dns-example/providers/Microsoft.Network/privateDnsZones/private.swedencentral.azmk8s.io"
  nullable    = false
}

variable "resource_group_id" {
  type        = string
  description = "Synthetic existing resource-group ID; no real subscription is selected."
  default     = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-corp-example"
  nullable    = false
}

variable "subnet_ids" {
  type = object({
    api_server   = string
    user_nodes   = string
    system_nodes = string
  })
  description = "Synthetic IDs for three existing subnets in one VNet; subnet properties and platform prerequisites are not inferred."
  default = {
    api_server   = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-network-example/providers/Microsoft.Network/virtualNetworks/vnet-corp-example/subnets/snet-api"
    user_nodes   = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-network-example/providers/Microsoft.Network/virtualNetworks/vnet-corp-example/subnets/snet-user"
    system_nodes = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-network-example/providers/Microsoft.Network/virtualNetworks/vnet-corp-example/subnets/snet-system"
  }
  nullable = false
}

variable "tags" {
  type        = map(string)
  description = "Illustrative public tags, not an assertion of any organization's mandatory tag policy."
  default = {
    environment = "example"
    purpose     = "offline-contract-validation"
  }
  nullable = false
}
