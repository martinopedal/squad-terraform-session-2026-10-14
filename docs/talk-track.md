# Martin Opedal and Haflidi Fridthjofsson: complete delivery script

This script lets Martin Opedal, Enterprise Cloud Solution Architect, Microsoft and Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft deliver the 53-minute session and seven-minute Q&A using the same slide IDs and notes as the Reveal presentation.

## Delivery contract

The main script includes narration over 29 minutes of live demo operation. It does not add 29 minutes to the spoken running time. Spoken non-demo content totals 19 minutes, with 5 minutes held as slack inside the 53-minute main flow. Bracketed cues and blockquotes are operator instructions, not spoken words. Read speaker paragraphs at about 120 words per minute; use the remaining time for the explicit observation pauses, handoffs, and slide changes. Do not accelerate code reading to recover time.

Martin Opedal hosts the opening, owns the brief, and normally drives the presentation. Haflidi Fridthjofsson leads review, evidence interpretation, and the Q&A. The non-speaking presenter watches the clock and prepares the next cue. At C5, Haflidi takes control while Martin explains the implementation response. They hand control back explicitly after the chapter.

The demo chapters are live C0-C7 with the same timings: 29 minutes of demo, 19 minutes of spoken non-demo content, a protected 5:00 slack bank, and Q&A at 53:00. If a live path stalls, use the 75% cut line and an optional fallback: reviewed evidence screenshots, stored run results, or an approved recording of the same commands. Do not depend on a media manifest, a reserved video slot, or unattached video.

Delivery follows `qualify_then_run_clean_checkpoint` as a provenance rule: qualify the source first, then run the live chapter from a disclosed clean checkpoint. Keep the upstream pin, qualification revision, and live checkpoint distinct, including prepared code and starting Squad state. Identify the change executed in the live run. This is not first-ever implementation. Do not present earlier logs as fresh live output.

Every product chapter must show genuine Copilot CLI with Squad selected, either standalone or in a real integrated terminal. MCP means Model Context Protocol, a way to connect the CLI to external tools or sources. Capture or recording tools stay off-screen as optional fallback infrastructure, not Squad features. Do not substitute custom viewers, fabricated screenshots, or terminal output for the live product.

All environment references are generic. Public module code and examples are separate from private environment inputs, backend/state, identities, and secrets. No personal memory, private policy evidence, or unreviewed terminal history should appear on screen.

Preflight still matters: pin the actual CLI executable/package and show its version. The [verified feature guide](feature-guide.md) probed CLI 1.0.88 directly, while unqualified `copilot` resolved to 1.0.89. `--no-auto-update` doesn't select an older version. Rehearse the chosen build; help observations and current documentation are not live UI evidence.

## s01-outcome | 00:00-01:00 | A module worth reusing

> DRIVER Martin. Open on the title card. Both names are visible. No clip. Pause for five seconds after the first paragraph. Handoff to Haflidi for C1. Tip: define the useful artifact before choosing agents.

**Martin:** A useful agent session should leave something another engineer can consume. Today that something is a reusable Terraform module for private AKS in an existing Azure landing zone. I'm Martin, and this is Haflidi. We'll connect the Copilot CLI features you can use tomorrow with the team conventions that Squad adds.

**Haflidi:** We'll start with existing code and qualify it before the live run. Later chapters show genuine execution from a disclosed clean checkpoint, not the first-ever implementation. We'll explain the module boundary, checks, and decisions as we go. Evidence makes the sequence inspectable; it does not make future runs identical. First, compare two attempts without turning them into a competition.

## demo-c1 | 01:00-04:00 | C1: Same task, different agent choices

> DRIVER Haflidi. C1, 03:00 total. Martin operates the two shells. Handoff to Martin at 04:00. Tip: hold inputs fixed, including repository memory.

**Cut at 2:15:** If C1-B is still generating, stop comparison at one clear C1-A consequence and use the saved C1-B excerpt.

**Who drives:** Haflidi narrates the comparison. Martin types.

**Commands and prompt to type:**

