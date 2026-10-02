variable "cluster_identity_id" {
  type        = string
  description = "Existing user-assigned managed identity resource ID. AzAPI 2.12.0 requires canonical resource-type casing Microsoft.ManagedIdentity/userAssignedIdentities. The caller pregrants the required VNet, API-subnet, and private-DNS permissions; this module creates no role assignments."
  nullable    = false

  validation {
    condition     = can(regex(local.cluster_identity_id_pattern, var.cluster_identity_id))
    error_message = "cluster_identity_id must be a complete Microsoft.ManagedIdentity/userAssignedIdentities resource ID with a UUID subscription component. Use canonical resource-type casing Microsoft.ManagedIdentity/userAssignedIdentities, as required by AzAPI 2.12.0."
  }
}

variable "location" {
  type        = string
  description = "Canonical lowercase Azure public-cloud region name, for example swedencentral. Syntax validation does not establish AKS Automatic regional availability."
  nullable    = false

  validation {
    condition     = can(regex("^[a-z][a-z0-9]+$", var.location))
    error_message = "location must be a canonical lowercase region string containing letters and digits, starting with a letter, without spaces or punctuation."
  }
}

variable "name" {
  type        = string
  description = "Stable name for a fresh cluster: 2-63 alphanumeric or hyphen characters with alphanumeric ends. Replacement is blocked by prevent_destroy."
  nullable    = false

  validation {
    condition     = can(regex("^[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9]$", var.name))
    error_message = "name must contain 2-63 alphanumeric or hyphen characters and start and end with an alphanumeric character."
  }
}

variable "network" {
  type = object({
    pod_cidr       = string
    service_cidr   = string
    dns_service_ip = string
  })
  description = "Non-null canonical IPv4 pod/service CIDRs and DNS service address. The ranges must be disjoint; DNS must be inside the service range, excluding its network, first service, and broadcast addresses. Connected-network overlap remains a platform IPAM gate."
  nullable    = false

  validation {
    condition = alltrue([
      for cidr in [var.network.pod_cidr, var.network.service_cidr] : try(
        can(regex(local.ipv4_cidr_pattern, cidr)) &&
        can(cidrnetmask(cidr)) &&
        cidrhost(cidr, 0) == split("/", cidr)[0],
        false
      )
    ])
    error_message = "network.pod_cidr and network.service_cidr must be non-null canonical IPv4 network CIDRs, without host bits, leading-zero octets, or IPv6."
  }

  validation {
    condition = alltrue([
      for cidr in [var.network.pod_cidr, var.network.service_cidr] : try(
        can(regex(local.ipv4_cidr_pattern, cidr)) &&
        can(cidrnetmask(cidr)) &&
        cidrhost(cidr, 0) == split("/", cidr)[0],
        false
      )
      ]) ? (
      cidrhost("${split("/", var.network.pod_cidr)[0]}/${split("/", var.network.service_cidr)[1]}", 0) != cidrhost(var.network.service_cidr, 0) &&
      cidrhost("${split("/", var.network.service_cidr)[0]}/${split("/", var.network.pod_cidr)[1]}", 0) != cidrhost(var.network.pod_cidr, 0)
    ) : true
    error_message = "network.pod_cidr and network.service_cidr must not overlap or contain one another."
  }

  validation {
    condition = try(
      can(regex("^${local.ipv4_address_pattern}$", var.network.dns_service_ip)) &&
      cidrhost("${var.network.dns_service_ip}/32", 0) == var.network.dns_service_ip,
      false
    )
    error_message = "network.dns_service_ip must be a non-null canonical IPv4 address without a prefix or leading-zero octets."
  }

  validation {
    condition = try(
      can(regex(local.ipv4_cidr_pattern, var.network.service_cidr)) &&
      can(cidrnetmask(var.network.service_cidr)) &&
      cidrhost(var.network.service_cidr, 0) == split("/", var.network.service_cidr)[0] &&
      can(regex("^${local.ipv4_address_pattern}$", var.network.dns_service_ip)) &&
      cidrhost("${var.network.dns_service_ip}/32", 0) == var.network.dns_service_ip,
      false
      ) ? try(
      cidrhost("${var.network.dns_service_ip}/${split("/", var.network.service_cidr)[1]}", 0) == cidrhost(var.network.service_cidr, 0) &&
      !contains([
        cidrhost(var.network.service_cidr, 0),
        cidrhost(var.network.service_cidr, 1),
        cidrhost(var.network.service_cidr, -1)
      ], var.network.dns_service_ip),
      false
    ) : true
    error_message = "network.dns_service_ip must be inside network.service_cidr and must not be the network address, first service address reserved for Kubernetes, or broadcast address."
  }
}

