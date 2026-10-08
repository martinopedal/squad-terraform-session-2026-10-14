# Martin Opedal and Haflidi Fridthjofsson: complete delivery script

This script lets Martin Opedal, Enterprise Cloud Solution Architect, Microsoft and Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft deliver the 53-minute session and seven-minute Q&A using the same slide IDs and notes as the Reveal presentation.

## Delivery contract

The main script includes narration over 29 minutes of silent video. It does not add 29 minutes to the spoken running time. The other live segments total 24 minutes. Bracketed cues and blockquotes are operator instructions, not spoken words. Read speaker paragraphs at about 120 words per minute; use the remaining time for the explicit observation pauses, handoffs, and slide changes. Do not accelerate code reading to recover time.

Martin Opedal hosts the opening, owns the brief, and normally drives the presentation. Haflidi Fridthjofsson leads review, evidence interpretation, and the Q&A. The non-speaking presenter watches the clock and prepares the next cue. At C5, Haflidi takes playback control while Martin explains the implementation response. They hand control back explicitly after the chapter.

The current package has honest recording slots, not completed footage. Play a chapter only when approved footage is attached. Otherwise leave its viewing guide visible and deliver the same explanation without pretending that a command ran. The main narration describes what to inspect rather than inventing a particular result. The evidence slide is the authority for current completion status. Local test success, a real Azure plan, deployment, and policy read-back are separate claims.

Delivery follows `build_then_record_clean_run`: qualify the source before filming, then capture genuine new execution from a disclosed clean checkpoint. Keep the upstream pin, qualification revision, and recording checkpoint distinct, including prepared code and starting Squad state. Identify the change actually executed in each take. This is not first-ever implementation footage, and current code qualification has not been filmed. Do not present earlier logs as output from the later recorded run.

Every product chapter must show genuine Copilot CLI with Squad selected, either standalone or in a real integrated terminal. Capture automation stays off-screen as external tooling, not a Squad feature. Do not substitute custom viewers, artifact-pilot frames, fabricated screenshots, or terminal output for native recordings.

All environment references are generic. Public module code and examples are separate from private environment inputs, backend/state, identities, and secrets. No personal memory, private policy evidence, or unreviewed terminal history should appear on screen.

Recording preflight: pin the actual CLI executable/package and show its version. The [verified feature guide](feature-guide.md) probed CLI 1.0.88 directly, while unqualified `copilot` resolved to 1.0.89. `--no-auto-update` doesn't select an older version. Rehearse the chosen build; help observations and current documentation are not completed UI demonstrations.

## s01-outcome | 00:00-01:00 | A module worth reusing

> DRIVER Martin. Open on the title card. Both names are visible. No clip. Pause for five seconds after the first paragraph. Handoff to Haflidi for C1. Tip: define the useful artifact before choosing agents.

**Martin:** A useful agent session should leave something another engineer can consume. Today that something is a reusable Terraform module for private AKS in an existing Azure landing zone. I'm Martin, and this is Haflidi. We'll connect the Copilot CLI features you can use tomorrow with the team conventions that Squad adds.

**Haflidi:** We'll start with existing code and qualify it before filming. Later clips will show genuine new execution from a disclosed clean checkpoint, not its first-ever implementation. We'll explain the module boundary, checks, and decisions as we go. Recording makes the sequence inspectable; it doesn't make the model deterministic. First, compare two attempts without turning them into a competition.

## demo-c1 | 01:00-04:00 | C1: Same task, different agent choices

> DRIVER Martin. C1, 03:00 total. Play only approved footage; otherwise keep the clearly pending viewing guide. Capture `/model` and the selected model. At clip 00:00 inspect run identity, 00:40 inspect inputs, 01:30 compare one decision, 02:20 inspect its consequence. Allow about 45 seconds of observation across the chapter. Handoff to Martin at 04:00. Tip: hold inputs fixed, including repository memory.

**Haflidi:** In these two attempts, the useful comparison is a choice that affects our module. Does the agent preserve a validation rule? Does it notice that provider configuration belongs in the consumer root? Does it propose a test for the actual resource body? We aren't counting words or judging which response sounds more confident. If both attempts make the same sound choice, that's a valid result.

**Martin:** Start with the inputs. We need the same disclosed clean checkpoint, the same prepared code and task, and an explicitly selected model. The model selector is a native CLI control. It helps us record what we asked to do the work. It doesn't freeze a hosted service forever; a model name is not a reproducible build identifier.

**Haflidi:** A fresh conversation alone isn't enough. Instructions, skills, tool access, and repository-backed decisions can change the task. If the first run writes a decision and the second reads it, we've changed the experiment. Keep separate working copies and equivalent starting team state. Don't delete personal or global memory to manufacture a clean story. Record the permission boundary as well; an unavailable source can change the answer without telling us anything about model quality.

**Martin:** Watch the effect of one choice on the acceptance criteria. A different order of work may be harmless. A different network ownership assumption may be expensive. Two runs don't establish an error rate, and we won't repeat them until something dramatic happens. Our practical response is to make intent, context, and checks visible. The next chapters use a separately identified guided pass, so no result from this comparison becomes a hidden head start.

## s03-baseline | 04:00-05:00 | Start with the code you have

> DRIVER Martin. No clip. Read the inherited source pin, not private paths. Distinguish it from the qualification revision and future recording checkpoint. Hold the source strip for five seconds. Handoff to Haflidi for the product map. Tip: disclose preparation and the actual recorded change.

**Martin:** Our starting point is the public AKS root module at the revision shown here. It already has typed inputs, outputs, and ten negative test cases. It also has real quality issues: overlapping root declarations, an active provider outside the test mocks, and documentation that doesn't match the requested SKU.

**Haflidi:** Those are inherited findings, not evidence of AI causation. The reusable module now exists and passed local qualification before filming. Later clips will show new execution from a disclosed clean checkpoint. Keep upstream source, qualification, and the recorded change separate. Prepared code is disclosed context, not a claim that this was its first implementation.

## s04-news | 05:00-06:00 | Big news this year