```text
/new
/agent
# select Squad
/model
/plan
/rename C1-A
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

Repeat in the second clean worktree as `C1-B` with the same model, permissions, and starting team state.

**Point at the output:** Show `/model`, the selected Squad agent, the shared prompt, and one design consequence. A consequence means a choice that changes files, checks, or ownership. Do not compare verbosity.

**Handoff line:** "Martin, take the better-controlled brief into Plan mode; the comparison does not approve edits."

**Offline fallback:** Use saved `c1-a.txt` and `c1-b.txt` excerpts plus the October 8 eval summary. Keep B1 0/5, B2 5/5, B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun), and B1v2 5/5. Say this is a measured checkpoint, not a guarantee.

**Haflidi:** In these two attempts, the useful comparison is a choice that affects our module. Does the agent preserve a validation rule? Does it keep provider configuration in the consumer root? Does it propose a test for the actual resource body? Two runs do not establish an error rate. They show why controlled inputs, visible tools, and explicit checks matter.

## s03-baseline | 04:00-04:30 | Start with the code you have

> DRIVER Martin. No clip. Read the inherited source pin, not private paths. Bank 04:30-05:00 as slack. Handoff to Haflidi for the product map. Tip: disclose preparation and the actual live change.

**Martin:** Our starting point is the public AKS root module at the revision shown here. It had useful inputs, outputs, and tests, plus inherited issues: overlapping root declarations, an active provider outside mocks, and SKU documentation drift.

**Haflidi:** Those are inherited findings, not AI causation. Qualification happened before live delivery. Later chapters run from a disclosed clean checkpoint, so keep source, qualification, and the live change separate.

## s04-news | 05:00-05:30 | Big news this year

> DRIVER Martin. No clip. One headline plus Squad version. Bank 05:30-06:00 as slack. Tip: computer use is not part of this Terraform demo.

**Martin:** The headline is that Copilot CLI is GA, so Plan mode, agents, skills, MCP, review, diff, and undo controls are now a normal terminal surface for engineering work.

**Haflidi:** Around it, Agent HQ, AI Credits, and computer use have moved, but this demo stays in CLI, files, docs, and offline Terraform checks. Squad 1.0.1 is what we use today. Some pinned docs and npm still lag the release tags.

## s04-layers | 06:00-07:00 | One workflow, three distinct layers

> DRIVER Martin. Reveal the product-map connector, then the artifact boundary. Hold each for five seconds. Haflidi explains the CLI and tool layers; Martin explains Squad. Handoff to Martin at 07:00. Tip: name which product supplies each behavior.

**Haflidi:** Copilot CLI is the execution environment: Plan mode, file context, custom agents, tool access, permissions, subagents, review, and session controls. You can use all of that without Squad. The third layer is tools and evidence: Terraform, Git, Microsoft Learn, and MCP servers return artifacts, and none of them becomes correct just because an agent invoked it.

**Martin:** Squad adds a repository-backed team layer: a roster, meaning the team list; narrow charters, meaning role instructions; routing and handoffs; and decisions a later task can recover. It runs through the CLI; it doesn't replace it. The human sets a bounded objective, the CLI runs the work, Squad organizes the responsibilities, and the result comes back as files, decisions, and check output we can inspect.

## s07-agent-setup | 07:00-08:00 | Meet the agent setup

> DRIVER Martin. No clip. Trace the diagram from always-on instructions to Squad and then to the three native profiles. Tip: tool filters are availability limits, not a sandbox.

**Martin:** Before we use the team, show the audience the configuration shape. `AGENTS.md` and `.github\copilot-instructions.md` are always-on repository guidance. The Terraform instruction file applies to HCL, so Terraform edits carry stricter source and validation rules than a normal prose change.

**Haflidi:** Squad is the coordinator. `.github\agents\squad.agent.md` points the CLI to the coordinator, and `.squad\` contains the team roster, routing rules, role charters, and decisions. Squad owns the shared decisions and handoffs. It is not a Terraform sandbox.

**Martin:** The narrow native profiles are selected explicitly by the operator. I choose `/agent terraform-coder` for read, search, edit, and read-only documentation sources. I choose `/agent terraform-validator` for offline `fmt`, `init -backend=false`, `validate`, `tflint`, and `terraform test`. It never plans or applies. I choose `/agent terraform-reviewer` for a separate read-only review context.

**Haflidi:** MCP means Model Context Protocol. It is scoped to information sources here: Microsoft Learn, the HashiCorp Terraform registry docs, and `squad_state` for Squad memory. Tool filters reduce what is available to a profile. They do not create a security boundary, and generic Squad tasks do not inherit those profile filters automatically.

## demo-c0 | 08:00-11:00 | C0: From zero to a squad

> DRIVER Haflidi. C0, 03:00 total. Martin supports the VM connection. Handoff to Martin at 11:00. Tip: install, init, hire, verify.

**Cut at 2:15:** If installs or login are not complete, state the live stall, show fallback evidence, and move to `s05-parallel`. Do not spend Q&A time on installs.

**Who drives:** Haflidi drives the clean Windows 11 VM through Bastion. Martin watches time and credentials stay off-screen.

**Commands and prompt to type:**

```powershell
$PSVersionTable.PSVersion; Get-Command git, copilot, squad -ErrorAction SilentlyContinue
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
git --version; copilot --version; squad --version
copilot
```

Inside Copilot CLI:

```text
/login
/exit
```

Back in the repository terminal:

```powershell
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git $HOME\demo\aks-module
Set-Location $HOME\demo\aks-module
squad init
git status --short
copilot --agent squad
```

Then type:

```text
We maintain a reusable Terraform module for AKS Automatic on azapi that deploys into an
existing Azure landing zone. Work is Terraform module code, terraform test contract tests,
and consumer documentation. Propose a small team.
```

Confirm the proposed roster. Then exit the CLI and verify:

```powershell
squad doctor
```

**Point at the output:** Show the clean machine, installed versions, `squad init` output, the Git status, the proposed roster, the human confirmation, and `squad doctor` passing. Say AzAPI is the Terraform provider for Azure ARM and preview resources. Explain that `squad init` is a shell command, not an agent prompt.

**Handoff line:** "Martin, we have a reviewable team in Git; now show how the work stays bounded."

**Offline fallback:** Use the same VM through `scripts\Connect-DemoVm.ps1`. If the VM stalls, use the reviewed VM evidence: `Test-DemoVm.ps1` 14/14 and setup screenshots. Do not show private credentials.

**Haflidi:** The live point is simple. We can start from a clean VM, install the tools, initialize Squad, accept the team only after review, and verify the setup. That setup is useful, but it is not Terraform correctness.

## s05-parallel | 11:00-12:00 | Give parallel work separate owners

> DRIVER Martin. No clip. Trace the ownership lanes from brief to handoff. Allow ten seconds to read the file boundaries. Handoff to Haflidi for the module contract. Tip: one writer per shared Terraform surface.

**Martin:** Parallel work helps when the outputs are independent. The infrastructure writer owns the module, a test author owns the tests against the agreed interface, documentation follows once that interface is stable, and a reviewer reports findings with a file, a requirement, and a check. Copilot CLI already supports parallel subagents and fleet; Squad adds the roster and routing conventions for this repository.

**Haflidi:** The boundary is the file, not the job title. Give each task one artifact owner and a stopping point, and pause dependent work when the interface changes. Separate conversations aren't filesystem isolation, and worktrees don't isolate credentials. For this module, a small team with precise handoffs is enough.

## s06-contract | 12:00-14:00 | Fit the platform you already have

> DRIVER Martin. No clip. Point to the public module boundary, then the existing network. Pause ten seconds on ownership labels. Handoff to Martin for native Plan mode. Tip: pass approved resource IDs, not ownership of the landing zone.

**Haflidi:** The outcome has changed from a repository-specific root into a reusable module. That makes the boundary important. The module should describe the agreed AKS infrastructure contract through inputs, outputs, and provider requirements. The consumer root chooses provider configuration, backend, authentication, and environment values. Kubernetes application resources belong in a separate application root, not in the same automatically loaded configuration.

**Martin:** Our primary consumption path is private Corp networking that already exists. Corp here means the private workload side of an Azure landing zone. We're not creating a parallel landing zone, a public standalone cluster, or a new network just to make the demo easy. Platform-approved subnets, DNS, egress, and identity permissions are prerequisites supplied through reviewed inputs.

**Haflidi:** Automatic has its own current private and custom-network requirements. Those include the API-server, user-node, and managed-system-pool network contract. The implementation owner must verify supported properties, capacity, and outbound compatibility. A generic subnet ID does not establish that those requirements are met. Checked-in platform configuration also isn't a live policy snapshot.

**Martin:** The first useful planning question is therefore: what does this module own, and what does it consume? Keep private inputs and state out of the public module. Keep the private API requirement in the accepted brief. If the environment isn't ready, retain that gate rather than quietly changing the example to a public cluster.

## demo-c2 | 14:00-18:00 | C2: Pin the brief and approve a plan

> DRIVER Martin. C2, 04:00 total. Haflidi challenges scope. Handoff to Haflidi at 18:00. Tip: a planning prompt is not native Plan mode.

**Cut at 3:00:** If the plan is not ready, use the saved approved plan and state that approval covers only repository changes.

**Who drives:** Martin types. Haflidi checks whether the plan preserves the module boundary.

**Commands and prompt to type:**

```text
/new
/rename guided-clean-run
/agent
# select Squad
/instructions
/plan
```

Then paste:

```text
@terraform\modules\aks-automatic-corp\main.tf
@terraform\modules\aks-automatic-corp\variables.tf
@terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl
This is prepared, qualified code. Plan the C1 regression test and its README
explanation. Keep all eight inputs, six outputs, and the AzAPI resource intact.
Plan a separately labeled enablePrivateCluster mutation and repair.
No implementation, Azure lookup, apply, dependency upgrade, or state operation.
```

Revise the plan with:

```text
Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign.
```

Inspect:

```text
/session plan
```

**Point at the output:** Show the Plan indicator, effective instructions, referenced files, the revised criteria, and the visible exit from Plan mode. State that approval authorizes this code change only, not an Azure apply.

**Handoff line:** "Haflidi, the scope is approved; next we assign one writer and keep validation separate."

**Offline fallback:** Use `c2-approved-plan.md` and screenshots of the Plan indicator, `/instructions`, and `/session plan`. Label any fallback as evidence from rehearsal, not fresh live output.

**Martin:** Native Plan mode is the control. The plan must name files, checks, and exclusions. If it drifts into environment redesign or deployment, stop and revise before implementation.

## s08-plan-boundary | 18:00-20:00 | Extract a module, not an environment

> DRIVER Martin. Reveal the consumer boundary after the module boundary. Allow ten seconds to read. Haflidi leads, Martin closes. Handoff to Martin for C3. Tip: make ownership testable.

**Haflidi:** This is the shape the approved work should produce. A generic module contains the infrastructure resources, typed inputs, useful outputs, and provider requirements. A small consumer root configures providers and its own backend, passes approved existing-network inputs, and calls that module. The public example uses generic values and documents what an environment owner must supply.

**Martin:** That separation fixes more than folder aesthetics. Terraform loads all the root's configuration files. Mixing application and infrastructure roots can create duplicate declarations and bring in a live Kubernetes authentication path during tests. Moving files needs deliberate provider and state ownership; simply deleting the awkward file isn't a repair.

**Haflidi:** We also need to distinguish a fresh module consumer from an existing deployment. Extracting code can change resource addresses. This session isn't authorization to move or import estate state, convert a Base cluster in place, or remove destruction protection. Existing consumers would need a separately reviewed migration plan. Our example is for a fresh authorized workload.

**Martin:** The testable boundary is that no public module needs our private environment values to explain its interface. Another team should be able to read what it owns, supply compatible resource IDs, and see which prerequisites remain theirs. If that can't be explained in the example, the interface is not finished. Squad now has a concrete set of artifacts to route.

## demo-c3 | 20:00-24:00 | C3: Activate Squad and route independent work

> DRIVER Martin. C3, 04:00. Haflidi reads returned evidence. Handoff to Haflidi at 24:00. Tip: assignment is not completion.

**Cut at 3:00:** If the coder is still generating, stop the live turn, use the saved B1v2 excerpt, and move to C4 with the same boundary.

**Who drives:** Martin operates Squad and the native coder profile. Haflidi checks the handoff.

**Commands and prompt to type:**

```text
/agent
# select Squad
/tasks
/agent list
/mcp
/agent terraform-coder
```

Paste the clarified B1v2 brief:

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

Return to Squad:

```text
/agent squad
```

**Point at the output:** Show Squad selected, the relevant roster and routing, `terraform-coder` selected for the writing lane, the changed test file, and the handoff. The B1v2 eval was 5/5 against the `>= 4/5` bar after B1 was 0/5, but the live run still has to pass.

**Handoff line:** "Haflidi, the writer returned a file change; now we ground the requirement with guidance and source evidence."

**Offline fallback:** Use `c3-handoffs.md`, saved diffs, and the eval record: B1 0/5 to B1v2 5/5 after clarifying the four-assert oracle rule. Do not claim a causal conclusion beyond this measured checkpoint.

**Martin:** The point is ownership. The coder gets one writing lane and one exact brief. The handoff must name files, checks, and unresolved issues. A profile switch alone is not evidence of correctness.

## s10-tool-roles | 24:00-24:30 | Give context the right job

> DRIVER Martin. No clip. Keep only the instructions, skills, and MCP distinction. Bank 24:30-25:00 as slack. Handoff to Martin for C4. Tip: they are not interchangeable.

**Haflidi:** Instructions are persistent expectations. Skills are repeatable procedures. MCP connects the CLI to a source or tool.

**Martin:** Keep them separate. A recipe tells us how to work; a source tells us what a service currently supports. We still need the human decision that changes the code.

## demo-c4 | 25:00-29:00 | C4: Ground the work with tools

> DRIVER Martin. C4, 04:00. Haflidi explains the source claim. Handoff to Haflidi at 29:00. Tip: ask for the source property that changes the code.

**Cut at 3:00:** If MCP or Docker is not healthy, say the lookup is unavailable live, show the fallback excerpt, and do not pretend it succeeded.

**Who drives:** Martin types. Haflidi checks source fit and permission scope.

**Commands and prompt to type:**

```text
/skills info test-discipline
/mcp
```

Then paste:

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation. Through the configured Microsoft Learn
MCP, perform only a read-only search/fetch for AKS Automatic private/custom
network requirements. Cite the source/version relevant to private API access
and hosted-system subnets. Don't contact an Azure account or change providers.
```

