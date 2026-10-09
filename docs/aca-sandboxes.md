# Azure Container Apps Sandboxes for this session

Short verdict: sandbox execution checks succeeded in a Management-side group, not a validated Corp deployment. The intended Corp live moment remains gated until an approved IaC deployment and read-back in Corp confirm placement and effective policy compliance. The official Copilot CLI plugin needs one extra preflight check because the plugin installed in a disabled state on this machine.

## What it is

Azure Container Apps Sandboxes are hardware-isolated microVM sandboxes exposed through the ARM resource type `Microsoft.App/SandboxGroups`. Azure Updates lists the feature as preview in June 2026 and generally available in September 2026. The Learn overview and quickstarts show three surfaces that matter for this talk:

- ARM and Bicep create the sandbox group
- the `aca` CLI creates and operates individual sandboxes
- the `aca-sandboxes` Copilot CLI skill teaches the agent how to drive the `aca` CLI with natural language

## Why it matters here

This talk already shows Copilot CLI and Squad helping with Terraform. ACA Sandboxes adds an execution example for a separate question: where do you run untrusted or AI-written code when you need isolation from the presenter laptop? A conditional C4 variant can demonstrate that without adding a chapter. It does not establish Azure acceptance of the AKS module.

## Verified facts

- Status: generally available in September 2026, after a June 2026 preview period
- Observed sandbox group region: Norway East; availability and prerequisites for the intended Corp target still require verification
- Required role: Container Apps SandboxGroup Data Owner for sandbox data-plane operations
- Authentication: Microsoft Entra ID only
- Networking: sandbox groups can attach to a delegated subnet with `Microsoft.App/sandboxGroups/vnetConnections`; no managed environment is required
- Egress model: rule-based allow and deny with `Allow`, `Deny`, `Transform`, and `Rewrite`, plus traffic inspection modes `Full`, `Partial`, `None`, and `Legacy`
- Recommended posture for untrusted code: default action `Deny` with an explicit allow list
- Public disks available on this machine included `copilot`, `azure-dev`, `ubuntu`, several Python disks, Node 22 and 24, and .NET 8 through 10
- Sandbox tiers from Learn: XS, S, M, L, XL
- Quota note from Learn: Sandboxes and Express are limited to 2,000 cores
- Cost note from Learn: stopped sandboxes do not accrue CPU or memory charges; this runbook did not derive a bill-backed per-run amount from the public retail pricing APIs

## Observed deployment and intended Corp gate

Read-back on 9 October 2026 found a sandbox group in Norway East with provisioning state `Succeeded`. Its subscription is under Management > Platform, not Corp. `aca doctor` passed 9/9 checks, and the sandbox list was empty at that time. These observations establish the Management-side group's current status, not a Corp deployment or policy-compliance result.

The Corp-only deployment requirement is unchanged. The intended live moment stays gated until an approved IaC deployment and read-back in Corp confirm the reviewed scope and effective policy compliance. The successful prior sandbox executions below do not close that gate.

## How this differs from the other sandbox stories

| Surface | Where it runs | Isolation and control | Best fit in this session |
| --- | --- | --- | --- |
| Copilot CLI local `/sandbox` | On the presenter machine | Local process isolation with filesystem and network policy | Mention as context only |
| ACA Sandboxes | In Azure, per-sandbox microVM | Cloud isolation, configurable egress, suspend and resume, explicit lifecycle | Conditional C4 execution check, only after Corp qualification |
| Squad on ACA | Azure Container Apps jobs and supporting Azure services | Long-running agent workflow hosting and side-track automation | Separate side track, not the fast validation clip |

