output "id" {
  description = "ARM resource ID of the newly managed AKS cluster."
  value       = azapi_resource.this.id
}

output "name" {
  description = "Name of the newly managed AKS cluster."
  value       = azapi_resource.this.name
}

output "node_resource_group" {
  description = "Name, not resource ID, of the AKS service-managed node resource group. This module does not independently manage that group."
  value       = azapi_resource.this.output.properties.nodeResourceGroup
}

output "oidc_issuer_url" {
  description = "AKS OIDC issuer URL. Federation, application identities, and workload deployments are outside this module."
  value       = azapi_resource.this.output.properties.oidcIssuerProfile.issuerURL
}

output "private_fqdn" {
  description = "Private API-server FQDN. A returned name does not establish caller DNS resolution or private connectivity."
  value       = azapi_resource.this.output.properties.privateFQDN
}

output "provisioning_state" {
  description = "Provisioning state reported by the AKS control-plane resource; not a workload-health or end-to-end acceptance check."
  value       = azapi_resource.this.output.properties.provisioningState
}
