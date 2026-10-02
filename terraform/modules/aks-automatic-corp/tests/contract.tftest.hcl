# Synthetic computed values are available during plan; the requested body is never mocked.
# MockOnly is a fixture marker, not evidence of Azure provisioning.
mock_provider "azapi" {
  override_during = plan

  mock_resource "azapi_resource" {
    defaults = {
      id = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-workload-contract/providers/Microsoft.ContainerService/managedClusters/aks-corp-contract"
      output = {
        properties = {
          nodeResourceGroup = "MC_contract_nodes"
          privateFQDN       = "aks-contract.private.example.invalid"
          provisioningState = "MockOnly"
          oidcIssuerProfile = {
            issuerURL = "https://issuer.example.invalid/contract/"
          }
        }
      }
    }
  }
}

variables {
  cluster_identity_id = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-identity-contract/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-aks-contract"
  location            = "swedencentral"
  name                = "aks-corp-contract"
  private_dns_zone_id = "/subscriptions/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/resourceGroups/rg-dns-contract/providers/Microsoft.Network/privateDnsZones/private.swedencentral.azmk8s.io"
  resource_group_id   = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-workload-contract"

  network = {
    pod_cidr       = "172.20.0.0/16"
    service_cidr   = "10.240.0.0/16"
    dns_service_ip = "10.240.0.10"
  }

  subnet_ids = {
    api_server   = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-network-contract/providers/Microsoft.Network/virtualNetworks/vnet-contract/subnets/snet-api"
    user_nodes   = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-network-contract/providers/Microsoft.Network/virtualNetworks/vnet-contract/subnets/snet-user"
    system_nodes = "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-network-contract/providers/Microsoft.Network/virtualNetworks/vnet-contract/subnets/snet-system"
  }

  tags = {
    environment = "test"
    Owner       = "caller-preserved"
    purpose     = "offline-contract"
  }
}