`/sandbox` manages local filesystem and network policy; local sandboxing is off by default and enabled with `/sandbox enable`. On Windows, it requires a supported recent Windows 11 build and the applicable update prerequisites in the official [OS support information](https://aka.ms/ghcp-sandbox-os-support). Feature support, including denied paths, localhost, and proxying, depends on that Windows version. MXC process isolation runs on the host, not in a separate VM or container. Built-in in-process file tools honor policy on a best-effort basis, and remote MCP servers are not sandboxed.

Windows proxy and host rules require supported features and **Allow local network**. They rely on applications honoring proxy settings, so they are not an airtight restriction on every process's direct connections. This is brief context, not a substitute for ACA microVM isolation or evidence that the intended Corp target is ready ([GitHub documentation](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).

## Preflight

These are manual operator prerequisites, not actions performed by this documentation revision. Complete them before the room; any unmet item keeps the Corp live variant gated:

1. Install the plugin from Learn:
   - `/plugin marketplace add microsoft/azure-container-apps`
   - `/plugin install sandboxes@Azure-Container-Apps`
2. Run `copilot plugin list`.
3. If the plugin shows `[disabled]`, run `copilot plugin enable sandboxes@Azure-Container-Apps`.
4. Install the `aca` CLI from Learn and verify `aca --help`.
5. Confirm the exact private IaC PR, reviewed plan, and human environment approval for the Corp group. Read back Corp placement, provisioning, the approved deny-by-default network/egress configuration, and effective policy inheritance, parameters, enforcement, exclusions, and exemptions. Confirm the approved group exists and `aca doctor` passes. A green doctor result is connectivity evidence, not this policy gate.
6. Confirm the approved data-plane scope, operator access, capacity, budget, expiry, and cleanup owner. Prepare one sandbox, its Terraform 1.16.5 installation, dependencies, and a reviewed public-only archive before the timed chapter. Run `/workspaces/bin/terraform init -backend=false -input=false` in `/workspaces/module` during this preflight, not on stage. Keep sandbox checks uncredentialed for Azure, with the reviewed mocked test suite. Do not provision a group or change networking on stage.
7. Record the archive's source revision and hash. It must contain the intended root `tests\validation.tftest.hcl` suite, not private inputs, credentials, backend/state, or a saved plan. Keep the archive at a generic operator-resolved path such as `<reviewed-module-archive.zip>`.
8. Rehearse the exact prepared-sandbox prompt below on the approved Corp target, retaining real numeric process exits and sanitized output. Prepare labeled fallback evidence and confirm no identifiers appear on screen. Plugin enablement, `aca doctor`, and the Management-side runs alone do not qualify this variant.

## Prior fresh-sandbox prompt and scoped observed outcomes

Generic form of the prompt used for the successful skill-based Management-side run:

This describes the earlier Management-side run, not the timed C4 procedure. Before any separately approved reuse, the operator supplies the reviewed sandbox group, resource group, and module archive path for that scope, replacing `<reviewed-sandbox-group>`, `<reviewed-resource-group>`, and `<reviewed-module-archive.zip>`. The observed Management-side group does not satisfy the Corp-only requirement.

```text
Use the aca-sandboxes skill. Add $env:USERPROFILE\.aca\bin to PATH when you invoke shell commands. In sandbox group <reviewed-sandbox-group> and resource group <reviewed-resource-group>, create a fresh sandbox labeled name=livecopilot3 on the copilot disk with egress Deny and these allow rules only: *.hashicorp.com, registry.terraform.io, github.com, objects.githubusercontent.com, release-assets.githubusercontent.com, *.githubusercontent.com. Install Terraform 1.16.5 under /workspaces/bin. Upload <reviewed-module-archive.zip>, unzip to /workspaces/module, run /workspaces/bin/terraform init -backend=false -input=false, /workspaces/bin/terraform validate -no-color, and /workspaces/bin/terraform test -test-directory=tests -no-color. Then print HTTP status for https://example.com and https://registry.terraform.io, report the sandbox id, and stop without deleting it.
```

Sanitized outcome from the recovered skill-driven Management-side session (execution success, not Corp acceptance):

- `skill(aca-sandboxes)` was invoked
- sandbox created on the `copilot` disk with default egress `Deny`
- Terraform 1.16.5 installed inside the sandbox
- module zip uploaded and expanded under `/workspaces/module`
- `terraform init -backend=false -input=false` passed
- `terraform validate -no-color` passed
- `terraform test -test-directory=tests -no-color` passed with 10 root negative-validation checks passed and 0 failed
- `https://example.com` returned HTTP 403
- `https://registry.terraform.io` returned HTTP 200

The same workflow also ran successfully in Management from a fresh Copilot CLI session before the plugin was enabled. In that run, the agent fell back to the `aca` CLI directly after reporting that the skill was unavailable. Both recovered sessions show successful initialization and validation, 10 passed and 0 failed tests, and the HTTP 200/403 observations. That fallback is useful to keep in reserve.

These notes do not establish exact numeric process exit codes: the skill-driven session printed fields such as `INIT=True` because of local shell-variable expansion, not actual numeric exits. The fallback session explicitly did not identify the origin of HTTP 403. An observed 403 alone does not prove sandbox egress-policy enforcement or Azure Policy enforcement. Neither session validates Corp placement or effective policy compliance.

## Correct Terraform command for this module checkout

For `martinopedal/terraform-azapi-aks-automatic`, the working offline test command was:

```powershell
terraform test -test-directory=tests -no-color
```

This repository's `-filter` form did not select the file correctly in our run. The test directory form executed `tests\validation.tftest.hcl` and passed 10 of 10 root negative-validation checks. These are not the session's 52 child-module cases plus two caller cases, and they do not establish that C3's live edit was included in the archived source.

## Timing

Two fresh Copilot CLI runs completed end to end in Management:

- First fresh session: successful validation and observed HTTP responses, about 2:58 total
- Second fresh session after enabling the plugin and tightening the prompt: successful validation and observed HTTP responses, about 1:47 total

The prepared shell-only path was faster, but that does not predict a fresh Copilot turn. Model/tool discovery and command shaping vary. Neither Management-side duration qualifies a Corp run or guarantees a 90-second clip. Rehearse the prepared-resource variant below and obey the cut even if the model is still working.

## Recommended live use

Keep the base C4 skill, read-only MCP lookup, and permission flow when the Corp gate is unmet. If useful, show a sanitized saved excerpt explicitly labeled **Management-side execution evidence, not Corp validation**. Never rerun the Management target to stand in for Corp.

Only after approved Corp IaC, policy read-back, and the exact presenter preflight pass may the operator select the C4 variant. It replaces part of the deeper MCP lookup inside **29:30-33:30**, with the same **32:30 cut**. It adds no chapter, changes no other slide budgets, and uses none of the 55:00-58:00 protected slack. See [the C4 operator procedure](demo-runbook.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes).

| Wall clock | Budget | Operator action |
| --- | --- | --- |
| 29:30-30:00 | 0:30 | Name the selected variant and approved scope; show the skill and one prepared, cited read-only source. Label the source as preflight evidence, not a live MCP call. |
| 30:00-32:00 | 2:00 | Manually select the rehearsed, separately scoped ACA session and submit the single prompt below against the prepared sandbox. Inspect each native permission request. No creation, upload, dependency installation, or retry on stage. |
| 32:00-32:30 | 0:30 | Inspect completed checks, actual numeric exits, and HTTP observations; if unfinished, state that and use labeled fallback. |
| 32:30-33:30 | 1:00 | Cut the live attempt, state evidence limits, and hand back to the base Terraform checkpoint for C5. |

The operator privately resolves the three reviewed identifiers before rehearsal. Do not display their real values or an unreviewed raw response. The ACA session uses its own inspected tools and permissions; do not broaden the native Terraform validator to run it.

```text
Use the aca-sandboxes skill in the preflight-qualified Corp scope only. In sandbox group <reviewed-sandbox-group> and resource group <reviewed-resource-group>, use the existing prepared sandbox <reviewed-sandbox-id>. Do not create resources, upload files, install dependencies, change egress, contact Azure deployment APIs, or change the approved lifecycle. In /workspaces/module, run /workspaces/bin/terraform validate -no-color and /workspaces/bin/terraform test -test-directory=tests -no-color once. Capture each real numeric exit immediately inside the sandbox, not a PowerShell success Boolean. Report the root negative-validation test count, archive source revision, and sanitized output. Then report HTTP observations for https://example.com and https://registry.terraform.io without changing rules. Do not print real Azure identifiers, credentials, or private paths. Stop the task after this single attempt; do not retry or change the sandbox lifecycle.
```

Evidence is the actual output tied to the approved target, archive revision/hash, time, and numeric exits, not the agent's summary alone. A fresh `validate` and 10/10 root negative-validation result do not deploy AKS. A 403 is an HTTP observation; attribute it to egress enforcement only if separately corroborated by inspected configuration and diagnostic evidence. Corp policy qualification remains a separate private read-back.

Keep operator records outside public source. Generic rehearsal pointers are `evidence\aca-corp-preflight.json`, `evidence\aca-corp-checks.txt`, and `evidence\aca-management-session.txt`; these are suggested names, not claims that files or Corp evidence already exist. Preserve timing, failures, and the exact source revision. The operator handles approved stop/cleanup off-stage under the recorded expiry and cleanup ownership.

## Fallback if capacity, plugin, or network misbehaves

- Resolve a disabled plugin before rehearsal. The disabled state was a local observation, not a universal installation default.
- If Corp qualification or prepared-resource rehearsal is incomplete, keep base C4. A saved Management-side excerpt must retain that label and its Boolean-exit/403 limitations.
- If the chosen live variant fails or reaches the cut, do not retry, switch regions, change allow rules, or start the historical fresh-sandbox flow. Show already reviewed evidence with its actual scope, or return to the original MCP demonstration.
- Direct `aca` operation is a separate manually rehearsed option, not an unrehearsed rescue during C4. No capacity or venue-network failure authorizes changes to existing infrastructure.