Inspect:

```text
/permissions
```

**Point at the output:** Show the skill invocation, the Microsoft Learn MCP result, the source URL or version, and one narrow permission decision. MCP is a source connection here, not source verification by itself.

**Handoff line:** "Haflidi, we have the source and invariant; take the controls for the fail-repair loop."

**Offline fallback:** Use `c4-source.md` with retrieval time, tool, server/version, and limitation. If the live lookup fails, say it failed and use the reviewed source record.

**Martin:** The skill changes how we test. The MCP lookup supplies a source. The human still decides whether the source fits this module and what assertion or prerequisite follows from it.

## s12-source-check | 29:00-30:00 | Turn the source into an assertion

> DRIVER Martin. Reveal source, decision, then assertion. Code is an illustrative assertion, not terminal output. Pause five seconds on the final state. Handoff to Haflidi for test coverage. Tip: assert the resource, not a reassuring input.

**Haflidi:** The short version is to follow the claim all the way into the resource. The inherited code requested Base while the documentation described Automatic. A variable named automatic would not settle that mismatch. An assertion against the generated cluster contract is much closer to the requirement. It gives the reviewer a specific condition to inspect and a failure to investigate.

**Martin:** The assertion shown here illustrates that shape. It is not a passing test result. The actual test must match the reviewed module and provider behavior. Pair it with the private-network and managed-system-pool contract, and keep source versions in the decision record. A one-line SKU edit isn't the whole implementation.

