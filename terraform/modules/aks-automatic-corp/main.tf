# MIT License
#
# Copyright (c) 2026 martinopedal
# Copyright (c) Microsoft Corporation. All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# Public references:
# https://github.com/martinopedal/terraform-azapi-aks-automatic/tree/e9a9a481b9b5bf3a4af8046cb602895c89a9ac24
# https://github.com/Azure/terraform/tree/0af68bf1013a6e7edc498db58b1db5c55563bda3/quickstart/101-aks-automatic-private-custom-network-azapi
# This is a fresh child module, not the baseline root/Kubernetes composition.

resource "azapi_resource" "this" {
  type                      = "Microsoft.ContainerService/managedClusters@2026-04-01"
  name                      = var.name
  parent_id                 = var.resource_group_id
  location                  = var.location
  tags                      = var.tags
  schema_validation_enabled = true

  body = {
    sku = {
      name = "Automatic"
      tier = "Standard"
    }

    properties = {
      aadProfile = {
        managed         = true
        enableAzureRBAC = true
      }

      apiServerAccessProfile = {
        enablePrivateCluster           = true
        enablePrivateClusterPublicFQDN = false
        enableVnetIntegration          = true
        subnetId                       = var.subnet_ids.api_server
        privateDNSZone                 = var.private_dns_zone_id
      }

      disableLocalAccounts = true
      enableRBAC           = true

      hostedSystemProfile = {
        enabled            = true
        nodeSubnetID       = var.subnet_ids.user_nodes
        systemNodeSubnetID = var.subnet_ids.system_nodes
      }

      networkProfile = {
        networkPlugin     = "azure"
        networkPluginMode = "overlay"
        networkDataplane  = "cilium"
        loadBalancerSku   = "standard"
        outboundType      = "userDefinedRouting"
        podCidr           = var.network.pod_cidr
        serviceCidr       = var.network.service_cidr
        dnsServiceIP      = var.network.dns_service_ip
      }

      nodeProvisioningProfile = {
        mode             = "Auto"
        defaultNodePools = "Auto"
      }

      oidcIssuerProfile = {
        enabled = true
      }

      securityProfile = {
        workloadIdentity = {
          enabled = true
        }
      }
    }
  }

  response_export_values = [
    "properties.nodeResourceGroup",
    "properties.oidcIssuerProfile.issuerURL",
    "properties.privateFQDN",
    "properties.provisioningState"
  ]

  identity {
    type         = "UserAssigned"
    identity_ids = [var.cluster_identity_id]
  }

  lifecycle {
    prevent_destroy = true
  }
}
