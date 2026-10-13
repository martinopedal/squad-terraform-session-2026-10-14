# Prompt pack: build a module like this, repeatably

Run these prompts in order to build or extend an AKS Automatic Terraform module with GitHub Copilot CLI, Squad, the three native agent profiles, and read-only MCP documentation lookups. They match the lanes in [AGENTS.md](../AGENTS.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) and the evidence rules in [QUALITY.md](../QUALITY.md). Step-by-step: [playbook](playbook.md).

Repeatable does not mean identical output. A model can choose differently on two runs. These prompts narrow the choices, make every claim checkable, and make a wrong turn visible early. Measure it: run a brief five times from the same checkpoint and count green runs (see [Measure repeatability](#measure-repeatability)).

Audience: public module contributors. [The repo map](repositories.md) separates
canonical reusable Automatic/Corp source, this session's teaching copy and the
live AKS consumer. These prompts do not approve a deployment or move private
values/state into public source.

For the separate product demos use [hosted Squad issue-to-PR versus host
Copilot/Squad-driven native ACA isolation](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
Native Online five-object provisioning/current operator access/base probe were
independently verified October 12, not AKS/hosted Jobs or Corp network/identity
transplantation. A corrected 26.768-second host run returned three positive guest checks/JSON+SHA,
actual exit23 and causal HTTPS-denial/cleanup proof. Independent acceptance is
complete; native card runtime-ready after acceptance, stage GO still separate.
The earlier CRLF harness failure is learning history.
The installed ACA skill gives guidance, not acceptance. Advanced in-MicroVM
CLI/Squad runtime is optional and separately consented, not the basic host
orchestration prerequisite. Current [progress/coverage](aca-sandboxes.md#full-test-coverage-checklist)
must not be replaced by these example prompts.

## Two product demo prompt recipes

These recipes describe **host Squad isolated work** and **Haflidi's original
hosted issue-to-agent-to-PR flow**, not two VM paths. They are reusable briefs,
not transcripts or permission to create resources. Privately bind approved
targets and exact input revisions; retain raw commands/results outside public
source. Show sanitized source/check/handoff evidence, never tokens or private
context. [Operator cards](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes)
own the timing, fallback and cleanup.

<a id="native-host-squad-isolated-work"></a>

### Native host Squad isolated work: ACA SANDBOXES

This is native hardware-isolated MicroVM work, not ACA Apps/Jobs hosting.
Both product paths need their own accepted current proof; this receipt does
not establish the hosted issue -> Job/agent -> PR chain.

| Field | Contract |
| --- | --- |
| Owner / roles | Martin/host Squad coordinates; one native operator/worker runs the bounded ACA calls; an independent validator/reviewer checks returned output and limits |
| Repos / roots | Public session clone for prompts/notes and approved public fixture; [demo-env](https://github.com/martinopedal/aks-automatic-demo-env) `deployments\aca-sandboxes-online` owns native provisioning source. CLI/Squad stay on the host; isolated work runs in the MicroVM |
| Verified now | Separate Online five-object deployment, current operator access and credential-free base exec/fs/stop-resume/delete passed; final list empty. This is not both-presenter or successful-work integration GO |
| Corrected current run | Actual host coordinator/worker/tools/guest-results/cleanup handoff. One 26.768-second sandbox: LF/source-byte hash round trip, three positive guest checks/JSON+SHA, actual exit23, one HTTPS403 with new exact-sandbox networkEgress.denied causal audit, exact cleanup/empty list/NotFound/watchdog stopped. Independent acceptance complete; card runtime-ready after acceptance, not stage GO |
| Learning history | Earlier CRLF shell failed positive work; downstream negatives were blocked and exact cleanup passed. Corrected LF/parser qualification resolved that local harness issue; do not keep it as the current failed runtime lane |
| Before reuse | Separately approved prepared sandbox or bounded preparation; explicit exact group/region/access; reviewed public LF fixture/source/hash; installed CLI help/output parser; permitted lifecycle and cost/cleanup owner. Reject CR bytes and parse-test locally before cloud work |
| Timing / fallback | Conditional C4 29:30-33:30; cut 32:30, one attempt, no on-stage create/upload/install/rule change. Until independent runtime acceptance and rehearsal are complete, use base C4 or the labeled failure/cleanup trace |
| Results | Actual host prompt, selected Squad/skill, inspected tool arguments, guest output and numeric exits, input/output hashes, validator/reviewer handoff; missing checks remain BLOCKED |

Before any separately approved preparation, the operator checks only the
reviewed public fixture, not credential/configuration files:

```powershell
$source = '<reviewed-public-shell-fixture>'
$bytes = [IO.File]::ReadAllBytes($source)
if ($bytes -contains 13) { throw 'Shell fixture must use LF, not CRLF.' }
$sourceHash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
aca --version
# Inspect installed exec/fs/apply help and parse its actual response shapes.
# Local fixture/parse checks do not authorize a cloud create or reuse.
```

Start the host CLI in the public session clone/disclosed checkpoint, select
`/agent squad`, confirm the ACA skill/tools are available in that session, then
submit this brief only after its private preparation gate:

```text
Squad: coordinate one approved public-only isolated-work check.
Copilot CLI/Squad and the worker stay on the host, not inside the MicroVM.
Invoke the aca-sandboxes skill; use the operator's approved prepared sandbox
and explicit subscription/resource-group/sandbox-group/region on every call.
Assign one native worker and an independent validator/reviewer.

Read the prevalidated UTF-8 LF public fixture and its source/hash manifest.
Confirm the prepared guest is 1 CPU/2 GiB, no ports, Deny/Full unchanged.
Execute the fixture once: transform only its public input, assert the expected
public output, and return its JSON check summary and SHA256. Capture immediate
numeric guest exits and the actual host process exit separately. Decode the
installed fs JSON content wrapper before comparing downloaded bytes.
If positive work fails, stop; do not count downstream checks as passed.
Run deliberate exit-23 and one HTTPS-denial check only if separately permitted
and the positive phase passed; attribute denial using configuration/diagnostics,
not just an HTTP status. Keep skipped/unattributed checks BLOCKED.

Do not create/upload/install/change egress or lifecycle during the timed demo.
Do not read/copy host auth, tokens, private state or context. Do not sign in or
run Copilot/Squad agents inside the guest. No anonymous ingress or snapshots.
Return actual prompt/skill/tool/output/exits/hash evidence, changed guest files,
failed or missing checks, and a validator/reviewer handoff. Stop at the cut;
no retry. The operator handles only separately approved exact-ID cleanup and
list/NotFound verification off-stage. Never delete the group or shared resources.
```

For a Terraform variant, first bind a separately qualified public archive commit,
hash, provider mirror, root/test files and numeric oracle. Do not assume the
historical ten root tests are the current upstream suite or the Corp copy's
52+2 cases. Neither a byte round trip nor an agent summary proves guest tests.
The earlier failed local harness is controlled preparation history, not a global
ACA SANDBOXES outage or the current runtime verdict. The corrected run proved the requested
public fixture work; it did not prove offline Terraform or inside-guest agents.
Another cloud attempt requires new approval, not an automatic retry.

<a id="original-hosted-squad-issue-to-pr-work"></a>

### Original hosted Squad issue-to-PR work: ACA APPS/JOBS

This **SQUAD ON ACA APPS/JOBS** path is hosted agent work, not a SandboxGroup/
MicroVM. Original Haflidi runtime remains working and unchanged; the owned MIT
fork/target handoff/publisher source is independently accepted/merged, not live
E2E. Fresh current end-to-end qualification remains pending; ACA SANDBOXES
success does not count as that proof.

| Field | Contract |
| --- | --- |
| Owner / roles | Haflidi explains his authored implementation; the approved target operator triggers; existing hosted Squad worker returns a bot PR; human reviewer owns acceptance |
| Repos / roots | Read [haflidif/squad-on-aca](https://github.com/haflidif/squad-on-aca) for completed original implementation; [martinopedal/squad-on-aca PR1](https://github.com/martinopedal/squad-on-aca/pull/1) is the owned MIT fork, @haflidif credit/license retained. Use a separately authorized `<approved-private-target>` clone, not the session clone/native group |
| Verified versus pending | Original implementation is completed/previously demonstrated and stays unchanged. Owned fork/target source accepted/merged, target runtimeProven false; credential-free manual status is source-prepared. Live E2E is BLOCKED on private publisher qualification/existing human gate, owner-native Terraform/full QA/real plan/image/auth and actual README bot PR, not new runner registration/AppAdmin |
| Before trigger | Existing human approvals/current target rights, accepted full owner-native Terraform source/exact plan, private publisher Docker/DNS/TLS qualification, immutable image and genuine worker authentication, then sanitized chain rehearsal. No token/cache copy, service rebuild or second standalone fork Bicep writer |
| Timing / fallback | Optional 53:00-54:30 only if ahead and freshly qualified; hard cut 54:30. Otherwise show dated original chain evidence or skip; no second issue or on-stage registration repair |
| Cleanup | Only the newly created owned test issue/PR/execution, after separate owner approval; verify queue drain. Never modify/delete the original hosted service or native group |

Use this bounded issue body after the target owner approves the exact README
change. It is a workload brief for the existing hosted flow, not a host terminal
instruction or a claim that work completed:

```text
Demo task: add one approved public-facing README paragraph explaining how this
repository hands a bounded issue to Squad and receives a reviewable bot PR.
Change only README.md; do not alter code, workflows, deployment or permissions.
Use no credentials, private environment values, personal context or copied logs.
Preserve existing instructions and attribution. Return one small PR with the
exact diff, checks actually run, missing checks and a human-review handoff.
Do not merge or deploy. Stop and report blocked access rather than rebuilding
the hosted service or changing the task to make it appear successful.
```

The operator resolves aliases privately and follows the accepted source-prepared
private scheduled poller mode: one approved issue -> existing queue -> genuine
Squad UID10001 worker -> trusted README App-bot PR. `gh auth status` and the
credential-free manual status check do not authorize a live trigger. Only after
all separate runtime/human gates pass, create the approved issue, add its routing
label, then read its matching queue workflow, actual ACA Job and bot PR/diff.
Correlate the same issue across all four; a queued workflow, pulled image or
successful Job alone is not a complete issue-to-PR result. Error-only/missing-
agent PR stubs are failure artifacts, not successful Squad work; never substitute
them for the original implementation's confirmed demonstration or fresh E2E proof.
No new runner registration or AppAdmin is required by the chosen poller mode.
Leave the old zero-step queued run untouched, not cancelled or consumed as proof.
Private publisher qualification is waiting at its existing human gate with zero
executed steps; no image/push/digest yet. Owner-native Terraform remains the sole
whole-body writer; full source acceptance/delivery integration, real plan/auth/
budget/owner/image/Job/actual PR gates remain. These holds do not establish an
original hosted-service failure or reopen accepted ACA SANDBOXES engineering.
Owner-native source preparation is under review; executable delivery remains
held. Plan/apply/destroy paths are currently unconditionally disabled, with
signer/current-head/private-plan transport/executable integration not yet
provisioned. These are remaining implementation gates, not deploy-on-merge or
just missing operator receipts.

## What makes results repeatable

| Lever | How these prompts use it |
| --- | --- |
| Pinned inputs | One contract file, one baseline commit, named files only. |
| Pinned model and tools | Same `/model` per lane; MCP Terraform server pinned by image digest. |
| Narrow lanes | Coder edits, validator runs approved commands, reviewer reads. One writer per file. |
| Plan before code | Native Plan mode, human approval before any edit. |
| Sourced facts | Microsoft Learn and Terraform Registry through MCP, with URL and version in the handoff. |
| Guardrails first | Read the target's effective policy and RBAC before design (prompt 1). |
| An oracle | Offline checks with fixed commands and exit codes decide green, not the model's summary. |
| Evidence ladder | Mock tests, plan, apply, and read-back are separate claims. |

## Before you start

```powershell
copilot --agent squad --plan
```

Run `/model` and note the model for each lane. In `/mcp`, confirm `microsoft-learn` and `terraform` are connected. Keep native permission prompts on; do not use `--allow-all` or autopilot for these prompts.

Headless MCP check fallback: `copilot mcp list --json` confirms configured server names without adding or removing servers.

## Hire the team (C0, first Squad demo, Squad coordinator, Plan mode)

```text
Cast the team from the Flaaklypa Grand Prix (Flåklypa Grand Prix) characters.
Use names only, no role-play: fun but professional.

Project: a reusable Terraform child module, terraform-azapi-aks-automatic,
that deploys an AKS Automatic cluster using the azapi provider. The module
has no provider blocks, backend or credentials; root consumers own those.
Needs: secure defaults, typed variables with validation, clear outputs, a
README with examples, offline tests (terraform validate and tftest, no
Azure), a security and policy review before shipping, and a consumer
example pinned to a released module version.

Roles needed: lead (architecture, task boundaries), Terraform module
author, tester, security reviewer, docs writer.
Rules: exactly one writer per file; the reviewer is never the author of
what they review.

Hint, not forced: Reodor Felgen as lead and architect (the inventor who
owns the design), Ludvig as the cautious security reviewer (the worrier),
Solan Gundersen as the upbeat docs writer. For the module author and
tester, pick further well-known Flaaklypa characters yourself.

Propose the team and wait for my confirmation before creating anything.
```

Note: Squad accepts custom universes and uses the names only. Use this on a clean VM or folder in C0, not in this repository's existing roster. The audience sees the proposal before anything is created.

## 0. Frame the contract (Squad lead, Plan mode)

```text
@docs/module-contract.md @QUALITY.md @AGENTS.md

Plan, do not implement. Restate the module contract in at most 10 bullets:
inputs, outputs, what the module owns, what the caller owns (providers,
backend, network, identity, namespaces), and the private-by-default posture.
List open questions that would change the design. Name one owner per file.
Wait for my approval.
```

Why: the contract is the stable input every later prompt reads. Changing it is a design decision, not a coding detail.

## 1. Discover the target's guardrails (Squad lead, read-only)

```text
Plan, do not implement. For the target subscription I name, list the
effective deny and modify policies inherited from every management group,
their effects and parameters, and the roles the deployment identity holds.
Use only read commands I approve (az policy assignment list, az role
assignment list). For each guardrail, state which Terraform resource or
Kubernetes object it constrains and what the compliant shape is. Do not
propose exemptions.
```

Why: in the Online deployment, three failures were guardrails, not code. A Modify policy forced storage to private, `Deny-Subnet-Without-Nsg` rejected the AKS-managed VNet, and an RBAC role could not create namespaces. Reading guardrails first turns surprises into design inputs.

## 2. Ground the API facts (coder, MCP lookups only)

```text
/agent terraform-coder

Do not edit yet. Using the microsoft-learn and terraform MCP servers only,
confirm for AKS Automatic: the managedClusters API version in use, supported
outboundType values with BYO subnets, API server VNet integration subnet
requirements, and managedNamespaces availability. Cite URL and version for
each fact. Mark anything you could not source as unverified.
```

## 3. Implement one bounded change (coder)

```text
/agent terraform-coder

Implement only the approved plan in these files: <list>. Keep providers and
backend in the root, the module provider-free, typed inputs with
validation, and lifecycle guards unchanged. Add or update the positive and
negative tests that verify the contract change. Hand off: changed files,
contract delta, the assertion that should fail without your change, and
sources. Do not run commands.
```

## 4. Run the oracle (validator, approved commands only)

```text
/agent terraform-validator

Run, stopping at the first failure, in the module root:
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
terraform test -no-color
Report each command, tool version, exit code, and relevant output as
pass, fail, blocked, or not applicable. Do not edit files.
```

## 5. Review independently (reviewer, new context)

```text
/new
/agent terraform-reviewer

Review baseline <sha> to <sha> for these files: <list>, with this
validator evidence: <paste>. Check caller/module ownership, unknown-at-plan
values in count or for_each, lifecycle guards, test intent, and the
guardrails from step 1. Return findings with severity, file and line,
consequence, and repair. Missing evidence is blocked, not passed.
```

## 6. Consume it like a customer (coder, then pipeline)

```text
/agent terraform-coder

Create a thin root in deployments/<env>/ that consumes the module with
source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0". The root owns providers, a partial backend, the network
(NSG on every subnet, explicit egress), and anything the guardrails from
step 1 require. Pass IDs the module uses in count as values known at plan
time. Do not put environment values in the module.
```

Then deploy through the pipeline, never from a laptop: plan, read the plan, approve the environment gate, apply, and capture runtime evidence (HTTPS 200 by hostname, HTTP to HTTPS redirect, and DNS matching the App Routing controller Service address for the demo app). The Online example is in the demo-env repository under `deployments/online/` and `.github/workflows/deploy-online.yml`.

## 7. Record the reason (Squad, Scribe)

```text
Record each accepted decision from this change in .squad/decisions/inbox/
with what, why, and the evidence (commit, run ID, check). Public facts only:
no subscription, tenant, or principal IDs.
```

## Measure repeatability

Use the October 8 repeatability eval as a template: three briefs, five fresh runs each, from the same pinned base, model, tools, and allowed files. The harness oracle, not the model summary, marks a run green. Results were mixed: B1 `alternate_network_payload` was 0/5 because it used two assert blocks against a pre-registered `>= 3` rule despite passing all Terraform tests; B2 `seeded-mutation-repair` was 5/5; B3 `forbidden-tag-characters` was 4/5 after a disclosed post-hoc rescore from 0/5 (saved diffs, no rerun) following a harness `-AllowedFiles` bug fix; run 2 stayed red for an out-of-scope README edit. B1v2 re-measured a clarified B1 brief that states the four-assert acceptance shape explicitly and was 5/5 green under the same pinned conditions. The lesson is to state the oracle's rules in the brief, including the expected test shape. For this eval only, a brief met the pre-registered repeatability bar when at least four of five runs were green. Report misses as-is and do not rerun just to fish for green. See [the repeatability eval](determinism-eval.md).

## Lessons from the Online deployment

These came from the real pipeline runs and are now part of the prompts above:

- Private-only storage, NSG-required subnets, and RBAC limits shaped the design more than any code choice. Read guardrails first.
- The root owns the environment. Adding providers to the module would have broken another consumer, so a thin root fixed it.
- Keep the relevant IDs known at plan time. A module that checks `var.subnet_id != null` in `count` fails when the caller creates the subnet in the same root. Pass plan-time-known IDs, or give the module a boolean input.
- Skip module-level `depends_on`. It defers the module's data sources whenever a dependency has a pending change, which can force a resource replacement. Order with resource references instead.
- Read back the real resource. The module promised AKS Automatic but sent the Standard SKU. Only an Azure read-back caught it.
- Keep the public repo free of plan artifacts. Plan and apply run in one gated job, so a plan file is never downloadable.
- Use runtime evidence from the pipeline. The run fails unless the app answers over HTTPS by hostname, redirects HTTP, and the hostname resolves to the App Routing controller Service address.