> DRIVER Martin. No clip. Keep this to the dated source table. Haflidi calls out the preview boundaries. Tip: computer use is not part of this Terraform demo.

**Martin:** A lot changed between last October and this October. The anchor for this talk is February 25, 2026: Copilot CLI reached GA with Plan mode, custom agents, skills, plugins, MCP, review, diff, and undo controls in the terminal. That is why we can treat the CLI as a normal engineering surface, not just a preview experiment.

**Haflidi:** The control plane also widened. Agent HQ launched at Universe on October 28, 2025, and Claude plus Codex entered public preview there on February 4, 2026. Custom-agent status is per surface and worth rechecking before stage: CLI is included in CLI GA, GitHub sources conflict for JetBrains, and VS Code ignores `mcp-servers` frontmatter according to the custom-agents reference. Do not say GA everywhere.

**Martin:** Billing changed too. AI Credits became effective June 1, and the CLI added `/limits` and `--max-ai-credits` on July 1. Those controls matter when a Terraform task fans out into agents or long checks.

**Haflidi:** Two more notes are fresh. Agent Skills launched in December, and skills plus MCP are GA in Copilot code review. Computer use entered public preview on October 1 with `/computer on`, `show`, and `off`, per-app approval, and admin disable. We do not use computer use in this Terraform demo.

**Martin:** Finally, Squad v1.0.0 and v1.0.1 release tags exist, and the demo uses 1.0.1 from GitHub Releases, WinGet, or Homebrew. The pinned reference docs at `93aec83` still carry Experimental or alpha wording, so docs may lag releases. npm latest was still 0.13.1 on October 5, and Haflidi installs Squad from zero in a few minutes.

## s04-layers | 06:00-07:00 | One workflow, three distinct layers

> DRIVER Martin. Reveal the product-map connector, then the artifact boundary. Hold each for five seconds. Haflidi explains the CLI and tool layers; Martin explains Squad. Handoff to Martin at 07:00. Tip: name which product supplies each behavior.

**Haflidi:** Copilot CLI is the execution environment: Plan mode, file context, custom agents, tool access, permissions, subagents, review, and session controls. You can use all of that without Squad. The third layer is tools and evidence: Terraform, Git, Microsoft Learn, and MCP servers return artifacts, and none of them becomes correct just because an agent invoked it.

**Martin:** Squad adds a repository-backed team layer: a roster, narrow charters, routing and handoffs, and decisions a later task can recover. It runs through the CLI; it doesn't replace it. The human sets a bounded objective, the CLI runs the work, Squad organizes the responsibilities, and the result comes back as files, decisions, and check output we can inspect.

## s07-agent-setup | 07:00-08:00 | Meet the agent setup

> DRIVER Martin. No clip. Trace the diagram from always-on instructions to Squad and then to the three native profiles. Tip: tool filters are availability limits, not a sandbox.

**Martin:** Before we use the team, show the audience the configuration shape. `AGENTS.md` and `.github\copilot-instructions.md` are always-on repository guidance. The Terraform instruction file applies to HCL, so Terraform edits carry stricter source and validation rules than a normal prose change.