run "private_automatic_contract" {
  command = plan

  assert {
    condition     = azapi_resource.this.type == "Microsoft.ContainerService/managedClusters@2026-04-01"
    error_message = "The cluster must use the qualified managedClusters API."
  }

  assert {
    condition     = azapi_resource.this.body.sku.name == "Automatic" && azapi_resource.this.body.sku.tier == "Standard"
    error_message = "The request must be Automatic/Standard, not Base with node autoprovisioning."
  }

  assert {
    condition = (
      azapi_resource.this.name == var.name &&
      azapi_resource.this.location == var.location &&
      azapi_resource.this.parent_id == var.resource_group_id &&
      azapi_resource.this.tags == var.tags
    )
    error_message = "Name, location, existing resource-group ID, and caller tags must propagate unchanged."
  }

  assert {
    condition = (
      length(azapi_resource.this.identity) == 1 &&
      azapi_resource.this.identity[0].type == "UserAssigned" &&
      toset(azapi_resource.this.identity[0].identity_ids) == toset([var.cluster_identity_id])
    )
    error_message = "Use only the supplied user-assigned cluster identity."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.apiServerAccessProfile.enablePrivateCluster == true &&
      azapi_resource.this.body.properties.apiServerAccessProfile.enablePrivateClusterPublicFQDN == false &&
      azapi_resource.this.body.properties.apiServerAccessProfile.enableVnetIntegration == true
    )
    error_message = "The API must remain private with public FQDN disabled and VNet integration enabled."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.apiServerAccessProfile.subnetId == var.subnet_ids.api_server &&
      azapi_resource.this.body.properties.apiServerAccessProfile.privateDNSZone == var.private_dns_zone_id &&
      azapi_resource.this.body.properties.hostedSystemProfile.nodeSubnetID == var.subnet_ids.user_nodes &&
      azapi_resource.this.body.properties.hostedSystemProfile.systemNodeSubnetID == var.subnet_ids.system_nodes
    )
    error_message = "The API, user-node, system-node, and shared DNS IDs must map to their distinct request fields."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.hostedSystemProfile.enabled == true &&
      azapi_resource.this.body.properties.nodeProvisioningProfile.mode == "Auto" &&
      azapi_resource.this.body.properties.nodeProvisioningProfile.defaultNodePools == "Auto"
    )
    error_message = "Automatic must request hosted system pools and Auto/Auto node provisioning."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.networkProfile.networkPlugin == "azure" &&
      azapi_resource.this.body.properties.networkProfile.networkPluginMode == "overlay" &&
      azapi_resource.this.body.properties.networkProfile.networkDataplane == "cilium" &&
      azapi_resource.this.body.properties.networkProfile.loadBalancerSku == "standard" &&
      azapi_resource.this.body.properties.networkProfile.outboundType == "userDefinedRouting"
    )
    error_message = "The network request must retain Azure CNI overlay, Cilium, Standard LB SKU, and UDR."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.networkProfile.podCidr == var.network.pod_cidr &&
      azapi_resource.this.body.properties.networkProfile.serviceCidr == var.network.service_cidr &&
      azapi_resource.this.body.properties.networkProfile.dnsServiceIP == var.network.dns_service_ip
    )
    error_message = "Use the caller's pod CIDR, service CIDR, and DNS service address."
  }

  assert {
    condition = (
      azapi_resource.this.body.properties.aadProfile.managed == true &&
      azapi_resource.this.body.properties.aadProfile.enableAzureRBAC == true &&
      azapi_resource.this.body.properties.enableRBAC == true &&
      azapi_resource.this.body.properties.disableLocalAccounts == true &&
      azapi_resource.this.body.properties.oidcIssuerProfile.enabled == true &&
      azapi_resource.this.body.properties.securityProfile.workloadIdentity.enabled == true
    )
    error_message = "Managed Entra/RBAC, disabled local accounts, OIDC, and workload identity are fixed invariants."
  }

  assert {
    condition = (
      !contains(keys(azapi_resource.this.body.properties), "agentPoolProfiles") &&
      !contains(keys(azapi_resource.this.body.properties), "kubernetesVersion") &&
      !contains(keys(azapi_resource.this.body.properties), "addonProfiles") &&
      !contains(keys(azapi_resource.this.body.properties), "ingressProfile") &&
      !contains(keys(azapi_resource.this.body.properties), "linuxProfile") &&
      !contains(keys(azapi_resource.this.body.properties.apiServerAccessProfile), "authorizedIPRanges")
    )
    error_message = "Do not introduce manual pools, version/SSH overrides, ingress/addons, or public IP allowlists."
  }

  assert {
    condition = toset(keys(azapi_resource.this.body.properties)) == toset([
      "aadProfile",
      "apiServerAccessProfile",
      "disableLocalAccounts",
      "enableRBAC",
      "hostedSystemProfile",
      "networkProfile",
      "nodeProvisioningProfile",
      "oidcIssuerProfile",
      "securityProfile"
    ])
    error_message = "Additional cluster properties require an explicit contract review."
  }

  assert {
    condition = (
      azapi_resource.this.schema_validation_enabled == true &&
      toset(azapi_resource.this.response_export_values) == toset([
        "properties.nodeResourceGroup",
        "properties.oidcIssuerProfile.issuerURL",
        "properties.privateFQDN",
        "properties.provisioningState"
      ])
    )
    error_message = "Keep schema validation enabled and export only the four documented response properties."
  }

  assert {
    condition = (
      output.id == "/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-workload-contract/providers/Microsoft.ContainerService/managedClusters/aks-corp-contract" &&
      output.name == "aks-corp-contract" &&
      output.node_resource_group == "MC_contract_nodes" &&
      output.private_fqdn == "aks-contract.private.example.invalid" &&
      output.oidc_issuer_url == "https://issuer.example.invalid/contract/" &&
      output.provisioning_state == "MockOnly"
    )
    error_message = "All six outputs must be known at plan time and preserve the configured name and computed fixture values."
  }

  # These source-boundary checks supplement, not replace, the pre-execution effect scan.
  assert {
    condition = join(",", sort(flatten([
      for filename in fileset(path.module, "*.tf") : [
        for declaration in regexall("(?m)^\\s*resource\\s+\"([^\"]+)\"\\s+\"([^\"]+)\"\\s*\\{", file("${path.module}/${filename}")) :
        "${declaration[0]}.${declaration[1]}"
      ]
    ]))) == "azapi_resource.this"
    error_message = "The child must declare only its cluster, not RG/network/RBAC/workload or other resources."
  }

  assert {
    condition = (
      length(fileset(path.module, "*.tf.json")) == 0 &&
      alltrue([
        for filename in fileset(path.module, "*.tf") :
        length(regexall("(?m)^\\s*(provider|backend|module|data|provisioner|exec|import|removed)\\s*(\"|\\{)", file("${path.module}/${filename}"))) == 0
      ])
    )
    error_message = "Keep provider configuration, backend, nested modules, live data, exec, and state adoption outside the child."
  }

  assert {
    condition = join(",", flatten([
      for filename in fileset(path.module, "*.tf") : [
        for declaration in regexall("(?m)^\\s*source\\s*=\\s*\"([^\"]+)\"", file("${path.module}/${filename}")) :
        lower(declaration[0])
      ]
    ])) == "azure/azapi"
    error_message = "The child must require only AzAPI; no unmocked Kubernetes or additional provider may enter its graph."
  }

  assert {
    condition = (
      length(regexall("(?m)^\\s*prevent_destroy\\s*=\\s*true\\s*$", file("${path.module}/main.tf"))) == 1 &&
      length(regexall("(?m)^\\s*(ignore_changes|ignore_body_changes)\\s*=", file("${path.module}/main.tf"))) == 0
    )
    error_message = "Preserve the cluster destruction guard without adding drift suppression."
  }
}