## s13-test-gap | 30:00-31:00 | Test both sides of the boundary

> DRIVER Martin. No clip. Move B1/B2/B3 detail to appendix. Bank 31:00-32:00 as slack. Handoff of demo control to Haflidi for C5. Tip: enumerate active providers before running tests.

**Haflidi:** Keep the negative tests, but add positive assertions against the generated resource body and useful outputs. The consumer example also needs to exercise the supported interface.

**Martin:** First make the tests safe to run. A plan-mode test does not isolate every loaded provider. Review the configuration Terraform loads, separate application resources, and verify the mocks.

**Haflidi:** Then test the test with a deliberate mutation. Retain the failure, restore the implementation, and rerun the same check. That is evidence for the specific defect it detects, not every deployment problem. If the oracle has a rule, say it in the brief.

## demo-c5 | 32:00-37:00 | C5: Catch a mistake and repair it

> DRIVER Haflidi. C5, 05:00. Martin explains the repair. Hand control back to Martin at 37:00. Tip: preserve cause and effect.

**Cut at 3:45:** If the repair is not ready, stop live mutation work, show saved seeded-failure and repaired logs, then continue. Haflidi runs the validator.

**Who drives:** Haflidi selects `terraform-validator` and runs checks. Martin explains the code response.

**Commands and prompt to type:**

```text
/agent terraform-validator
```

Run the C5 PowerShell block from [demo-runbook.md](demo-runbook.md) exactly with `$phase = 'before'`. Then select the coder and seed the labeled mutation:

```text
/agent terraform-coder
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

Run the same C5 block with `$phase = 'seeded-failure'`. Then review and repair:

```text
/review
Read-only review of this labeled mutation; identify the violated assertion.
/agent terraform-coder
Restore only body.properties.apiServerAccessProfile.enablePrivateCluster to true.
Change nothing else.
/diff
/agent terraform-validator
```

Run the same C5 block with `$phase = 'repaired'`.

**Point at the output:** Show the command, exit status, failure assertion, `/review`, repair diff, and identical rerun. Say "deliberate lab mutation, not an AI-discovered defect." B1v2 met the `>= 4/5` eval bar, but this live runtime check must still pass and is not Azure acceptance evidence.

**Handoff line:** "Martin, the local check caught and repaired this mutation; separate that from Azure evidence."

**Offline fallback:** Use preserved C5 logs, file hashes, and the B2 5/5 seeded-repair eval result. Keep B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun) visible if discussing prompt evaluation.

**Haflidi:** Start with the real exit code. A syntax error, assertion failure, and cloud permission problem are different. The repair must match the failure and the same check must run again.

## s15-proof | 37:00-39:00 | Evidence has levels

> DRIVER Martin. No clip. Use "runtime check" and "runtime evidence" language. Bank 39:00-40:00 as slack. Never announce a pending gate as passed. Tip: a check is evidence only for what it checks.

**Haflidi:** This slide separates source inspection, local contract tests, consumer checks, plan/apply evidence, and Azure read-back. The public module had local mocked coverage and mutation checks. The private IaC consumer supplied separate sanitized runtime evidence for the pinned module revision.

**Martin:** Each check is evidence only for its own claim. Formatting checks presentation. Validation checks Terraform structure and provider-facing consistency. Tests assert what their authors wrote. A clean mock can still miss live service behavior, subnet capacity, effective policy, or identity permissions.

**Haflidi:** Azure read-back is a separate gate. We can say the sanitized facts: Automatic SKU, private API with VNet integration, UDR, OIDC and workload identity, custom private DNS, and Succeeded provisioning. We still do not show private IDs, state, run URLs, or FQDNs.

## s16-continuity | 40:00-41:00 | Save the reason, not just the chat

> DRIVER Martin. No clip. Trace the decision into the next task. Pause five seconds. Handoff to Haflidi for C6. Tip: record why the boundary exists.

**Martin:** A later task needs to know why we chose this boundary. Private Corp consumption, existing network ownership, and separate application resources should survive beyond the conversation that introduced them. A short decision with its reason and source is more useful than a pasted transcript. Keep the decision close to the files whose behavior it constrains.

**Haflidi:** Scribe helps the Squad record that repository knowledge. The record still needs review, and the next task must actually read it. Native session resume brings back a conversation. It does not automatically show that an agent recovered the repository's current decisions. We'll show both sides of that continuity, then inspect context and usage before starting more work.

## demo-c6 | 41:00-44:00 | C6: Resume with decisions intact

> DRIVER Haflidi. C6, 03:00. Martin operates the session. Handoff to Martin at 44:00. Tip: confirm that the reason reached the resumed task.

**Cut at 2:15:** If resume or search is slow, show the decision file and state the constraints directly.

**Who drives:** Haflidi leads the continuity check. Martin types.

**Commands and prompt to type:**

```text
Scribe records decisions in `.squad\decisions\inbox\`; use `/new`, `/rename`, and `/tasks` to keep sessions organized.
Record the public-only decision: private API invariant, caller-owned provider/backend, added network-payload regression,
labeled mutation/restoration, exact checks, and the sanitized Azure-validation boundary without exposing private target details.
Do not copy histories, credentials, or full conversations.
```

Then:

```text
/new
/resume guided-clean-run
/cwd
/context
/usage
Read the saved decision; cite its file and the constraints for the next change.
```

**Point at the output:** Show the decision record, the resumed session identity, the cited file, `/context`, and `/usage`. Do not show personal memory or unrelated sessions.

**Handoff line:** "Martin, the reason is recoverable; now review the consumer-facing artifact."

**Offline fallback:** Use `c6-decision.md` and screenshots of the decision citation, `/context`, and `/usage`. Keep private histories out of the fallback.

**Haflidi:** Resume brings back a session. It does not show that the repository decision was read. The live check is the citation: file, constraint, and next action.

## s18-memory | 44:00-45:00 | Three places to keep context

> DRIVER Martin. No clip. Keep personal memory closed. Bank 45:00-46:00 as slack. Handoff to Haflidi for C7. Tip: separate CLI compaction from team-state hygiene.

**Martin:** Conversation context, native memory, and Squad's repository-backed decisions have different owners and review needs. We won't display personal memory contents.

**Haflidi:** Before reducing context, save the accepted module boundary, source, and unresolved prerequisite where the next owner can review them. Private environment mapping stays in the environment's controlled location.

**Martin:** Retain the defect a recipe detects, the evidence for it, and its limits. That is useful team knowledge, not permission to publish private inputs or unrelated conversations.

## demo-c7 | 46:00-49:00 | C7: Reviewed diff to approved Terraform change

> DRIVER Haflidi. C7, 03:00. Martin supports the final handoff. Handoff to Martin at 49:00. Tip: approve a specific artifact and scope.

**Cut at 2:15:** If the full suite is not done, show the saved green exits and diff; do not run a second suite live.

**Who drives:** Haflidi leads validation and review. Martin names the human acceptance boundary.

**Commands and prompt to type:**

```text
/agent terraform-validator
```

Run the C7 PowerShell block from [demo-runbook.md](demo-runbook.md) exactly. Then inspect and review:

```text
/diff
/new
/agent terraform-reviewer
```

Supply the exact diff, files, revision, MCP citations, and sanitized validator results.

**Point at the output:** Show offline checks, `/diff`, reviewer findings, and the human code-only acceptance. The online runtime check is separate: apply runs 37771532872 and 37772290635 ended with no changes, DNS matched the ingress IP, HTTPS returned 200 by hostname, and the title was "AKS Automatic | NIC 2026 demo". `Test-OnlineSecurity.ps1` was 29/29. `Test-DemoVm.ps1` was 14/14.

**Handoff line:** "Martin, we can approve this artifact and name the remaining gates; we are not claiming a stage apply."

**Offline fallback:** Use `c7-final.diff`, validator logs, reviewer notes, Online apply runs 37771532872/37772290635, `Test-OnlineSecurity.ps1` 29/29, `Test-DemoVm.ps1` 14/14, and the eval results. Treat them as evidence for their own gates, not evidence for every environment.

**Haflidi:** Review as a consumer would. A code review can accept the module while deployment remains controlled by the environment owner. Runtime evidence checks the running Online path; it does not replace private Corp validation.

## s20-consumer | 49:00-51:00 | Reuse the code, not the environment

> DRIVER Martin. No clip. 0:00-0:30 diagram; 0:30-1:00 live reveal; 1:00-1:35 gate; 1:35-2:00 runtime checks and boundary. Certificate warning is expected. Handoff to Haflidi for operating rules. Tip: version the module separately from environment inputs.

**Martin:** First, the boundary. The public material includes the reusable module and a sanitized consumer example. Consumers pin reviewed module code; they do not copy our private environment inputs, backend, state, identities, or secrets.

