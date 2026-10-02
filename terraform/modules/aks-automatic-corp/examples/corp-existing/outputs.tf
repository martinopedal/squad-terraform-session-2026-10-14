output "id" {
  description = "Cluster ARM resource ID returned by the child module."
  value       = module.aks.id
}

output "name" {
  description = "Cluster name returned by the child module."
  value       = module.aks.name
}

output "node_resource_group" {
  description = "AKS service-managed node resource-group name."
  value       = module.aks.node_resource_group
}

output "oidc_issuer_url" {
  description = "AKS OIDC issuer URL; no federated credentials are created."
  value       = module.aks.oidc_issuer_url
}

output "private_fqdn" {
  description = "Private API-server FQDN, without asserting DNS reachability."
  value       = module.aks.private_fqdn
}

output "provisioning_state" {
  description = "Reported resource provisioning state, not workload health."
  value       = module.aks.provisioning_state
}