run "case_insensitive_ids_and_cross_subscription_dns" {
  command = plan

  variables {
    resource_group_id = upper(var.resource_group_id)
    # AzAPI 2.12.0 requires canonical UAMI resource-type casing, not canonical scope/name casing.
    cluster_identity_id = replace(upper(var.cluster_identity_id), "MICROSOFT.MANAGEDIDENTITY/USERASSIGNEDIDENTITIES", "Microsoft.ManagedIdentity/userAssignedIdentities")
    private_dns_zone_id = upper(var.private_dns_zone_id)
    subnet_ids = {
      api_server   = upper(var.subnet_ids.api_server)
      user_nodes   = var.subnet_ids.user_nodes
      system_nodes = replace(var.subnet_ids.system_nodes, "vnet-contract", "VNET-CONTRACT")
    }
  }

  assert {
    condition = (
      azapi_resource.this.parent_id == var.resource_group_id &&
      toset(azapi_resource.this.identity[0].identity_ids) == toset([var.cluster_identity_id]) &&
      azapi_resource.this.body.properties.apiServerAccessProfile.privateDNSZone == var.private_dns_zone_id &&
      azapi_resource.this.body.properties.apiServerAccessProfile.subnetId == var.subnet_ids.api_server &&
      azapi_resource.this.body.properties.hostedSystemProfile.nodeSubnetID == var.subnet_ids.user_nodes &&
      azapi_resource.this.body.properties.hostedSystemProfile.systemNodeSubnetID == var.subnet_ids.system_nodes &&
      lower(split("/", var.private_dns_zone_id)[2]) != lower(split("/", var.resource_group_id)[2])
    )
    error_message = "Accept case-insensitive scopes/names, canonical UAMI resource type, and a separate DNS subscription without rewriting caller IDs."
  }
}

run "valid_upper_boundaries_and_adjacent_cidrs" {
  command = plan

  variables {
    name                = join("", [for index in range(63) : "a"])
    private_dns_zone_id = replace(var.private_dns_zone_id, "/private.", "/${join("", [for index in range(32) : "s"])}.private.")
    network = {
      pod_cidr       = "10.240.1.0/24"
      service_cidr   = "10.240.0.0/24"
      dns_service_ip = "10.240.0.254"
    }
    tags = merge(
      { for index in range(49) : format("tag-%02d", index) => "" },
      { (join("", [for index in range(512) : "k"])) = join("", [for index in range(256) : "v"]) }
    )
  }

  assert {
    condition = (
      length(azapi_resource.this.name) == 63 &&
      azapi_resource.this.tags == var.tags &&
      length(azapi_resource.this.tags) == 50 &&
      azapi_resource.this.body.properties.apiServerAccessProfile.privateDNSZone == var.private_dns_zone_id &&
      azapi_resource.this.body.properties.networkProfile.podCidr == "10.240.1.0/24" &&
      azapi_resource.this.body.properties.networkProfile.serviceCidr == "10.240.0.0/24" &&
      azapi_resource.this.body.properties.networkProfile.dnsServiceIP == "10.240.0.254"
    )
    error_message = "Accept inclusive name/tag/subzone limits, adjacent nonoverlapping CIDRs, and the last usable DNS address."
  }
}