**Martin:** Now open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`. If the browser shows the expected certificate warning, name it and continue. Point at the pipeline flow, the serving pod name, and the speakers section.

**Haflidi:** The delivery line is: gated pipeline PR → plan → human approval → apply. The outside-in runtime checks are 29/29: hostname HTTPS response, expected title, redirects, and security posture checks.

**Martin:** If the app is unreachable, use the offline screenshot plus apply runs 37771532872 and 37772290635 as fallback evidence. Then return to the same boundary: reuse the module code, not the private environment.

## s21-limits | 51:00-52:30 | Make the next change easier to review

> DRIVER Martin. No clip. Three rules only. Bank 52:30-53:00 as slack. Haflidi closes the content; Martin opens the floor at 53:00. Tip: keep the artifact, the reason, and the check together.

**Haflidi:** Rule one: use Plan mode when the change has decisions worth resolving before edits. Attach the files and instructions that matter, then approve only the narrow code change.

**Martin:** Rule two: use Squad when named ownership and handoffs help. Keep independent tasks independent, one writer on a shared Terraform surface, and a reviewer who returns exact findings.

**Haflidi:** Rule three: use skills for repeatable procedures and MCP for a specific source or tool. Check the diff and the tests, then say what they establish. Martin, open Q&A.

## s22-questions | 53:00-60:00 | Questions and prepared fallback

> DRIVER Martin. HOST Haflidi. Prioritize actual audience questions. The dialogue below is a prepared fallback, not audience quotations. If the room is quiet, identify it as prepared. Allow 15 seconds for the first question, about ten seconds between topics, and a final 15-second close. Target roughly 120 spoken words per minute. Open only the relevant appendix and return here. Finish at 11:00.

**Martin:** We have seven minutes for questions. Which part would you like to inspect: planning, team ownership, the module boundary, or the checks? If the room is still thinking, Haflidi and I have a few prepared questions about the choices in this workflow. They aren't questions from an audience we haven't heard from.

**Haflidi:** I'll start with one of ours. When would you skip Squad and just use Copilot CLI for the change? We have spent time explaining roles, but nobody should leave thinking a team is mandatory for every Terraform edit.

**Martin:** I'd keep a small, well-understood edit in one session when the context and review fit there. Native file context, Plan mode, tools, and diff inspection already do useful work. Squad becomes helpful when independent artifacts need owners or when decisions must survive several handoffs. The boundary should earn its coordination cost. A bigger roster isn't an objective.

**Martin:** My prepared question for you is about recovery. Someone sees a bad edit and reaches for rewind. What would you want them to understand before they treat that as their recovery strategy?

**Haflidi:** Rewind concerns supported CLI session or edit recovery. It isn't Azure rollback. Inspect the diff afterward and understand which files and state were affected. A worktree separates a working directory; it doesn't isolate credentials or reverse external operations. A fork carries conversation context, so it also isn't an independent comparison run. Cloud recovery requires an environment-specific plan.

**Haflidi:** Another prepared question: why not use autopilot for the entire task, including the deployment, if the accepted brief is precise?

**Martin:** Autopilot is useful for a bounded objective with a stop condition and appropriate tool permissions. The optional AI-credit limit is another control to understand, not a hard financial or safety guarantee. It doesn't settle unresolved environment authority. In this workflow, we keep human plan revision and deployment approval explicit. Automating the routine work doesn't mean automating consent.

**Martin:** Let's separate two other commands that sound similar in a quick demo. What is the practical difference between cloud delegation and remote control?

**Haflidi:** Delegate hands work to a cloud-agent draft-PR workflow. The resulting change still needs review. Remote control steers a still-running local CLI session, so that host must stay online. Neither is necessary for our local live module work. Both can be useful later, but we don't open a public sharing session on stage or imply a PR exists when it doesn't.

**Haflidi:** Here is a question about the artifact rather than the agent. Why isn't a passing mocked test enough to call the module ready for an existing landing zone?

**Martin:** The mock checks the contract we wrote, under the assumptions we supplied. It doesn't establish subnet capacity, private DNS resolution, deployment permissions, effective policy, service-managed behavior, or the compatibility of the actual outbound design. A clean consumer example adds evidence about the interface. A real plan and authorized read-back add environment evidence. Keep those claims separate instead of treating one green result as a universal certificate.

**Martin:** Last prepared topic, unless an audience question comes in: how do you share the useful team knowledge without sharing the environment?

**Haflidi:** Put the public contract and public source decisions with the module. Keep private scope mapping and state in the environment's controlled location. Review team exports before sharing, and use maintenance previews rather than blindly rewriting histories. CLI compaction and Squad team-state hygiene solve different problems. Neither grants permission to publish personal memory or confidential context.

**Martin:** The same applies to any optional recording fallback. A private repository doesn't keep code private once it is visible in a public video. Review the actual frames, not just the filenames. Keep the source revision and meaningful check output, but remove private identifiers and credentials without changing the conclusion.

**Haflidi:** Thank you. The presentation, feature references, and reusable module material are the intended public handoff. Their current evidence status stays explicit, so the next person can tell what they can use and what still requires verification in their own environment.

## a-cli-controls | Appendix | Branch and recover deliberately

> Reference only. No extra scheduled time. Return to `s22-questions`. CLI `/fork` carries context; `/worktree` separates working files, not credentials. Protect useful work with a checkpoint. Installed `/rewind` help describes last-turn recovery; moving docs describe a picker. Verify the selected build's UI and resulting files. It isn't Azure rollback. `/resume` returns to a selected saved session. Never expose unrelated sessions.

## a-automation | Appendix | Automate bounded work

> Reference only. `/autopilot` needs a finite objective, permissions, and a stop condition. The reviewed help/docs agree on five default continuations; use explicit limits rather than relying on a default. `/limits` and `--max-ai-credits` are soft; parent/subagents share accounting and compaction can consume credits. They are not hard financial or safety guarantees. `-p`/`--prompt` is noninteractive; `-i` retains interaction. Use selective approvals and never combine `--plan --mode autopilot` for C2. `/fleet` and `/subagents` belong to native CLI parallel work.

## a-handoffs | Appendix | Choose where the work happens

> Reference only. `/delegate` hands a bounded task to GitHub's cloud agent with draft-PR consequences. `/remote` steers the existing still-running local session; its host must remain online. No public sharing demonstration or cloud PR is claimed. Confirm current availability and permissions before later use.

## a-integrations | Appendix | Add the context you need

> Reference only. `/ide` and `/lsp` support editor/language-service integration where configured. Inspect-only `lsp list` doesn't start a server. `/plugin` packages reviewed capabilities but doesn't make contributed tools built-in. `/research` supports a sourced investigation; `/rubber-duck` targets one design or coverage question with documented different-model critique, subject to model availability and added usage. Verify citations and actual behavior. See the public feature guide for detail.

## a-squad-ops | Appendix | Keep the team state useful

> Reference only. Squad `status` and `doctor` concern setup, not Terraform correctness. Installed doctor help and reference exit-code claims differ; read actual diagnostics and exit status. Back up before `import`; `export`/`import` help doesn't verify round-trip fidelity or safe overwrites. `nap --dry-run` previews team-state hygiene, unlike CLI `/compact`. `squad loop --init` can create a starter loop file; `squad triage` is the reference-backed issue-routing command. Ralph triage can mutate labels without `--execute`; documented runners may inject broad permission flags. No watcher runs here.

> Reviewed current and stable Squad templates use `.github\skills` for bundled playbooks and `.squad\skills` for earned knowledge. Project `.copilot\skills` is legacy despite stale feature-page prose. Review the evidence and limits of learned recipes; expose native CLI skills through supported discovery locations. Current coordinator routing favors one accountable owner with bounded contributors, not guaranteed eager fan-out.

## a-evidence | Appendix | Know which gate you are reading

> Reference only. Keep the full upstream source pin, reviewed module revision, and exact check evidence with the release. For a detailed Terraform plan, exit codes are 0 for unchanged, 2 for proposed changes, and 1 for error. Private scope, state, network compatibility, policy evaluation, and authorized read-back remain separate gates; the October 5 validation closes them only for the cited private consumer run.

## a-online | Appendix | Same module, Online landing zone

> Reference only. Answer "can this run somewhere simpler?" Keywords: same module, thin root, guardrails constrain, runtime evidence not hope. The demo-env repo root `deployments/online` consumes the module by tag `v0.6.0` and owns providers, backend, network, and the namespace. Three landing-zone controls shaped it: storage forced private (state through a private endpoint, so an ephemeral VNet-integrated runner), `Deny-Subnet-Without-Nsg` (the AKS-managed VNet was rejected, so BYO subnets with NSGs and an explicit NAT Gateway), and AKS RBAC Writer cannot create namespaces (managed namespace through ARM). Nothing was exempted. The chain: PR, protected branch, human environment gate, OIDC, plan and apply in one job with no plan artifact, a public API server that accepts only the runner's static egress IP, Entra-only kubeconfig, and a runtime check step that fails unless the hostname returns HTTPS 200, HTTP redirects, and DNS resolves to the App Routing controller Service address. App Routing is Azure's managed NGINX ingress add-on for AKS. The current page at `https://aks-online-demo.swedencentral.cloudapp.azure.com/` is the branded NIC 2026 demo, served by pinned `nginx-unprivileged`, showing the serving pod, render time, flow, and speakers; apply runs 37771532872 and 37772290635 both ended with plan "No changes", DNS matching the ingress IP, HTTPS 200 by hostname, and title "AKS Automatic | NIC 2026 demo". `Test-OnlineSecurity.ps1` is 29/29 PASS. The real runs found seven issues: five module fixes written test-first (user-assigned identity for BYO subnets, `userAssignedNATGateway` egress, two perpetual drifts, and the SKU: the module sent `Base`, now `cluster_sku = "Automatic"` with managed system node pools), one root fix (no module-level `depends_on`), and one fixed later in the module (`count` on a plan-time-unknown subnet ID, now the explicit `use_external_subnets` flag with a regression test). The cluster was rebuilt as the Automatic SKU because Base to Automatic migration is not supported. Detail and evidence: `docs/online-demo.md`. Do not show subscription, tenant, or principal IDs.