**Haflidi:** Squad is the coordinator. `.github\agents\squad.agent.md` points the CLI to the coordinator, and `.squad\` contains the team, routing rules, charters, and decisions. Squad owns the shared decisions and handoffs. It is not a Terraform sandbox.

**Martin:** The narrow native profiles are selected explicitly by the operator. I choose `/agent terraform-coder` for read, search, edit, and read-only documentation sources. I choose `/agent terraform-validator` for offline `fmt`, `init -backend=false`, `validate`, `tflint`, and `terraform test`. It never plans or applies. I choose `/agent terraform-reviewer` for a separate read-only review context.

**Haflidi:** MCP is scoped to information sources here: Microsoft Learn, the HashiCorp Terraform registry docs, and `squad_state` for Squad memory. Tool filters reduce what is available to a profile. They do not create a security boundary, and generic Squad tasks do not inherit those profile filters automatically.

## demo-c0 | 08:00-11:00 | C0: From zero to a squad

> DRIVER Haflidi. C0, 03:00 total. Recorded on the clean Windows 11 demo VM (reached only through Azure Bastion: Martin uses Entra sign-in with MFA, while Haflidi uses a local account because B2B guests cannot use Entra VM sign-in), never on a presenter laptop where the tools already exist. At clip 00:00 show the clean machine (no Git, Copilot CLI, or Squad), 00:30 the three winget installs, 01:15 `copilot` and `/login`, 01:50 `squad init`, 02:15 `copilot --agent squad` with the proposed roster confirmed, 02:45 `squad doctor`. Live fallback: the same VM, reset by the pipeline's recreate-vm action. Handoff to Martin at 11:00. Tip: install, init, hire, verify.

**Haflidi:** Everything you have seen so far ran on machines that already had the tools. So we recorded a clean start. This is a fresh Windows 11 virtual machine, reached only through Azure Bastion, deployed by the same kind of gated pipeline as the rest of the demo. Martin signs in with Entra and MFA; I use a local account because B2B guests cannot use Entra VM sign-in, with the credential handed over out of band. It has winget and PowerShell 7, because Copilot CLI needs PowerShell 6 or later and Windows still ships 5.1. It has no Git, no Copilot CLI, and no Squad.

**Haflidi:** Three winget installs: Git, `GitHub.Copilot`, and `bradygaster.Squad`. Then `copilot` and `/login` to authenticate with our GitHub account. Squad 1.0.1 comes from WinGet here, which matters, because npm latest still pointed at 0.13.1 earlier this month.

**Martin:** In the cloned repository, `squad init` is a terminal command, not something you ask the agent to do. It scaffolds the coordinator and templates. The team itself is hired in the next step, and that is where the human stays in charge.

**Haflidi:** `copilot --agent squad`, describe the project, and Init Mode proposes a roster: a few specialists, plus Scribe, Ralph, Rai, and Fact Checker. Nothing is written until we confirm. After that, `.squad\` holds the team, routing, and decisions, and it is reviewable in Git like any other change. `squad doctor` confirms the setup. Five steps from zero, and a setup check is not a Terraform test, so we still verify the work itself.

## s05-parallel | 11:00-12:00 | Give parallel work separate owners

> DRIVER Martin. No clip. Trace the ownership lanes from brief to handoff. Allow ten seconds to read the file boundaries. Handoff to Haflidi for the module contract. Tip: one writer per shared Terraform surface.

**Martin:** Parallel work helps when the outputs are independent. The infrastructure writer owns the module, a test author owns the tests against the agreed interface, documentation follows once that interface is stable, and a reviewer reports findings with a file, a requirement, and a check. Copilot CLI already supports parallel subagents and fleet; Squad adds the roster and routing conventions for this repository.

**Haflidi:** The boundary is the file, not the job title. Give each task one artifact owner and a stopping point, and pause dependent work when the interface changes. Separate conversations aren't filesystem isolation, and worktrees don't isolate credentials. For this module, a small team with precise handoffs is enough.

## s06-contract | 12:00-14:00 | Fit the platform you already have

> DRIVER Martin. No clip. Point to the public module boundary, then the existing network. Pause ten seconds on ownership labels. Handoff to Martin for native Plan mode. Tip: pass approved resource IDs, not ownership of the landing zone.

**Haflidi:** The outcome has changed from a repository-specific root into a reusable module. That makes the boundary important. The module should describe the agreed AKS infrastructure contract through inputs, outputs, and provider requirements. The consumer root chooses provider configuration, backend, authentication, and environment values. Kubernetes application resources belong in a separate application root, not in the same automatically loaded configuration.

**Martin:** Our primary consumption path is private Corp networking that already exists. Corp here means the private workload side of an Azure landing zone. We're not creating a parallel landing zone, a public standalone cluster, or a new network just to make the demo easy. Platform-approved subnets, DNS, egress, and identity permissions are prerequisites supplied through reviewed inputs.

**Haflidi:** Automatic has its own current private and custom-network requirements. Those include the API-server, user-node, and managed-system-pool network contract. The implementation owner must verify supported properties, capacity, and outbound compatibility. A generic subnet ID doesn't prove those requirements are met. Checked-in platform configuration also isn't a live policy snapshot.

**Martin:** The first useful planning question is therefore: what does this module own, and what does it consume? Keep private inputs and state out of the public module. Keep the private API requirement in the accepted brief. If the environment isn't ready, retain that gate rather than quietly changing the example to a public cluster.

## demo-c2 | 14:00-18:00 | C2: Pin the brief and approve a plan

> DRIVER Martin. C2, 04:00 total. Use `/plan` or `Shift+Tab` until the visible CLI shows Plan. The pinned executable also accepts `--plan` or `--mode plan`; `-i` retains an interactive session. Never use `--plan --mode autopilot`: it auto-approves the plan. Inspect `/instructions`, explicit `@file` references, and `/session plan`. Capture targets: 00:00-00:30 actual Plan indicator and disclosed checkpoint; 00:30-01:30 facts/assumptions; 01:30-02:30 proposed plan artifact; 02:30-03:15 real human revision; 03:15-04:00 approval and visible exit to implementation mode. About 40 seconds are observation, not additional pauses. No edits in this recorded run before approval; prior source qualification is separate. Handoff to Haflidi at 18:00. Tip: a planning prompt isn't the same as native Plan mode.

**Martin:** Activate native Plan mode and show its indicator and plan artifact. GitHub documents direct project-write guards, with limits for ambiguous shell or MCP actions. A Markdown plan alone has none of those controls. Typing make a plan isn't the same as changing modes. Keep the actual repository and interactive context visible, then inspect the proposal before implementation.

**Haflidi:** The file references do useful work. We include the current infrastructure, variables, provider requirements, and existing tests. We inspect the effective instructions rather than assuming they are current. In this source, some instruction claims were stale. Review and clean that context in the working lab, retain the preparation diff, and exclude inherited custom extensions from the native-feature demonstration.

**Martin:** The prompt defines the demonstrated change to the reusable module and its private-network consumer example. Identify prepared code already in the checkpoint. Preserve AzAPI, existing platform ownership, and the separate application boundary. Ask for affected files, owners, exact checks, and unresolved prerequisites. That gives the recorded run a useful task without pretending the whole module is being implemented for the first time.

**Martin:** A concrete stop condition helps too: return the proposed interface and checks before writing files. If a prerequisite is unresolved, ask for that decision rather than filling the gap with a default. That keeps a convenient guess from becoming our deployment contract.

**Haflidi:** Now read the plan as a contract. Does it identify the supported Automatic properties? Does it keep backend and provider configuration in the root? Does it test the resource body and outputs rather than only the spelling of an input? Does it acknowledge that live policy and deployment evidence are separate? A good plan should make those decisions easy to find.

**Martin:** The human revision should be genuine. For example, move the network and safe-test contract ahead of documentation, or reject an unnecessary platform redesign. We don't need a staged argument. If the first proposal is sound, clarify an unresolved input and ask the agent to preserve that decision. The point is human control over scope, not theatrical disagreement.

**Haflidi:** Approval comes after the revision, not hidden in the initial prompt. Confirm what is approved for implementation and what still needs a separate decision. Then leave Plan mode and show the active implementation mode before routing the writing work. We are approving a code change, not an Azure apply. Permissions still govern tools, and executable checks still decide whether the proposed change meets its contract.

## s08-plan-boundary | 18:00-20:00 | Extract a module, not an environment

> DRIVER Martin. Reveal the consumer boundary after the module boundary. Allow ten seconds to read. Haflidi leads, Martin closes. Handoff to Martin for C3. Tip: make ownership testable.

**Haflidi:** This is the shape the approved work should produce. A generic module contains the infrastructure resources, typed inputs, useful outputs, and provider requirements. A small consumer root configures providers and its own backend, passes approved existing-network inputs, and calls that module. The public example uses generic values and documents what an environment owner must supply.

**Martin:** That separation fixes more than folder aesthetics. Terraform loads all the root's configuration files. Mixing application and infrastructure roots can create duplicate declarations and bring in a live Kubernetes authentication path during tests. Moving files needs deliberate provider and state ownership; simply deleting the awkward file isn't a repair.

**Haflidi:** We also need to distinguish a fresh module consumer from an existing deployment. Extracting code can change resource addresses. This session isn't authorization to move or import estate state, convert a Base cluster in place, or remove destruction protection. Existing consumers would need a separately reviewed migration plan. Our example is for a fresh authorized workload.

**Martin:** The testable boundary is that no public module needs our private environment values to explain its interface. Another team should be able to read what it owns, supply compatible resource IDs, and see which prerequisites remain theirs. If that can't be explained in the example, the interface is not finished. Squad now has a concrete set of artifacts to route.

## demo-c3 | 20:00-24:00 | C3: Activate Squad and route independent work

> DRIVER Martin. C3, 04:00. Capture `/agent`, roster/charters/routing, `/tasks`, actual task starts, owned file edits, and a named handoff. Observe around 00:30, 01:40, and 03:10 for about 35 seconds total. Don't substitute a fabricated task dashboard. Handoff to Haflidi at 24:00. Tip: a role assignment isn't evidence of completed work.

**Martin:** Start with the active custom agent. The selector should show Squad in the intended repository. The CLI supplies that custom-agent capability; Squad supplies its team behavior. Verify the working directory and team root before sending the task. A shell message that says we're using Squad is not enough evidence that the visible session selected it.

**Haflidi:** Open only the roster and charter details needed for this change. The audience needs to see the implementation owner, test owner, reviewer, and the routing rule that connects them. We don't need every specialist that happens to be configured. The useful question is which role owns the next artifact and what it must return.

**Martin:** The implementation task should return the module diff and a description of its public interface. The test task should return specific cases and the commands used to run them. Documentation waits for the interface it describes. Each task has a stop condition, and none gets permission to deploy just because its charter says infrastructure engineer.

**Martin:** When implementation starts, I explicitly select `/agent terraform-coder`. That profile can read, search, edit, and use read-only documentation MCP servers. It is the writing lane, not the validation or review lane.

**Haflidi:** Watch for actual task activity and results. A task list is useful context, but it doesn't prove that files changed or checks ran. The handoff should identify the changed files, the source decision, real check output, and any remaining issue. A summary saying everything is complete doesn't give the next owner enough to review.

**Martin:** Keep shared edits serialized. If the module writer needs to change an input that the test author is using, make that an explicit handoff. Don't let both discover the conflict at integration time. Independent research or a read-only review can continue, but the accepted interface needs one current owner.

**Martin:** A useful handoff names the files, check, and next owner. Pass private-network and caller-owned-state constraints explicitly. Current documentation says custom subagents don't inherit repository instructions by default; `include-custom-instructions: true` opts in. Confirm the behavior in the selected build. Reusing a profile saves setup, but it doesn't replace the essential brief for this task.

**Haflidi:** This is where the team layer earns its place. We can follow the work through a named responsibility, an artifact, and a next owner. We still haven't proved the module correct. We've made the work easier to inspect and less likely to lose an unresolved question. The next chapter adds task guidance and authoritative facts so the same team doesn't merely agree on the wrong assumption.

## s10-tool-roles | 24:00-25:00 | Give context the right job

> DRIVER Martin. No clip. Keep all three columns visible. Pause five seconds. Handoff to Martin for C4. Tip: instructions, skills, and MCP are not interchangeable.

**Haflidi:** Instructions describe persistent repository expectations. File references bring particular code into the current task. A skill packages a focused working recipe that we invoke when it fits. MCP connects the CLI to tools or information outside its immediate conversation.

**Martin:** Keep those purposes separate. Don't paste an entire procedure into always-on instructions when a skill would fit better. Don't ask a stale repository comment to settle a current service requirement. And don't call a tool manager screen source verification. We need to see the guidance used, the source returned, and the decision it changes. The recipe tells us how to work; the source tells us what a service currently supports.

## demo-c4 | 25:00-29:00 | C4: Ground the work with tools

> DRIVER Martin. C4, 04:00. Use `/skills`, then show the actual invocation and effect. Use `/mcp`, then a read-only lookup with source/version. Show `/permissions` and one narrow decision. `--available-tools` controls availability; `--allow-tool` and `--deny-tool` control approval. No blanket grants. Allow about 40 seconds for source and permission reading. Never display authentication or private configuration. Handoff to Haflidi at 29:00. Tip: ask for the source property that changes the code.

**Martin:** In this chapter, a skill should change how the task is carried out. Listing installed skills isn't the result. Look for the actual invocation and the guidance it brings to the module or test work. Keep that guidance scoped. A reusable recipe is useful because it saves us explaining the same procedure, not because it is immune to mistakes.

**Haflidi:** The MCP call has a different job. It retrieves an authoritative source for the current private Automatic contract. We need the source address, relevant API or provider version, and the property that affects our implementation. If the tool returns a different provider's example, that is information to interpret, not permission to migrate this module to another provider.

**Martin:** Here is the question to ask while the response is visible: which claim will become an assertion or an explicit prerequisite? The cluster SKU, private API behavior, managed system pools, and compatible subnet requirements aren't interchangeable. We should be able to point from a source statement to the chosen resource contract without relying on a model's summary alone.

**Haflidi:** Permissions have two jobs. Tool availability controls what the model sees; allow and deny rules control approval, with denial taking precedence. Denying file writes doesn't block shell writes. Inspect the tool and arguments, then approve only the needed lookup. Keep authentication off-camera. Broad interpreter approval isn't permission for just one intended script.

**Martin:** If the lookup fails, say it failed. Use a reviewed source already captured during preparation, and label that substitution. Don't invent a successful tool response. A broken connection may be a rehearsal problem; it doesn't justify changing the module's requirements. The same rule applies if a skill isn't installed or a command differs in the rehearsed client version.

**Martin:** Keep the returned information smaller than the question it answers. A relevant schema excerpt and a source link are easier to review than a wall of tool output. The presenter should identify the property, explain its consequence, and leave enough time to read it. Save the longer source record for the repository handoff.

**Haflidi:** The practical benefit is that the next reviewer can follow the evidence. They can see why a field is required, why a network assumption remains pending, and which tool action the human allowed. The agent has done useful work by finding and applying information. We have not outsourced the decision about whether that information fits this environment.

## s12-source-check | 29:00-30:00 | Turn the source into an assertion

> DRIVER Martin. Reveal source, decision, then assertion. Code is an illustrative assertion, not terminal output. Pause five seconds on the final state. Handoff to Haflidi for test coverage. Tip: assert the resource, not a reassuring input.

**Haflidi:** The short version is to follow the claim all the way into the resource. The inherited code requested Base while the documentation described Automatic. A variable named automatic would not settle that mismatch. An assertion against the generated cluster contract is much closer to the requirement. It gives the reviewer a specific condition to inspect and a failure to investigate.

**Martin:** The assertion shown here illustrates that shape. It is not a passing test result. The actual test must match the reviewed module and provider behavior. Pair it with the private-network and managed-system-pool contract, and keep source versions in the decision record. A one-line SKU edit isn't the whole implementation.

## s13-test-gap | 30:00-32:00 | Test both sides of the boundary

> DRIVER Martin. No clip. Trace negative input cases, positive resource assertions, and mutation. Allow ten seconds of reading. Handoff of playback control to Haflidi for C5. Tip: enumerate every active provider before running tests.

**Haflidi:** Existing negative tests answer useful questions: does this invalid combination fail, and does the error identify the problem? They don't necessarily prove that a valid combination produces the right Azure resource. Keep those cases, but add positive contract assertions and checks for useful outputs. The consumer example also needs to exercise the supported interface.

**Martin:** First make the tests safe to run. In the inherited root, the mocks cover two providers, while another loaded file brings in Kubernetes and an authentication path. A plan-mode test doesn't magically isolate every provider. Review all configuration that Terraform loads, separate application resources, and verify the mocks before running the suite.

**Haflidi:** Then test the test. A deliberate small mutation should make the intended assertion fail. Change the contract under controlled conditions, retain the failure, restore the implementation, and rerun the same check. Label that mutation as deliberate. It proves the assertion can detect that particular defect, not that every possible deployment problem is covered. Check the failure reason too; a syntax error would not validate the intended contract assertion.

**Martin:** The useful repair loop preserves the requirement. We don't loosen a condition because the implementation finds it inconvenient. We ask whether the test, the implementation, or the original assumption is wrong, and we use the source to decide. Haflidi, take playback control for the failure and review sequence.

## demo-c5 | 32:00-37:00 | C5: Catch a mistake and repair it

> DRIVER Haflidi. C5, 05:00. Capture actual command/exit, failing assertion or structural error, `/review`, assigned repair, `/diff`, and identical check rerun. Ordinary test repair is not formal Squad rejection. If formal rejection occurs, use a different independent revision author under the coordinator protocol. Use about 50 seconds for reading. A passing expected-failure test is not this failure. Hand playback control back to Martin at 37:00. Tip: preserve cause and effect.

**Haflidi:** Begin with the command and exit status, not the summary. For the offline checks, select `/agent terraform-validator` and keep the native permission prompts visible. That profile can run `fmt`, `init -backend=false`, `validate`, `tflint`, and `terraform test`; it must never run `plan` or `apply`. A real nonzero result tells us the check did not pass. Read enough context to identify what it actually rejected. A structural Terraform error, an assertion failure, and a cloud permission error are different problems. We should not narrate one as another just because all three are red on screen.

**Martin:** Preparation may already include repairs for the inherited root and SKU issues. A later take doesn't recreate their first discovery. Show an actual failure from that new execution or a clearly labeled controlled mutation. The command and repair must run for real. Don't present earlier qualification logs as if they were captured during the later recording.

**Haflidi:** Review connects the finding to a file, requirement, and check. Squad names the next owner. Ordinary test repair isn't formal rejection. If the designated reviewer formally rejects an artifact, a different independent author must revise it; the rejected author doesn't produce or advise on that revision. This is coordination protocol, not a filesystem lock or merge approval. Preserve the actual failure and repair.

**Martin:** The implementation response should be narrow enough to explain. If the problem is overlapping roots, separate their responsibilities and keep provider configuration in the correct place. If the generated resource violates the supported contract, correct that contract. Don't hide an output error behind an unexplained null or remove a test because it exposes work we haven't finished.

**Haflidi:** Keep the interface stable unless the evidence requires a real design change. If it does, return to the planning decision and tell the test and documentation owners. Quietly renaming inputs while everyone else works against the old interface creates a second defect. The human can approve a revised boundary, but the recording should retain that decision.

**Martin:** Now compare the repair diff with the finding. We want to see that the change addresses the cause, not just the visible symptom. The same targeted command runs again. Then the preserved negative cases and other relevant checks run as well. A green targeted assertion can coexist with a regression somewhere else, so the complete result needs both.

**Martin:** Record the tool and provider selections with those results. If a dependency changed during the repair, disclose that change and review its effect. Otherwise two similar command lines may be checking different configurations without the viewer knowing.

**Haflidi:** Leave the actual outcome on screen long enough to read. If the clean run still fails, retain that result and investigate. Disclose earlier preparation rather than claiming first-try engineering success. Within the new take, preserve the real correction and human intervention. Labeled cuts can remove waiting; they cannot replace a command's outcome with an earlier result.

**Martin:** Our tip is to hand over the repair diff together with the unchanged check and its real output. That gives the reviewer a concrete basis for acceptance. It still doesn't establish Azure deployability. Haflidi, I'll take the controls back while we separate the evidence levels and the claims each can support.

## s15-proof | 37:00-40:00 | Evidence has levels

> DRIVER Martin. No clip. Read actual status labels from the evidence register. Never announce a pending gate as passed. Pause about 15 seconds across the rows. Haflidi leads interpretation; Martin leads handoff. Tip: a check proves only what it checks.

**Haflidi:** This slide separates five kinds of evidence. The source was inspected. The public module passed fifty-two mocked contract cases and two caller cases. Both deliberate mutations failed as expected, then passed after restoration. A private resource plan, approved apply, and ARM read-back now have separate sanitized evidence for the pinned runtime module revision. Local qualification is still not filmed evidence.

**Martin:** Each check proves only its own claim. Formatting checks presentation. Validation checks Terraform structure and provider-facing consistency. Lint checks configured rules. Tests assert what their authors wrote. A clean mock can still miss live service behavior, subnet capacity, effective policy, or identity permissions.

**Haflidi:** The consumer example matters because reuse is a claim about another person's starting point. Can they see which values are required, where providers and backend live, and which outputs to expect? Can they do that without seeing our private scope, state, or credentials?

**Martin:** A real Terraform plan would add environment-specific evidence, but it still would not be an apply. Exit code zero means unchanged, two means proposed changes, and one means an error. The raw plan may contain private identifiers, so the public material should show only a reviewed summary.

**Haflidi:** Azure read-back is a separate gate, and for this module it was supplied by the private IaC consumer. We can say the sanitized facts: Automatic SKU, private API with VNet integration, UDR, OIDC and workload identity, custom private DNS, and Succeeded provisioning. We still do not show private IDs, state, run URLs, or FQDNs.

## s16-continuity | 40:00-41:00 | Save the reason, not just the chat

> DRIVER Martin. No clip. Trace the decision into the next task. Pause five seconds. Handoff to Haflidi for C6. Tip: record why the boundary exists.

**Martin:** A later task needs to know why we chose this boundary. Private Corp consumption, existing network ownership, and separate application resources should survive beyond the conversation that introduced them. A short decision with its reason and source is more useful than a pasted transcript. Keep the decision close to the files whose behavior it constrains.

**Haflidi:** Scribe helps the Squad record that repository knowledge. The record still needs review, and the next task must actually read it. Native session resume brings back a conversation. It doesn't automatically prove that an agent recovered the repository's current decisions. We'll show both sides of that continuity, then inspect context and usage before starting more work.

## demo-c6 | 41:00-44:00 | C6: Resume with decisions intact

> DRIVER Martin. C6, 03:00. Show Scribe's actual record, `/resume`, a visible read/reference to that record, `/context`, and `/usage`. Allow about 30 seconds for observation. Do not display personal memory or unrelated sessions. Handoff to Martin at 44:00. Tip: confirm that the reason reached the resumed task.

**Haflidi:** Look first at what was saved. A useful decision identifies the accepted module boundary, the reason for private-network consumption, and the unresolved environment prerequisites. It doesn't need every sentence from the original conversation. The owning agent's history can add a short lesson, while the shared decision remains the common reference for the team.

**Martin:** Resume is a native CLI capability. We use it to return to the relevant session, not to browse unrelated conversations on a public screen. Confirm the working directory and active task. Then ask a concrete continuity question: which accepted constraints govern the next change, and which file records them?

**Haflidi:** The visible read or reference matters. A plausible answer might come from remaining conversation context rather than the file. We want evidence that the record created during this work becomes an input to the next task. If it is stale or incomplete, correct it openly before implementation continues.

**Martin:** Inspect the reported context and usage before another fan-out. Parent and subagents share credit accounting, and compaction can consume credits too. Limits are soft because accounting follows a response. Use those controls to make bounded decisions, not as a hard spending guarantee. Ask which unanswered question justifies the next task.

**Haflidi:** Model choice also belongs in the record. Keep it fixed for the comparison chapter; choose deliberately for later bounded tasks. We don't need a model ranking to make this useful. What matters is being able to explain the selected tool, the available context, and the reason for asking it to do another piece of work.

**Martin:** This is a modest continuity promise: the next task can recover a reviewed reason and use it. It is not perfect memory. That's why we keep important decisions in versioned repository artifacts and verify their use, rather than trusting a long chat to carry every requirement indefinitely.

## s18-memory | 44:00-46:00 | Three places to keep context

> DRIVER Martin. No clip. Keep personal memory closed. Allow ten seconds to read the comparison. Handoff to Haflidi for C7. Tip: separate CLI compaction from team-state hygiene.

**Martin:** There are three different mechanisms worth separating. Conversation context helps the current session continue its work. Native memory can retain useful facts, but we won't display personal memory contents. Squad's decisions and histories are repository-backed team knowledge. They have different owners and different review needs.

**Haflidi:** Compaction summarizes conversation context; it doesn't maintain Squad's decision ledger. Before reducing context, save the accepted module boundary, source, and unresolved prerequisite. After resuming, verify that the next owner read the relevant record. Don't quietly change the team state between comparison runs. Repository knowledge has its own review lifecycle, with maintenance references in the appendix. The contract should remain small enough for a human to inspect.

**Martin:** The rule I use is to put a requirement where the next owner can find and review it. The public module's contract belongs with the code and documentation. Private environment mapping stays in the environment's controlled location. A decision can link to a public requirement without copying private account details into a team history.

**Haflidi:** A reviewed testing recipe is useful portable knowledge. Retain the defect it detects, the evidence, and the limits, so another task can reuse the method. That is earned guidance, not model retraining. Keep the public lesson separate from private inputs and unrelated conversations. We can now review the consumer-facing change without reopening every earlier discussion.

## demo-c7 | 46:00-49:00 | C7: Reviewed diff to approved Terraform change

> DRIVER Martin. C7, 03:00. Show `/diff` for the actual change in this take. Identify preparation/qualification evidence separately. Show checks, an actual resource plan only if approved evidence exists, and the human decision. Reserve about 35 seconds for inspection. Use the supplied sanitized Azure read-back only; no apply on stage and no private target details. Handoff to Martin at 49:00. Tip: approve a specific artifact and scope.

**Haflidi:** Review the change as a consumer would. The module should have a defined input and output contract. The example root should show how to configure providers, own its backend, and supply approved network inputs. The documentation should identify prerequisites rather than bury them in a command that only works in the author's environment.

**Martin:** Distinguish the preparation diff from changes executed in this take. Source history explains the module extraction and provider boundary. The recorded diff shows the actual new change. Identify its starting checkpoint and relevant checks, rather than presenting prepared infrastructure as newly authored or old qualification output as fresh capture.

**Haflidi:** Next, compare the real check results with the accepted requirements. Use `/agent terraform-validator` again for the offline suite, under native permission prompts. For the independent acceptance review, switch to `/agent terraform-reviewer` with the exact diff and sanitized results, rather than reviewing inside the author's context. If a real resource plan is available, inspect the intended fresh workload resources and the target boundary. No estate imports, scope moves, or policy exceptions become acceptable because they're convenient for the recording. Keep private values out of the public evidence.

**Martin:** The human decision must name what is approved. A reviewed code change can be accepted while deployment remains blocked on environment prerequisites. A separately approved plan applies only to its exact artifact and scope. The clip title doesn't imply that an Azure deployment happened.

**Haflidi:** After an authorized deployment, read-back would need to establish the private-cluster behavior and relevant platform results. Until that evidence exists, it stays pending. There is no reason to replace a missing result with a green badge. The useful outcome here is a change whose code, checks, consumption path, and remaining decisions another engineer can inspect.

**Martin:** Our final handoff is the module revision, the example, the meaningful checks, and the unresolved gates. That is a much stronger starting point for reuse than a chat transcript saying the work is done.

## s20-consumer | 49:00-51:00 | Reuse the code, not the environment

> DRIVER Martin. No clip. Point from the consumer root into the module, then to private configuration. Pause ten seconds. Handoff to Haflidi for operating rules. Tip: version the module separately from environment inputs.

**Martin:** The public session material includes the reusable module and a sanitized consumption example. The same module tree is intended for its own repository so consumers can pin a reviewed revision independently of the slide deck. Publication and release claims need their own verification. Don't guess a version tag because the example would look cleaner with one.

**Haflidi:** In an existing landing zone, the consumer supplies the approved scope and network contract. It owns backend configuration and authentication. The module doesn't need to know an organization's private topology to describe its requirements. The public example should teach that boundary using generic values, with no state, secrets, or real environment inputs alongside it.

**Martin:** Keep infrastructure and application delivery separate. A Kubernetes application root may need cluster access and its own lifecycle. That isn't a reason to pull live cluster authentication into a mocked infrastructure test. Separate roots let us explain who owns each operation and which check can run without reaching a live service. That separation also makes the public example easier to review and maintain.

**Haflidi:** Before calling the module reusable, verify the example from a clean starting point. Check the interface, outputs, dependencies, and documented prerequisites. Then assess the actual environment separately. Reuse saves repeated implementation work; it doesn't remove the platform owner's responsibility for the network, identity, policy, and state decisions around it.

## s21-limits | 51:00-53:00 | Make the next change easier to review

> DRIVER Martin. No clip. Hold the three operating rules without extra fragments. Allow about 10 seconds for reflection and the Q&A transition. Haflidi closes the content; Martin opens the floor at 53:00. Tip: keep the artifact, the reason, and the check together.

**Haflidi:** The useful habits fit a normal engineering day. Use native Plan mode when the change has decisions worth resolving before edits. Attach the files and instructions that matter. Ask for the smallest module boundary that satisfies the consumer, the behavior that must remain unchanged, and the checks that prove it.

**Martin:** Use Squad when named ownership and handoffs help. Keep independent tasks independent. Keep one writer on a shared Terraform surface. Let the reviewer return an exact finding and let Scribe retain the reason for an accepted decision. More agents cannot vote a resource contract into correctness.

**Haflidi:** Use skills for repeatable procedures and MCP for a specific source or tool. Approve the narrow action that is needed. A Markdown plan describes intended work; it isn't a permission system. A role describes responsibility; it isn't isolation from the filesystem or cloud.

**Martin:** Check the diff and the tests, then check what they establish. Local validation, isolated contract tests, a consumer example, a real plan, and Azure read-back answer different questions. Keep remaining gates visible: recordings, native profile selection, and full rehearsal still need evidence. Don't switch to a public default just to make the demo end neatly.

**Haflidi:** Qualify code before filming, then capture genuine new execution from a disclosed checkpoint. The public handoff is the module, the decisions, and the evidence status. If the next engineer can find the contract, run the check, and understand the handoff, the tools have done useful work.

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

**Haflidi:** Delegate hands work to a cloud-agent draft-PR workflow. The resulting change still needs review. Remote control steers a still-running local CLI session, so that host must stay online. Neither is necessary for our local recorded module work. Both can be useful later, but we don't open a public sharing session on stage or imply a PR exists when it doesn't.

**Haflidi:** Here is a question about the artifact rather than the agent. Why isn't a passing mocked test enough to call the module ready for an existing landing zone?

**Martin:** The mock checks the contract we wrote, under the assumptions we supplied. It doesn't establish subnet capacity, private DNS resolution, deployment permissions, effective policy, service-managed behavior, or the compatibility of the actual outbound design. A clean consumer example adds evidence about the interface. A real plan and authorized read-back add environment evidence. Keep those claims separate instead of treating one green result as a universal certificate.

**Martin:** Last prepared topic, unless an audience question comes in: how do you share the useful team knowledge without sharing the environment?

**Haflidi:** Put the public contract and public source decisions with the module. Keep private scope mapping and state in the environment's controlled location. Review team exports before sharing, and use maintenance previews rather than blindly rewriting histories. CLI compaction and Squad team-state hygiene solve different problems. Neither grants permission to publish personal memory or confidential context.

**Martin:** The same applies to recordings. A private repository doesn't keep code private once it is visible in a public video. Review the actual frames, not just the filenames. Keep the source revision and meaningful check output, but remove private identifiers and credentials without changing the conclusion.

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

> Reference only. Answer "can this run somewhere simpler?" Keywords: same module, thin root, guardrails constrain, runtime evidence not hope. The demo-env repo root `deployments/online` consumes the module by tag `v0.6.0` and owns providers, backend, network, and the namespace. Three landing-zone controls shaped it: storage forced private (state through a private endpoint, so an ephemeral VNet-integrated runner), `Deny-Subnet-Without-Nsg` (the AKS-managed VNet was rejected, so BYO subnets with NSGs and an explicit NAT Gateway), and AKS RBAC Writer cannot create namespaces (managed namespace through ARM). Nothing was exempted. The chain: PR, protected branch, human environment gate, OIDC, plan and apply in one job with no plan artifact, a public API server that accepts only the runner's static egress IP, Entra-only kubeconfig, and a runtime check step that fails unless the hostname returns HTTPS 200, HTTP redirects, and DNS resolves to the App Routing controller Service address. The current page at `https://aks-online-demo.swedencentral.cloudapp.azure.com/` is the branded NIC 2026 demo, served by pinned `nginx-unprivileged`, showing the serving pod, render time, flow, and speakers; apply runs 37771532872 and 37772290635 both ended with plan "No changes", DNS matching the ingress IP, HTTPS 200 by hostname, and title "AKS Automatic | NIC 2026 demo". `Test-OnlineSecurity.ps1` is 29/29 PASS. The real runs found seven issues: five module fixes written test-first (user-assigned identity for BYO subnets, `userAssignedNATGateway` egress, two perpetual drifts, and the SKU: the module sent `Base`, now `cluster_sku = "Automatic"` with managed system node pools), one root fix (no module-level `depends_on`), and one fixed later in the module (`count` on a plan-time-unknown subnet ID, now the explicit `use_external_subnets` flag with a regression test). The cluster was rebuilt as the Automatic SKU because Base to Automatic migration is not supported. Detail and evidence: `docs/online-demo.md`. Do not show subscription, tenant, or principal IDs.