run "minimal_name_empty_tags_and_first_usable_dns" {
  command = plan

  variables {
    name = "ak"
    tags = {}
    network = {
      pod_cidr       = "172.20.0.0/16"
      service_cidr   = "192.0.2.0/24"
      dns_service_ip = "192.0.2.2"
    }
  }

  assert {
    condition = (
      output.name == "ak" &&
      length(azapi_resource.this.tags) == 0 &&
      azapi_resource.this.body.properties.networkProfile.dnsServiceIP == "192.0.2.2"
    )
    error_message = "A two-character name, no organization-specific tags, and the first usable DNS address must be accepted."
  }
}

run "reject_name_below_minimum" {
  command = plan
  variables {
    name = "a"
  }
  expect_failures = [var.name]
}

run "reject_name_above_maximum" {
  command = plan
  variables {
    name = join("", [for index in range(64) : "a"])
  }
  expect_failures = [var.name]
}

run "reject_name_invalid_character" {
  command = plan
  variables {
    name = "aks_contract"
  }
  expect_failures = [var.name]
}

run "reject_name_leading_hyphen" {
  command = plan
  variables {
    name = "-aks-contract"
  }
  expect_failures = [var.name]
}

run "reject_name_trailing_hyphen" {
  command = plan
  variables {
    name = "aks-contract-"
  }
  expect_failures = [var.name]
}

run "reject_noncanonical_location_case" {
  command = plan
  variables {
    location = "SwedenCentral"
  }
  expect_failures = [var.location]
}

run "reject_location_display_name" {
  command = plan
  variables {
    location = "sweden central"
  }
  expect_failures = [var.location]
}

run "reject_resource_group_invalid_subscription" {
  command = plan
  variables {
    resource_group_id = "/subscriptions/not-a-uuid/resourceGroups/rg-workload-contract"
  }
  expect_failures = [var.resource_group_id]
}

run "reject_resource_group_extra_path" {
  command = plan
  variables {
    resource_group_id = "${var.resource_group_id}/unexpected"
  }
  expect_failures = [var.resource_group_id]
}

run "reject_identity_wrong_resource_type" {
  command = plan
  variables {
    cluster_identity_id = replace(var.cluster_identity_id, "userAssignedIdentities", "systemAssignedIdentities")
  }
  expect_failures = [var.cluster_identity_id]
}

run "reject_identity_noncanonical_resource_type_case" {
  command = plan
  variables {
    cluster_identity_id = replace(var.cluster_identity_id, "Microsoft.ManagedIdentity/userAssignedIdentities", "MICROSOFT.MANAGEDIDENTITY/USERASSIGNEDIDENTITIES")
  }
  expect_failures = [var.cluster_identity_id]
}

run "reject_subnet_query_suffix" {
  command = plan
  variables {
    subnet_ids = merge(var.subnet_ids, { user_nodes = "${var.subnet_ids.user_nodes}?api-version=invalid" })
  }
  expect_failures = [var.subnet_ids]
}

run "reject_null_system_subnet" {
  command = plan
  variables {
    subnet_ids = merge(var.subnet_ids, { system_nodes = null })
  }
  expect_failures = [var.subnet_ids]
}

run "reject_duplicate_subnets_ignoring_case" {
  command = plan
  variables {
    subnet_ids = merge(var.subnet_ids, { user_nodes = upper(var.subnet_ids.api_server) })
  }
  expect_failures = [var.subnet_ids]
}

run "reject_subnets_in_different_vnets" {
  command = plan
  variables {
    subnet_ids = merge(var.subnet_ids, { system_nodes = replace(var.subnet_ids.system_nodes, "vnet-contract", "vnet-other") })
  }
  expect_failures = [var.subnet_ids]
}