variable "private_dns_zone_id" {
  type        = string
  description = "Existing custom private DNS zone resource ID for private.<location>.azmk8s.io or a single-label subzone of at most 32 characters. Another subscription is permitted; same-tenant permissions, registrations, and DNS links remain caller prerequisites."
  nullable    = false

  validation {
    condition     = can(regex(local.private_dns_zone_id_pattern, var.private_dns_zone_id))
    error_message = "private_dns_zone_id must be a complete Microsoft.Network/privateDnsZones resource ID with a UUID subscription component; system and none are unsupported."
  }

  validation {
    condition = can(regex(local.private_dns_zone_id_pattern, var.private_dns_zone_id)) && can(regex("^[a-z][a-z0-9]+$", var.location)) ? can(regex(
      "^(?:[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?\\.)?private\\.${var.location}\\.azmk8s\\.io$",
      lower(split("/", var.private_dns_zone_id)[8])
    )) : true
    error_message = "The private DNS zone must be private.<location>.azmk8s.io or <subzone>.private.<location>.azmk8s.io, where subzone is one valid DNS label of 1-32 characters."
  }
}

variable "resource_group_id" {
  type        = string
  description = "Complete resource ID of an existing approved workload resource group. Its subscription must match the supplied subnet VNet subscription; no group is created or imported."
  nullable    = false

  validation {
    condition     = can(regex(local.resource_group_id_pattern, var.resource_group_id))
    error_message = "resource_group_id must have the form /subscriptions/<UUID>/resourceGroups/<name>, without trailing slash, whitespace, query, or fragment."
  }
}

variable "subnet_ids" {
  type = object({
    api_server   = string
    user_nodes   = string
    system_nodes = string
  })
  description = "Existing, non-null, distinct API-server, user-node, and managed-system-node subnet IDs in one VNet and the cluster subscription. Case-insensitive comparisons do not alter caller values. Subnet capacity, delegation, NSGs, and routing are verified separately."
  nullable    = false

  validation {
    condition = alltrue([
      for id in values(var.subnet_ids) : can(regex(local.subnet_id_pattern, id))
    ])
    error_message = "Every subnet_ids field must be a complete Microsoft.Network/virtualNetworks/subnets resource ID with a UUID subscription component."
  }

  validation {
    condition = alltrue([
      for id in values(var.subnet_ids) : can(regex(local.subnet_id_pattern, id))
    ]) ? length(distinct([for id in values(var.subnet_ids) : lower(id)])) == 3 : true
    error_message = "api_server, user_nodes, and system_nodes must identify three distinct subnets, compared case-insensitively."
  }

  validation {
    condition = alltrue([
      for id in values(var.subnet_ids) : can(regex(local.subnet_id_pattern, id))
      ]) ? length(distinct([
        for id in values(var.subnet_ids) : join("/", slice(split("/", lower(id)), 0, 9))
    ])) == 1 : true
    error_message = "All three subnet IDs must have the same VNet parent, compared case-insensitively."
  }

  validation {
    condition = alltrue([
      for id in values(var.subnet_ids) : can(regex(local.subnet_id_pattern, id))
      ]) && can(regex(local.resource_group_id_pattern, var.resource_group_id)) ? alltrue([
      for id in values(var.subnet_ids) : lower(split("/", id)[2]) == lower(split("/", var.resource_group_id)[2])
    ]) : true
    error_message = "This module initially supports only a VNet in the same subscription as resource_group_id."
  }
}

variable "tags" {
  type        = map(string)
  description = "Caller-owned tags, preserved unchanged. Supply at most 50 tags; keys must be nonblank and at most 512 characters, values non-null and at most 256 characters, with no case-insensitive duplicate keys. No organization-specific mandatory tags are imposed."
  nullable    = false

  validation {
    condition     = length(var.tags) <= 50
    error_message = "tags must contain no more than 50 entries."
  }

  validation {
    condition = alltrue([
      for key, value in var.tags :
      length(trimspace(key)) > 0 && length(key) <= 512 && try(length(value) <= 256, false)
    ])
    error_message = "Tag keys must be nonblank and at most 512 characters; tag values must be non-null and at most 256 characters."
  }

  validation {
    condition     = length(distinct([for key in keys(var.tags) : lower(key)])) == length(var.tags)
    error_message = "Tag keys must be unique when compared case-insensitively."
  }
}
