# Only computed ID/response fields are fixtures. Neither the local module nor its body is overridden.
mock_provider "azapi" {
  override_during = plan

  mock_resource "azapi_resource" {
    defaults = {
      id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-corp-example/providers/Microsoft.ContainerService/managedClusters/aks-corp-example"
      output = {
        properties = {
          nodeResourceGroup = "MC_example_fixture"
          privateFQDN       = "aks-example.private.example.invalid"
          provisioningState = "MockOnly"
          oidcIssuerProfile = {
            issuerURL = "https://issuer.example.invalid/example/"
          }
        }
      }
    }
  }
}

run "default_example_consumes_local_module" {
  command = plan

  assert {
    condition = (
      output.id == "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-corp-example/providers/Microsoft.ContainerService/managedClusters/aks-corp-example" &&
      output.name == "aks-corp-example" &&
      output.node_resource_group == "MC_example_fixture" &&
      output.private_fqdn == "aks-example.private.example.invalid" &&
      output.oidc_issuer_url == "https://issuer.example.invalid/example/" &&
      output.provisioning_state == "MockOnly"
    )
    error_message = "The real example/module call must return all six plan-known fixture outputs without live authentication."
  }

  assert {
    condition = (
      module.aks.id == output.id &&
      module.aks.name == output.name &&
      module.aks.node_resource_group == output.node_resource_group &&
      module.aks.private_fqdn == output.private_fqdn &&
      module.aks.oidc_issuer_url == output.oidc_issuer_url &&
      module.aks.provisioning_state == output.provisioning_state
    )
    error_message = "Example outputs must forward the actual child-module outputs."
  }

  assert {
    condition = (
      lower(split("/", var.private_dns_zone_id)[2]) != lower(split("/", var.resource_group_id)[2]) &&
      lower(split("/", var.resource_group_id)[2]) == "00000000-0000-0000-0000-000000000000"
    )
    error_message = "Keep the published defaults synthetic, including the separate fictional DNS subscription."
  }

  # Child resource internals are asserted in the child suite; here verify the consumer boundary.
  assert {
    condition = (
      join(",", flatten([
        for filename in fileset(path.module, "*.tf") : [
          for declaration in regexall("(?m)^\\s*module\\s+\"([^\"]+)\"\\s*\\{", file("${path.module}/${filename}")) :
          declaration[0]
        ]
      ])) == "aks" &&
      length(regexall("(?m)^\\s*source\\s*=\\s*\"\\.\\./\\.\\.\"\\s*$", file("${path.module}/main.tf"))) == 1 &&
      alltrue([
        for input in ["cluster_identity_id", "location", "name", "network", "private_dns_zone_id", "resource_group_id", "subnet_ids", "tags"] :
        length(regexall("(?m)^\\s*${input}\\s*=\\s*var\\.${input}\\s*$", file("${path.module}/main.tf"))) == 1
      ])
    )
    error_message = "The example must call the real local child once and pass all eight caller inputs directly."
  }

  assert {
    condition = (
      length(fileset(path.module, "*.tf.json")) == 0 &&
      alltrue([
        for filename in fileset(path.module, "*.tf") :
        length(regexall("(?m)^\\s*(resource|data|backend|provisioner|exec|import|removed)\\s*(\"|\\{)", file("${path.module}/${filename}"))) == 0
      ]) &&
      join(",", flatten([
        for filename in fileset(path.module, "*.tf") : [
          for declaration in regexall("(?m)^\\s*provider\\s+\"([^\"]+)\"\\s*\\{", file("${path.module}/${filename}")) :
          declaration[0]
        ]
      ])) == "azapi"
    )
    error_message = "The caller may configure only AzAPI, with no backend, extra resources, live data, workload provider, or exec path."
  }
}

run "caller_name_override_reaches_child" {
  command = plan

  variables {
    name = "aks-example-override"
    tags = {
      environment = "test"
      owner       = "example-caller"
    }
  }

  assert {
    condition = (
      output.name == "aks-example-override" &&
      module.aks.name == "aks-example-override" &&
      output.private_fqdn == "aks-example.private.example.invalid" &&
      output.oidc_issuer_url == "https://issuer.example.invalid/example/" &&
      output.provisioning_state == "MockOnly"
    )
    error_message = "A real caller input override must reach the child while computed outputs remain known and explicitly synthetic."
  }
}
