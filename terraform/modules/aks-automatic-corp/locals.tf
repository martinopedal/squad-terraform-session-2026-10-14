# AzAPI 2.12.0 requires canonical UAMI resource-type casing.
# Resource-ID scopes and names remain case-insensitive.
locals {
  subscription_id_pattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
  resource_id_segment     = "[^/[:space:]%?#]+"
  resource_group_id_base  = "/subscriptions/${local.subscription_id_pattern}/resourceGroups/${local.resource_id_segment}"

  resource_group_id_pattern   = "(?i)^${local.resource_group_id_base}$"
  subnet_id_pattern           = "(?i)^${local.resource_group_id_base}/providers/Microsoft\\.Network/virtualNetworks/${local.resource_id_segment}/subnets/${local.resource_id_segment}$"
  cluster_identity_id_pattern = "(?i)^${local.resource_group_id_base}/providers/(?-i:Microsoft\\.ManagedIdentity/userAssignedIdentities)/${local.resource_id_segment}$"
  private_dns_zone_id_pattern = "(?i)^${local.resource_group_id_base}/providers/Microsoft\\.Network/privateDnsZones/${local.resource_id_segment}$"

  ipv4_octet_pattern   = "(?:0|[1-9][0-9]{0,2})"
  ipv4_address_pattern = "${local.ipv4_octet_pattern}(?:\\.${local.ipv4_octet_pattern}){3}"
  ipv4_cidr_pattern    = "^${local.ipv4_address_pattern}/(?:[0-9]|[12][0-9]|3[0-2])$"
}
