# These synthetic defaults are fixtures, not deployment authorization.
# Before any real deployment, platform owners separately establish:
# - Supported region, effective policy, quota, and a nonproduction Corp target.
# - API subnet >= /28 with managedClusters delegation; system subnet >= /26.
# - Adequate user-node capacity and approved delegation/NSG ownership.
# - UDR/firewall egress for both node-subnet roles and required AKS endpoints.
# - Private DNS links/resolution, identity permissions, and private runner access.
# - Address-space compatibility, application-ingress policy, and monitoring.
# The combined private/Automatic/managed-system/UDR payload needs live acceptance.
module "aks" {
  source = "../.."

  cluster_identity_id = var.cluster_identity_id
  location            = var.location
  name                = var.name
  network             = var.network
  private_dns_zone_id = var.private_dns_zone_id
  resource_group_id   = var.resource_group_id
  subnet_ids          = var.subnet_ids
  tags                = var.tags
}
