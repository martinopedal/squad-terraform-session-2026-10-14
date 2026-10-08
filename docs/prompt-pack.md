# Prompt pack: build a module like this, repeatably

Run these prompts in order to build or extend an AKS Automatic Terraform module with GitHub Copilot CLI, Squad, the three native agent profiles, and read-only MCP documentation lookups. They match the lanes in [AGENTS.md](../AGENTS.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) and the evidence rules in [QUALITY.md](../QUALITY.md).

Repeatable does not mean deterministic. A model can choose differently on two runs. These prompts narrow the choices, make every claim checkable, and make a wrong turn visible early. Measure it: run a brief five times from the same checkpoint and count green runs (see [Measure repeatability](#measure-repeatability)).

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

Use the October 8 repeatability eval as a template: three briefs, five fresh runs each, from the same pinned base, model, tools, and allowed files. The harness oracle, not the model summary, marks a run green. Results were mixed: B1 `alternate_network_payload` was 0/5 because it used two assert blocks against a pre-registered `>= 3` rule despite passing all Terraform tests; B2 `seeded-mutation-repair` was 5/5; B3 `forbidden-tag-characters` was 4/5 after a disclosed post-hoc rescore from saved diffs following a harness `-AllowedFiles` bug fix, with no Copilot rerun; run 2 stayed red for an out-of-scope README edit. B1v2 re-measures a clarified B1 brief that states the four-assert acceptance shape explicitly; result: **B1v2 score: PENDING (TBD-B1V2)**. The lesson is to state the acceptance rule in the brief. For this eval only, a brief met the pre-registered repeatability bar when at least four of five runs were green. Report misses as-is and do not rerun just to fish for green. See [the repeatability eval](determinism-eval.md).

## Lessons from the Online deployment

These came from the real pipeline runs and are now part of the prompts above:

- **Read guardrails first.** Private-only storage, NSG-required subnets, and RBAC limits shaped the design more than any code choice.
- **Root, not module, owns the environment.** Adding providers to the module would have broken another consumer; a thin root fixed it.
- **Known at plan time.** A module that checks `var.subnet_id != null` in `count` fails when the caller creates the subnet in the same root. Pass plan-time-known IDs, or give the module a boolean input.
- **No module-level `depends_on`.** It defers the module's data sources whenever a dependency has a pending change, which can force a resource replacement. Order with resource references instead.
- **Read back the real resource.** The module promised AKS Automatic but sent the Standard SKU; only an Azure read-back caught it.
- **Public repo, no plan artifact.** Plan and apply in one gated job, so a plan file is never downloadable.
- **Runtime evidence.** The pipeline fails unless the app answers over HTTPS by hostname, redirects HTTP, and the hostname resolves to the App Routing controller Service address.