run "reject_vnet_in_different_cluster_subscription" {
  command = plan
  variables {
    subnet_ids = {
      for role, id in var.subnet_ids :
      role => replace(id, "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "cccccccc-cccc-cccc-cccc-cccccccccccc")
    }
  }
  expect_failures = [var.subnet_ids]
}

run "reject_system_dns_mode" {
  command = plan
  variables {
    private_dns_zone_id = "system"
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_none_dns_mode" {
  command = plan
  variables {
    private_dns_zone_id = "none"
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_public_dns_resource_type" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "privateDnsZones", "dnsZones")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_private_link_dns_suffix" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "/private.", "/privatelink.")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_dns_zone_for_another_region" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "swedencentral", "northeurope")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_multilabel_dns_subzone" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "/private.", "/team.app.private.")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_dns_subzone_above_maximum" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "/private.", "/${join("", [for index in range(33) : "s"])}.private.")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_dns_subzone_invalid_character" {
  command = plan
  variables {
    private_dns_zone_id = replace(var.private_dns_zone_id, "/private.", "/bad_label.private.")
  }
  expect_failures = [var.private_dns_zone_id]
}

run "reject_null_pod_cidr" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = null })
  }
  expect_failures = [var.network]
}

run "reject_null_service_cidr" {
  command = plan
  variables {
    network = merge(var.network, { service_cidr = null })
  }
  expect_failures = [var.network]
}

run "reject_null_dns_service_ip" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = null })
  }
  expect_failures = [var.network]
}

run "reject_pod_cidr_host_bits" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = "172.20.0.1/16" })
  }
  expect_failures = [var.network]
}

run "reject_service_cidr_invalid_octet" {
  command = plan
  variables {
    network = merge(var.network, { service_cidr = "999.240.0.0/16" })
  }
  expect_failures = [var.network]
}

run "reject_cidr_leading_zero_octet" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = "172.020.0.0/16" })
  }
  expect_failures = [var.network]
}

run "reject_ipv6_pod_cidr" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = "fd00::/64" })
  }
  expect_failures = [var.network]
}

run "reject_cidr_prefix_outside_ipv4_range" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = "172.20.0.0/33" })
  }
  expect_failures = [var.network]
}

run "reject_identical_pod_and_service_ranges" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = var.network.service_cidr })
  }
  expect_failures = [var.network]
}

run "reject_pod_range_containing_service_range" {
  command = plan
  variables {
    network = merge(var.network, { pod_cidr = "10.0.0.0/8" })
  }
  expect_failures = [var.network]
}

run "reject_service_range_containing_pod_range" {
  command = plan
  variables {
    network = merge(var.network, {
      service_cidr   = "172.0.0.0/8"
      dns_service_ip = "172.0.0.10"
    })
  }
  expect_failures = [var.network]
}

run "reject_dns_outside_service_range" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.241.0.10" })
  }
  expect_failures = [var.network]
}

run "reject_dns_network_address" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.240.0.0" })
  }
  expect_failures = [var.network]
}

run "reject_dns_first_service_address" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.240.0.1" })
  }
  expect_failures = [var.network]
}

run "reject_dns_broadcast_address" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.240.255.255" })
  }
  expect_failures = [var.network]
}

run "reject_dns_leading_zero_octet" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "010.240.0.10" })
  }
  expect_failures = [var.network]
}

run "reject_dns_invalid_octet" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.240.0.300" })
  }
  expect_failures = [var.network]
}

run "reject_dns_with_cidr_suffix" {
  command = plan
  variables {
    network = merge(var.network, { dns_service_ip = "10.240.0.10/32" })
  }
  expect_failures = [var.network]
}

run "reject_blank_tag_key" {
  command = plan
  variables {
    tags = { "   " = "test" }
  }
  expect_failures = [var.tags]
}

run "reject_too_many_tags" {
  command = plan
  variables {
    tags = { for index in range(51) : format("tag-%02d", index) => "test" }
  }
  expect_failures = [var.tags]
}

run "reject_tag_key_above_maximum" {
  command = plan
  variables {
    tags = { (join("", [for index in range(513) : "k"])) = "test" }
  }
  expect_failures = [var.tags]
}

run "reject_tag_value_above_maximum" {
  command = plan
  variables {
    tags = { test = join("", [for index in range(257) : "v"]) }
  }
  expect_failures = [var.tags]
}

run "reject_null_tag_value" {
  command = plan
  variables {
    tags = { test = null }
  }
  expect_failures = [var.tags]
}

run "reject_duplicate_tag_keys_ignoring_case" {
  command = plan
  variables {
    tags = {
      Environment = "test"
      environment = "test"
    }
  }
  expect_failures = [var.tags]
}
