# Azure Container Apps Sandboxes for this session

Short verdict: feasible in the Corp landing zone, with one new Norway East resource group and a creates-only sandbox group deployment. The short live moment works. The official Copilot CLI plugin needs one extra preflight check because the plugin installed in a disabled state on this machine.

## What it is

Azure Container Apps Sandboxes are hardware-isolated microVM sandboxes exposed through the ARM resource type `Microsoft.App/SandboxGroups`. Azure Updates lists the feature as preview in June 2026 and generally available in September 2026. The Learn overview and quickstarts show three surfaces that matter for this talk:

- ARM and Bicep create the sandbox group
- the `aca` CLI creates and operates individual sandboxes
- the `aca-sandboxes` Copilot CLI skill teaches the agent how to drive the `aca` CLI with natural language

## Why it matters here

This talk already shows Copilot CLI and Squad helping with Terraform. ACA Sandboxes adds one clean proof point for the question every audience asks next: where do you run untrusted or AI-written code when you want stronger isolation than the presenter laptop gives you. A short live moment makes that concrete.

## Verified facts

- Status: generally available in September 2026, after a June 2026 preview period
- Regions verified from the Microsoft.App provider metadata in the Corp subscription include Norway East and Sweden Central
- Required role: Container Apps SandboxGroup Data Owner for sandbox data-plane operations
- Authentication: Microsoft Entra ID only
- Networking: sandbox groups can attach to a delegated subnet with `Microsoft.App/sandboxGroups/vnetConnections`; no managed environment is required
- Egress model: rule-based allow and deny with `Allow`, `Deny`, `Transform`, and `Rewrite`, plus traffic inspection modes `Full`, `Partial`, `None`, and `Legacy`
- Recommended posture for untrusted code: default action `Deny` with an explicit allow list
- Public disks available on this machine included `copilot`, `azure-dev`, `ubuntu`, several Python disks, Node 22 and 24, and .NET 8 through 10
- Sandbox tiers from Learn: XS, S, M, L, XL
- Quota note from Learn: Sandboxes and Express are limited to 2,000 cores
- Cost note from Learn: stopped sandboxes do not accrue CPU or memory charges; this runbook did not derive a bill-backed per-run amount from the public retail pricing APIs

## What we deployed in Corp

- New resource group in Norway East for this demo only
- One sandbox group deployed with ARM after a group-scope what-if showed a single create
- No changes or destroys to any pre-existing resource
- Data-plane role assigned only on the sandbox group scope

The final what-if showed one create for the sandbox group. The group deployment then succeeded in the same Norway East region used by the Squad on ACA side track.

## How this differs from the other sandbox stories

| Surface | Where it runs | Isolation and control | Best fit in this session |
| --- | --- | --- | --- |
| Copilot CLI local `/sandbox` | On the presenter machine | Local process isolation with filesystem and network policy | Mention as context only |
| ACA Sandboxes | In Azure, per-sandbox microVM | Cloud isolation, deny-by-default egress, suspend and resume, explicit lifecycle | Short live proof for untrusted code execution |
| Squad on ACA | Azure Container Apps jobs and supporting Azure services | Long-running agent workflow hosting and side-track automation | Separate side track, not the fast validation clip |

`/sandbox` manages local filesystem and network policy; sandboxing is off by default and enabled with `/sandbox enable`. Its MXC process isolation runs on the host, not in a separate VM or container, and does not sandbox remote MCP servers. This brief mention complements, rather than replaces, the ACA Sandboxes live microVM moment ([GitHub documentation](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).

## Preflight

Run these before the room:

1. Install the plugin from Learn:
   - `/plugin marketplace add microsoft/azure-container-apps`
   - `/plugin install sandboxes@Azure-Container-Apps`
2. Run `copilot plugin list`.
3. If the plugin shows `[disabled]`, run `copilot plugin enable sandboxes@Azure-Container-Apps`.
4. Install the `aca` CLI from Learn and verify `aca --help`.
5. Confirm the sandbox group exists and `aca doctor` passes.
6. Keep a pre-zipped copy of the module ready for upload.

## Exact live prompts and the sanitized outcomes

Prompt that matched the successful skill-based run from `C:\git\squad-terraform-session-2026-10-14\public`:

```text
Use the aca-sandboxes skill. Add $env:USERPROFILE\.aca\bin to PATH when you invoke shell commands. In sandbox group sbg-squad-nic2026-corp-ne-002 and resource group rg-aca-sandboxes-corp-ne-002, create a fresh sandbox labeled name=livecopilot3 on the copilot disk with egress Deny and these allow rules only: *.hashicorp.com, registry.terraform.io, github.com, objects.githubusercontent.com, release-assets.githubusercontent.com, *.githubusercontent.com. Install Terraform 1.16.5 under /workspaces/bin. Upload C:\git\squad-terraform-session-2026-10-14\aca-sandboxes\module-upload.zip, unzip to /workspaces/module, run /workspaces/bin/terraform init -backend=false -input=false, /workspaces/bin/terraform validate -no-color, and /workspaces/bin/terraform test -test-directory=tests -no-color. Then print HTTP status for https://example.com and https://registry.terraform.io, report the sandbox id, and stop without deleting it.
```

Sanitized outcome:

- `skill(aca-sandboxes)` was invoked
- sandbox created on the `copilot` disk with default egress `Deny`
- Terraform 1.16.5 installed inside the sandbox
- module zip uploaded and expanded under `/workspaces/module`
- `terraform init -backend=false -input=false` passed
- `terraform validate -no-color` passed
- `terraform test -test-directory=tests -no-color` passed with 10 passed and 0 failed
- `https://example.com` returned HTTP 403
- `https://registry.terraform.io` returned HTTP 200

The same workflow also ran successfully from a fresh Copilot CLI session before the plugin was enabled. In that run, the agent fell back to the `aca` CLI directly after reporting that the skill was unavailable. That fallback is useful to keep in reserve.

## Correct Terraform command for this module checkout

For `martinopedal/terraform-azapi-aks-automatic`, the working offline test command was:

```powershell
terraform test -test-directory=tests -no-color
```

This repository's `-filter` form did not select the file correctly in our run. The test directory form executed `tests\validation.tftest.hcl` and passed 10 of 10 checks.

## Timing

Two fresh Copilot CLI runs completed end to end:

- First fresh session: successful validation and egress proof, about 2:58 total
- Second fresh session after enabling the plugin and tightening the prompt: successful validation and egress proof, about 1:47 total

The shell-only path was much faster after preflight. Create, upload, install Terraform, and run the checks fit comfortably inside a minute when driven directly with prepared `aca` commands. The Copilot-driven path was slower because the agent spent time discovering the newly installed tool and shaping shell commands.

## Recommended live use

Use ACA Sandboxes as a short proof point, not as a new main chapter. Keep the live clip to:

1. one prompt
2. one create
3. one validate and test pass
4. one blocked request and one allowed request

## Fallback if capacity, plugin, or network misbehaves

- If the plugin is disabled, enable it and retry once
- If skill loading still fails, use the same flow through direct `aca` commands
- If provider downloads fail, show the deny-by-default policy and explain the missing allow-list dependency
- If the venue network is noisy, use the already-deployed sandbox group and a saved transcript excerpt with the sanitized outputs above
- If Norway East is unavailable on the day, do not touch Pool A1 or the existing demo. Fall back to the talk-track block and the saved evidence