## a-security | Appendix | What AI found that the scanners did not

> Reference only. Answer "how did AI help security, and what does GHAS already do?" Keywords: GHAS baseline, silent gaps, oracle, human approval. The module and demo-env repositories run CodeQL default setup, secret scanning with push protection, and Dependabot security updates, with zero open alerts on October 7. Module `main` requires Terraform Validate, Style Check, CodeQL, Checkov, TFLint, and Trivy; demo-env `main` requires Terraform Validate, Checkov, TFLint, and Trivy. The agent found what produces no alert: Checkov's parser had rejected the module's `main.tf` since August, so the cluster definition was never scanned; the Security Scan workflow had been disabled for inactivity; a feature monitor reported green while crashing; approving a gate right after dispatch silently failed; and a VM cleanliness check could not see per-user installs. Microsoft Learn through MCP supplied product rules such as Base to Automatic migration not being supported. Each claim was then re-checked by a test or read-back: 52 module contract cases plus 2 caller/example Terraform test cases; 29/29 Online read-back checks including negative tests from the internet; and 14 VM checks. Every merge and every Azure write had a human decision. Gaps stay visible: single-maintainer admin merges, identifiers in history, and Checkov not reading azapi bodies. Detail: `docs/security-case.md`.

## a-prompts | Appendix | Prompts you can rerun