## a-security | Appendix | What AI found that the scanners did not

> Reference only. Answer "how did AI help security, and what does GHAS already do?" Keywords: GHAS baseline, silent gaps, oracle, human approval. The module and demo-env repositories run CodeQL default setup, secret scanning with push protection, and Dependabot security updates, with zero open alerts on October 7. Module `main` requires Terraform Validate, Style Check, CodeQL, Checkov, TFLint, and Trivy; demo-env `main` requires Terraform Validate, Checkov, TFLint, and Trivy. The agent found what produces no alert: Checkov's parser had rejected the module's `main.tf` since August, so the cluster definition was never scanned; the Security Scan workflow had been disabled for inactivity; a feature monitor reported green while crashing; approving a gate right after dispatch silently failed; and a VM cleanliness check could not see per-user installs. Microsoft Learn through MCP supplied product rules such as Base to Automatic migration not being supported. Each claim was then re-checked by a test or read-back: 52 module contract cases plus 2 caller/example Terraform test cases; 29/29 Online read-back checks including negative tests from the internet; and 14 VM checks. Every merge and every Azure write had a human decision. Gaps stay visible: single-maintainer admin merges, identifiers in history, and Checkov not reading azapi bodies. Detail: `docs/security-case.md`.

## a-prompts | Appendix | Prompts you can rerun

> Reference only. Answer "how do I get similar results with my agents?" Keywords: guardrails first, one lane per step, the oracle marks outcomes, measure repeatability. Step 1 reads effective policy and RBAC at the target before design; step 2 grounds API facts through Microsoft Learn and Terraform Registry MCP with citations. Then `terraform-coder` edits, `terraform-validator` runs fixed offline commands, and `terraform-reviewer` reviews in a fresh `/new` context. Consume through a thin root and deploy through the pipeline. In the October 8 eval, repeatability was measured as five fresh runs from one checkpoint against a pre-registered `>= 4/5` green bar; this is a checkpoint, not a guarantee. Results were B1 0/5, B2 5/5, and B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun), with the out-of-scope README edit still red; two of three original briefs met the threshold, and the misses stayed visible. B1v2 was a separate clarified follow-up after seeing B1: the ambiguous brief failed 5/5 the same way with two assert blocks, while the B1v2 brief stated the four-assert shape and was 5/5 green under the same pinned conditions, with 61-114 s runs and no failure modes observed in those five runs. C3-C5 uses the B1v2 loop because it met the Oct 5 `>= 4/5` bar; the live run still has to pass. Lesson: if the oracle has a rule, say it in the brief. Prompts: `docs/prompt-pack.md`. Do not generalize beyond this eval.

## a-bootstrap | Appendix | Start a squad in five steps

> Reference only. Answer "how do I start?" Keywords: install, init, hire, verify, upgrade safely. (1) Prerequisites: Copilot CLI and a Git repository; GitHub CLI only if you want issue routing. (2) Install Squad 1.0.x with `winget install --id bradygaster.Squad --exact`, Homebrew, or GitHub Releases; npm `latest` still pointed at 0.13.1 on October 5. (3) In the repository terminal run `squad init`; it is a shell command, not something you ask the agent. (4) Start `copilot --agent squad` and describe what you are building. Init Mode proposes a cast roster (a few specialists plus Scribe, Ralph, Rai, and Fact Checker) and writes nothing until you confirm; then it creates `.squad\` with team, routing, decisions, and member histories. Commit it. (5) Check with `squad doctor`. Before `squad upgrade`, back up: it preserves team, routing, decisions, histories, and config, but replaces the coordinator file and templates. Simplest good start: one repository, three to five specialists, add narrow native profiles only where a lane needs limits.

## a-use-cases | Appendix | When Squad earns its place

> Reference only. Answer "when is it worth it, and how does it fit with Copilot CLI?" One line: Copilot CLI runs the work; Squad routing assigns an accountable owner and records why. The CLI is the execution surface: model, tools, permissions, Plan mode, MCP, diff, review, and resume. Squad is a custom agent inside it plus repository state: roles, routing, handoffs, decisions, and ceremonies. Use Squad when work crosses owners (module, tests, and docs in parallel with one writer per file), when work outlives a session (decisions and histories let you resume or hand over), and for backlog and review flow (issues routed by `squad:{member}` labels, Ralph keeping the queue moving, and a rejected change revised by a different author). Skip it for a small, well-understood edit that fits one CLI lane. Squad does not replace Terraform checks, human approval, or the CLI's own permissions.