> Reference only. Answer "how do I get similar results with my agents?" Keywords: guardrails first, one lane per step, the oracle marks outcomes, measure repeatability. Step 1 reads effective policy and RBAC at the target before design; step 2 grounds API facts through Microsoft Learn and Terraform Registry MCP with citations. Then `terraform-coder` edits, `terraform-validator` runs fixed offline commands, and `terraform-reviewer` reviews in a fresh `/new` context. Consume through a thin root and deploy through the pipeline. In the October 8 eval, repeatability was measured as five fresh runs from one checkpoint against a pre-registered `>= 4/5` green bar; this is a checkpoint, not a guarantee. Results were B1 0/5, B2 5/5, and B3 4/5 after a disclosed harness-bug rescore from saved diffs, with no Copilot rerun and the out-of-scope README edit still red; two of three briefs met the threshold, and the misses stayed visible. Prompts: `docs/prompt-pack.md`. Do not claim the model is deterministic.

## a-bootstrap | Appendix | Start a squad in five steps

> Reference only. Answer "how do I start?" Keywords: install, init, hire, verify, upgrade safely. (1) Prerequisites: Copilot CLI and a Git repository; GitHub CLI only if you want issue routing. (2) Install Squad 1.0.x with `winget install --id bradygaster.Squad --exact`, Homebrew, or GitHub Releases; npm `latest` still pointed at 0.13.1 on October 5. (3) In the repository terminal run `squad init`; it is a shell command, not something you ask the agent. (4) Start `copilot --agent squad` and describe what you are building. Init Mode proposes a cast roster (a few specialists plus Scribe, Ralph, Rai, and Fact Checker) and writes nothing until you confirm; then it creates `.squad\` with team, routing, decisions, and member histories. Commit it. (5) Check with `squad doctor`. Before `squad upgrade`, back up: it preserves team, routing, decisions, histories, and config, but replaces the coordinator file and templates. Simplest good start: one repository, three to five specialists, add narrow native profiles only where a lane needs limits.

## a-use-cases | Appendix | When Squad earns its place

> Reference only. Answer "when is it worth it, and how does it fit with Copilot CLI?" One line: Copilot CLI runs the work; Squad decides who does it and remembers why. The CLI is the execution surface: model, tools, permissions, Plan mode, MCP, diff, review, and resume. Squad is a custom agent inside it plus repository state: roles, routing, handoffs, decisions, and ceremonies. Use Squad when work crosses owners (module, tests, and docs in parallel with one writer per file), when work outlives a session (decisions and histories let you resume or hand over), and for backlog and review flow (issues routed by `squad:{member}` labels, Ralph keeping the queue moving, and a rejected change revised by a different author). Skip it for a small, well-understood edit that fits one CLI lane. Squad does not replace Terraform checks, human approval, or the CLI's own permissions.
