# Martin and Haflidi: complete delivery script

This script lets Martin and Haflidi deliver the 53-minute session and seven-minute Q&A using the same slide IDs and notes as the Reveal presentation.

## Delivery contract

The main script includes narration over 26 minutes of silent video. It does not add 26 minutes to the spoken running time. The other live segments total 27 minutes. Bracketed cues and blockquotes are operator instructions, not spoken words. Read speaker paragraphs at about 120 words per minute; use the remaining time for the explicit observation pauses, handoffs, and slide changes. Do not accelerate code reading to recover time.

Martin hosts the opening, owns the brief, and normally drives the presentation. Haflidi leads review, evidence interpretation, and the Q&A. The non-speaking presenter watches the clock and prepares the next cue. At C5, Haflidi takes playback control while Martin explains the implementation response. They hand control back explicitly after the chapter.

The current package has honest recording slots, not completed footage. Play a chapter only when approved footage is attached. Otherwise leave its viewing guide visible and deliver the same explanation without pretending that a command ran. The main narration describes what to inspect rather than inventing a particular result. The evidence slide is the authority for current completion status. Local test success, a real Azure plan, deployment, and policy read-back are separate claims.

Every product chapter must show genuine Copilot CLI with Squad selected, either standalone or in a real integrated terminal. Capture automation stays off-screen as external tooling, not a Squad feature. Do not substitute custom viewers, artifact-pilot frames, fabricated screenshots, or terminal output for native recordings.

All environment references are generic. Public module code and examples are separate from private environment inputs, backend/state, identities, and secrets. No personal memory, private policy evidence, or unreviewed terminal history should appear on screen.

Recording preflight: pin the actual CLI executable/package and show its version. The [verified feature guide](feature-guide.md) probed CLI 1.0.88 directly, while unqualified `copilot` resolved to 1.0.89. `--no-auto-update` doesn't select an older version. Rehearse the chosen build; help observations and current documentation are not completed UI demonstrations.

## s01-outcome | 00:00-01:00 | A module worth reusing

> DRIVER Martin. Open on the title card. Both names are visible. No clip. Pause for five seconds after the first paragraph. Handoff to Haflidi for C1. Tip: define the useful artifact before choosing agents.

**Martin:** A useful agent session should leave something another engineer can consume. Today that something is a reusable Terraform module for private AKS in an existing Azure landing zone. I'm Martin, and this is Haflidi. We'll connect the Copilot CLI features you can use tomorrow with the team conventions that Squad adds.

**Haflidi:** We'll start with existing code, not an empty folder. We'll separate reusable infrastructure from environment configuration, put checks around the contract, and explain the decisions as we go. The recordings make the teaching sequence inspectable. They don't make the model deterministic. First, let's compare two attempts without turning them into a competition.

## demo-c1 | 01:00-04:00 | C1: Same task, different agent choices

> DRIVER Martin. C1, 03:00 total. Play only approved footage; otherwise keep the clearly pending viewing guide. Capture `/model` and the selected model. At clip 00:00 inspect run identity, 00:40 inspect inputs, 01:30 compare one decision, 02:20 inspect its consequence. Allow about 45 seconds of observation across the chapter. Handoff to Martin at 04:00. Tip: hold inputs fixed, including repository memory.

**Haflidi:** In these two attempts, the useful comparison is a choice that affects our module. Does the agent preserve a validation rule? Does it notice that provider configuration belongs in the consumer root? Does it propose a test for the actual resource body? We aren't counting words or judging which response sounds more confident. If both attempts make the same sound choice, that's a valid result.

**Martin:** Start with the inputs. We need the same reviewed source checkpoint, the same task, and an explicitly selected model. The model selector is a native CLI control. It helps us record what we asked to do the work. It doesn't freeze a hosted service forever, and we shouldn't pretend that a model name is a reproducible build identifier.

**Haflidi:** A fresh conversation alone isn't enough. Instructions, skills, tool access, and repository-backed decisions can change the task. If the first run writes a decision and the second reads it, we've changed the experiment. Keep separate working copies and equivalent starting team state. Don't delete personal or global memory to manufacture a clean story. Record the permission boundary as well; an unavailable source can change the answer without telling us anything about model quality.

**Martin:** Watch the effect of one choice on the acceptance criteria. A different order of work may be harmless. A different network ownership assumption may be expensive. Two runs don't establish an error rate, and we won't repeat them until something dramatic happens. Our practical response is to make intent, context, and checks visible. The next chapters use a separately identified guided pass, so no result from this comparison becomes a hidden head start.

## s03-baseline | 04:00-05:00 | Start with the code you have

> DRIVER Martin. No clip. Read the source pin, not private paths. Hold the source strip for five seconds. Handoff to Haflidi for the product map. Tip: distinguish inherited code, preparation, and new work.

**Martin:** Our starting point is the public AKS root module at the revision shown here. It already has typed inputs, outputs, and ten negative test cases. It also has real quality issues: overlapping root declarations, an active provider outside the test mocks, and documentation that doesn't match the requested SKU.

**Haflidi:** Those are inherited findings, not evidence that an AI caused them. We're extracting a reusable infrastructure boundary and repairing the relevant contract. Preparation, new edits, and later checks need separate evidence. Keep the original pin intact so another person can tell which behavior came from upstream and which change we're asking them to trust.

## s04-layers | 05:00-08:00 | One workflow, three distinct layers

> DRIVER Martin. Reveal the product-map connector, then the artifact boundary. Hold each for five seconds. Haflidi explains the first layer; Martin explains Squad. Handoff to Martin at 08:00. Tip: name which product supplies each behavior.

**Haflidi:** Copilot CLI is the execution environment here. It provides native Plan mode, file context, custom agents, tool access, permissions, subagents, review, and session controls. You can use those capabilities without Squad. If one small change fits one clear conversation, that may be the right amount of machinery.

**Martin:** Squad adds a repository-backed team layer. Its roster describes who's available. Charters narrow responsibilities. Routing decides where work goes, and handoffs describe what the next owner needs. Decisions and histories help a later task recover the reasons behind a change. Squad runs through the CLI's capabilities; it doesn't replace them with a separate Terraform engine.

**Haflidi:** The third layer contains tools and evidence. Terraform understands configuration and produces plans. An MCP server exposes a particular tool or information source. Microsoft Learn documents service behavior. Git shows the diff. None of those becomes correct merely because an agent invoked it. We still need to ask what a command checked, which version it used, and whether the result applies to this module.

**Martin:** Follow the arrows in the diagram. The human sets a bounded objective. The CLI receives the context and runs the work. Squad organizes the people-shaped responsibilities around that work. The result should return as files, decisions, and check output that a human can inspect. An agent summary is helpful, but it isn't a replacement for those artifacts.

**Haflidi:** This distinction also makes troubleshooting faster. A missing tool is not a routing problem. A stale charter is not a Terraform schema error. A successful model response doesn't prove a deployment identity has access to a subnet. Name the layer before changing the setup, or you'll spend time fixing the wrong thing.

**Martin:** Our working tip is simple: attach every advertised feature to an action and a useful result. Selecting an agent is an action. A named owner returning the agreed test file is a result. Opening the MCP manager is an action, but a source lookup that changes an assertion is the useful result. That's the standard we'll use for the rest of the session.

## s05-parallel | 08:00-10:00 | Give parallel work separate owners

> DRIVER Martin. No clip. Trace the ownership lanes from brief to handoff. Allow ten seconds to read the file boundaries. Handoff to Haflidi for the module contract. Tip: one writer per shared Terraform surface.

**Martin:** Parallel work helps when the outputs can be independent. The infrastructure writer owns the module implementation. A test author owns the isolated test cases against the agreed interface. Documentation can describe consumption once that interface is stable. A reviewer reads the combined change and reports a finding with a file, requirement, and check. These are responsibilities, not a promise that four agents are better than one.

**Haflidi:** The critical boundary is the file, not just the job title. Two agents called architect and engineer can still overwrite the same Terraform block. Give each task an artifact owner and a stopping point. If the interface changes, pause the dependent work and hand over the new contract. Don't let the test author guess a different public input name.

**Martin:** Copilot CLI already supports parallel subagents. Fleet is another native way to distribute work. Squad adds the roster and routing conventions we want for this repository. We don't need to nest fleet inside Squad just to display another command. Use the simplest arrangement that makes ownership and review clear.

**Haflidi:** Separate conversations aren't filesystem isolation, and worktrees don't isolate credentials. The lead still owns integration. Before another fan-out, ask whether the task is independent, whether its result can be checked, and whether the extra context and usage are worth it. For this module, a small team with precise handoffs is enough.

## s06-contract | 10:00-12:00 | Fit the platform you already have

> DRIVER Martin. No clip. Point to the public module boundary, then the existing network. Pause ten seconds on ownership labels. Handoff to Martin for native Plan mode. Tip: pass approved resource IDs, not ownership of the landing zone.

**Haflidi:** The outcome has changed from a repository-specific root into a reusable module. That makes the boundary important. The module should describe the agreed AKS infrastructure contract through inputs, outputs, and provider requirements. The consumer root chooses provider configuration, backend, authentication, and environment values. Kubernetes application resources belong in a separate application root, not in the same automatically loaded configuration.

**Martin:** Our primary consumption path is private Corp networking that already exists. Corp here means the private workload side of an Azure landing zone. We're not creating a parallel landing zone, a public standalone cluster, or a new network just to make the demo easy. Platform-approved subnets, DNS, egress, and identity permissions are prerequisites supplied through reviewed inputs.

**Haflidi:** Automatic has its own current private and custom-network requirements. Those include the API-server, user-node, and managed-system-pool network contract. The implementation owner must verify supported properties, capacity, and outbound compatibility. A generic subnet ID doesn't prove those requirements are met. Checked-in platform configuration also isn't a live policy snapshot.

**Martin:** The first useful planning question is therefore: what does this module own, and what does it consume? Keep private inputs and state out of the public module. Keep the private API requirement in the accepted brief. If the environment isn't ready, retain that gate rather than quietly changing the example to a public cluster.

## demo-c2 | 12:00-16:00 | C2: Pin the brief and approve a plan

> DRIVER Martin. C2, 04:00 total. Use `/plan` or `Shift+Tab` until the visible CLI shows Plan. The pinned executable also accepts `--plan` or `--mode plan`; `-i` retains an interactive session. Never use `--plan --mode autopilot`: it auto-approves the plan. Inspect `/instructions`, explicit `@file` references, and `/session plan`. Capture targets: 00:00-00:30 actual Plan indicator and context; 00:30-01:30 facts/assumptions; 01:30-02:30 proposed plan artifact; 02:30-03:15 real human revision; 03:15-04:00 approval and visible exit to implementation mode. About 40 seconds are observation, not additional pauses. No edits before approval. Handoff to Haflidi at 16:00. Tip: a planning prompt isn't the same as native Plan mode.

**Martin:** Activate native Plan mode and show its indicator and plan artifact. GitHub documents direct project-write guards, with limits for ambiguous shell or MCP actions. A Markdown plan alone has none of those controls. Typing make a plan isn't the same as changing modes. Keep the actual repository and interactive context visible, then inspect the proposal before implementation.

**Haflidi:** The file references do useful work. We include the current infrastructure, variables, provider requirements, and existing tests. We inspect the effective instructions rather than assuming they are current. In this source, some instruction claims were stale. Review and clean that context in the working lab, retain the preparation diff, and exclude inherited custom extensions from the native-feature demonstration.

**Martin:** The prompt asks for a reusable infrastructure module and a private-network consumer example. It preserves AzAPI, states which existing platform resources we must not take over, and separates application resources from infrastructure. It also asks for proposed file changes, owners, exact checks, and unresolved prerequisites. That is much more useful than asking the agent to improve everything.

**Martin:** A concrete stop condition helps too: return the proposed interface and checks before writing files. If a prerequisite is unresolved, ask for that decision rather than filling the gap with a default. That keeps a convenient guess from becoming our deployment contract.

**Haflidi:** Now read the plan as a contract. Does it identify the supported Automatic properties? Does it keep backend and provider configuration in the root? Does it test the resource body and outputs rather than only the spelling of an input? Does it acknowledge that live policy and deployment evidence are separate? A good plan should make those decisions easy to find.

**Martin:** The human revision should be genuine. For example, move the network and safe-test contract ahead of documentation, or reject an unnecessary platform redesign. We don't need a staged argument. If the first proposal is sound, clarify an unresolved input and ask the agent to preserve that decision. The point is human control over scope, not theatrical disagreement.

**Haflidi:** Approval comes after the revision, not hidden in the initial prompt. Confirm what is approved for implementation and what still needs a separate decision. Then leave Plan mode and show the active implementation mode before routing the writing work. We are approving a code change, not an Azure apply. Permissions still govern tools, and executable checks still decide whether the proposed change meets its contract.

## s08-plan-boundary | 16:00-18:00 | Extract a module, not an environment

> DRIVER Martin. Reveal the consumer boundary after the module boundary. Allow ten seconds to read. Haflidi leads, Martin closes. Handoff to Martin for C3. Tip: make ownership testable.

**Haflidi:** This is the shape the approved work should produce. A generic module contains the infrastructure resources, typed inputs, useful outputs, and provider requirements. A small consumer root configures providers and its own backend, passes approved existing-network inputs, and calls that module. The public example uses generic values and documents what an environment owner must supply.

**Martin:** That separation fixes more than folder aesthetics. Terraform loads all the root's configuration files. Mixing application and infrastructure roots can create duplicate declarations and bring in a live Kubernetes authentication path during tests. Moving files needs deliberate provider and state ownership; simply deleting the awkward file isn't a repair.

**Haflidi:** We also need to distinguish a fresh module consumer from an existing deployment. Extracting code can change resource addresses. This session isn't authorization to move or import estate state, convert a Base cluster in place, or remove destruction protection. Existing consumers would need a separately reviewed migration plan. Our example is for a fresh authorized workload.

**Martin:** The testable boundary is that no public module needs our private environment values to explain its interface. Another team should be able to read what it owns, supply compatible resource IDs, and see which prerequisites remain theirs. If that can't be explained in the example, the interface is not finished. Squad now has a concrete set of artifacts to route.

## demo-c3 | 18:00-22:00 | C3: Activate Squad and route independent work

> DRIVER Martin. C3, 04:00. Capture `/agent`, roster/charters/routing, `/tasks`, actual task starts, owned file edits, and a named handoff. Observe around 00:30, 01:40, and 03:10 for about 35 seconds total. Don't substitute a fabricated task dashboard. Handoff to Haflidi at 22:00. Tip: a role assignment isn't evidence of completed work.

**Martin:** Start with the active custom agent. The selector should show Squad in the intended repository. The CLI supplies that custom-agent capability; Squad supplies its team behavior. Verify the working directory and team root before sending the task. A shell message that says we're using Squad is not enough evidence that the visible session selected it.

**Haflidi:** Open only the roster and charter details needed for this change. The audience needs to see the implementation owner, test owner, reviewer, and the routing rule that connects them. We don't need every specialist that happens to be configured. The useful question is which role owns the next artifact and what it must return.

**Martin:** The implementation task should return the module diff and a description of its public interface. The test task should return specific cases and the commands used to run them. Documentation waits for the interface it describes. Each task has a stop condition, and none gets permission to deploy just because its charter says infrastructure engineer.

**Haflidi:** Watch for actual task activity and results. A task list is useful context, but it doesn't prove that files changed or checks ran. The handoff should identify the changed files, the source decision, real check output, and any remaining issue. A summary saying everything is complete doesn't give the next owner enough to review.

**Martin:** Keep shared edits serialized. If the module writer needs to change an input that the test author is using, make that an explicit handoff. Don't let both discover the conflict at integration time. Independent research or a read-only review can continue, but the accepted interface needs one current owner.

**Martin:** A useful handoff names the files, check, and next owner. Pass private-network and caller-owned-state constraints explicitly. Current documentation says custom subagents don't inherit repository instructions by default; `include-custom-instructions: true` opts in. Confirm the behavior in the selected build. Reusing a profile saves setup, but it doesn't replace the essential brief for this task.

**Haflidi:** This is where the team layer earns its place. We can follow the work through a named responsibility, an artifact, and a next owner. We still haven't proved the module correct. We've made the work easier to inspect and less likely to lose an unresolved question. The next chapter adds task guidance and authoritative facts so the same team doesn't merely agree on the wrong assumption.

## s10-tool-roles | 22:00-23:00 | Give context the right job

> DRIVER Martin. No clip. Keep all three columns visible. Pause five seconds. Handoff to Martin for C4. Tip: instructions, skills, and MCP are not interchangeable.

**Haflidi:** Instructions describe persistent repository expectations. File references bring particular code into the current task. A skill packages a focused working recipe that we invoke when it fits. MCP connects the CLI to tools or information outside its immediate conversation.

**Martin:** Keep those purposes separate. Don't paste an entire procedure into always-on instructions when a skill would fit better. Don't ask a stale repository comment to settle a current service requirement. And don't call a tool manager screen source verification. We need to see the guidance used, the source returned, and the decision it changes. The recipe tells us how to work; the source tells us what a service currently supports.

## demo-c4 | 23:00-27:00 | C4: Ground the work with tools

> DRIVER Martin. C4, 04:00. Use `/skills`, then show the actual invocation and effect. Use `/mcp`, then a read-only lookup with source/version. Show `/permissions` and one narrow decision. `--available-tools` controls availability; `--allow-tool` and `--deny-tool` control approval. No blanket grants. Allow about 40 seconds for source and permission reading. Never display authentication or private configuration. Handoff to Haflidi at 27:00. Tip: ask for the source property that changes the code.

**Martin:** In this chapter, a skill should change how the task is carried out. Listing installed skills isn't the result. Look for the actual invocation and the guidance it brings to the module or test work. Keep that guidance scoped. A reusable recipe is useful because it saves us explaining the same procedure, not because it is immune to mistakes.

**Haflidi:** The MCP call has a different job. It retrieves an authoritative source for the current private Automatic contract. We need the source address, relevant API or provider version, and the property that affects our implementation. If the tool returns a different provider's example, that is information to interpret, not permission to migrate this module to another provider.

**Martin:** Here is the question to ask while the response is visible: which claim will become an assertion or an explicit prerequisite? The cluster SKU, private API behavior, managed system pools, and compatible subnet requirements aren't interchangeable. We should be able to point from a source statement to the chosen resource contract without relying on a model's summary alone.

**Haflidi:** Permissions have two jobs. Tool availability controls what the model sees; allow and deny rules control approval, with denial taking precedence. Denying file writes doesn't block shell writes. Inspect the tool and arguments, then approve only the needed lookup. Keep authentication off-camera. Broad interpreter approval isn't permission for just one intended script.

**Martin:** If the lookup fails, say it failed. Use a reviewed source already captured during preparation, and label that substitution. Don't invent a successful tool response. A broken connection may be a rehearsal problem; it doesn't justify changing the module's requirements. The same rule applies if a skill isn't installed or a command differs in the rehearsed client version.

**Martin:** Keep the returned information smaller than the question it answers. A relevant schema excerpt and a source link are easier to review than a wall of tool output. The presenter should identify the property, explain its consequence, and leave enough time to read it. Save the longer source record for the repository handoff.

**Haflidi:** The practical benefit is that the next reviewer can follow the evidence. They can see why a field is required, why a network assumption remains pending, and which tool action the human allowed. The agent has done useful work by finding and applying information. We have not outsourced the decision about whether that information fits this environment.

## s12-source-check | 27:00-28:00 | Turn the source into an assertion

> DRIVER Martin. Reveal source, decision, then assertion. Code is an illustrative assertion, not terminal output. Pause five seconds on the final state. Handoff to Haflidi for test coverage. Tip: assert the resource, not a reassuring input.

**Haflidi:** The short version is to follow the claim all the way into the resource. The inherited code requested Base while the documentation described Automatic. A variable named automatic would not settle that mismatch. An assertion against the generated cluster contract is much closer to the requirement. It gives the reviewer a specific condition to inspect and a failure to investigate.

**Martin:** The assertion shown here illustrates that shape. It is not a passing test result. The actual test must match the reviewed module and provider behavior. Pair it with the private-network and managed-system-pool contract, and keep source versions in the decision record. A one-line SKU edit isn't the whole implementation.

## s13-test-gap | 28:00-30:00 | Test both sides of the boundary

> DRIVER Martin. No clip. Trace negative input cases, positive resource assertions, and mutation. Allow ten seconds of reading. Handoff of playback control to Haflidi for C5. Tip: enumerate every active provider before running tests.

**Haflidi:** Existing negative tests answer useful questions: does this invalid combination fail, and does the error identify the problem? They don't necessarily prove that a valid combination produces the right Azure resource. Keep those cases, but add positive contract assertions and checks for useful outputs. The consumer example also needs to exercise the supported interface.

**Martin:** First make the tests safe to run. In the inherited root, the mocks cover two providers, while another loaded file brings in Kubernetes and an authentication path. A plan-mode test doesn't magically isolate every provider. Review all configuration that Terraform loads, separate application resources, and verify the mocks before running the suite.

**Haflidi:** Then test the test. A deliberate small mutation should make the intended assertion fail. Change the contract under controlled conditions, retain the failure, restore the implementation, and rerun the same check. Label that mutation as deliberate. It proves the assertion can detect that particular defect, not that every possible deployment problem is covered. Check the failure reason too; a syntax error would not validate the intended contract assertion.

**Martin:** The useful repair loop preserves the requirement. We don't loosen a condition because the implementation finds it inconvenient. We ask whether the test, the implementation, or the original assumption is wrong, and we use the source to decide. Haflidi, take playback control for the failure and review sequence.

## demo-c5 | 30:00-35:00 | C5: Catch a mistake and repair it

> DRIVER Haflidi. C5, 05:00. Capture actual command/exit, failing assertion or structural error, `/review`, assigned repair, `/diff`, and identical check rerun. Ordinary test repair is not formal Squad rejection. If formal rejection occurs, use a different independent revision author under the coordinator protocol. Use about 50 seconds for reading. A passing expected-failure test is not this failure. Hand playback control back to Martin at 35:00. Tip: preserve cause and effect.

**Haflidi:** Begin with the command and exit status, not the summary. A real nonzero result tells us the check did not pass. Read enough context to identify what it actually rejected. A structural Terraform error, an assertion failure, and a cloud permission error are different problems. We should not narrate one as another just because all three are red on screen.

**Martin:** For the inherited source, we already know there are root-boundary defects and a SKU documentation mismatch. Those are useful starting facts. If a new implementation introduces a different problem, label it as new. If the demonstration uses a controlled mutation, label it as seeded before showing the result. None of those labels diminishes the lesson. They make the evidence honest.

**Haflidi:** Review connects the finding to a file, requirement, and check. Squad names the next owner. Ordinary test repair isn't formal rejection. If the designated reviewer formally rejects an artifact, a different independent author must revise it; the rejected author doesn't produce or advise on that revision. This is coordination protocol, not a filesystem lock or merge approval. Preserve the actual failure and repair.

**Martin:** The implementation response should be narrow enough to explain. If the problem is overlapping roots, separate their responsibilities and keep provider configuration in the correct place. If the generated resource violates the supported contract, correct that contract. Don't hide an output error behind an unexplained null or remove a test because it exposes work we haven't finished.

**Haflidi:** Keep the interface stable unless the evidence requires a real design change. If it does, return to the planning decision and tell the test and documentation owners. Quietly renaming inputs while everyone else works against the old interface creates a second defect. The human can approve a revised boundary, but the recording should retain that decision.

**Martin:** Now compare the repair diff with the finding. We want to see that the change addresses the cause, not just the visible symptom. The same targeted command runs again. Then the preserved negative cases and other relevant checks run as well. A green targeted assertion can coexist with a regression somewhere else, so the complete result needs both.

**Martin:** Record the tool and provider selections with those results. If a dependency changed during the repair, disclose that change and review its effect. Otherwise two similar command lines may be checking different configurations without the viewer knowing.

**Haflidi:** Leave the actual outcome on screen long enough to read. If a rerun still fails, keep it and continue the investigation. Editing out waiting is fine when the cut is labeled. Editing a failed attempt into first-try success is not. The value of a recorded workflow is that people can follow the correction, including the human intervention.

**Martin:** Our tip is to hand over the repair diff together with the unchanged check and its real output. That gives the reviewer a concrete basis for acceptance. It still doesn't establish Azure deployability. Haflidi, I'll take the controls back while we separate the evidence levels and the claims each can support.

## s15-proof | 35:00-39:00 | Evidence has levels

> DRIVER Martin. No clip. Read actual status labels from the evidence register. Never announce a pending gate as passed. Pause about 20 seconds across the rows. Haflidi leads interpretation; Martin leads handoff. Tip: a check proves only what it checks.

**Haflidi:** This slide separates five kinds of evidence. The first is source inspection. We can describe inherited files, known declarations, and observed local diagnostics. The second is module checks. The third is a runnable consumer example. Then come a real resource plan and Azure read-back. The labels beside those rows describe the current package; they are not a progress animation.

**Martin:** Formatting checks presentation of configuration. Validation checks Terraform's structure and provider-facing consistency. Lint checks particular rules. Tests assert what their authors wrote. These checks complement one another, but they aren't substitutes. A nicely formatted module can ask for the wrong resource. A positive assertion can ignore an important input. A mock can miss service behavior.

**Haflidi:** The consumer example matters because reuse is a claim about another person's starting point. Can they see which values are required? Does the root configure the intended providers and own its state? Does it consume existing network resources without importing or recreating the landing zone? Can it explain expected outputs without exposing credentials? That is more useful than a module directory that only its author knows how to call.

**Haflidi:** Treat missing evidence as a named next action, not an ambiguous warning. The person receiving the module should know which check remains, who can authorize it, and what result would close that particular gate.

**Martin:** A real Terraform plan adds environment-specific evidence, but it still isn't an apply. With detailed exit codes, zero means no changes, two means proposed changes, and one means an error. Read the actual actions, target scope, and saved-plan identity. Keep the raw plan private when it contains environment data. The public slide can show a reviewed, sanitized summary without publishing the state or identifiers.

**Haflidi:** Approval needs to precede the operation it authorizes. Applying a saved plan doesn't provide another interactive decision point. We also need to account for resources created by the service and controls owned by the platform. A checked-in policy assignment isn't proof of the effective live policy, an exemption, or compliance after deployment.

**Martin:** Only separately authorized deployment and read-back can establish the behavior that actually occurred in Azure. Private API access, DNS resolution, routes, identity, and policy results are distinct observations. If those are pending, say so. The module can still be useful work without pretending every environment gate has closed.

**Haflidi:** Hooks are worth knowing about as an additional CLI integration point for defined checks. We aren't claiming a configured enforcement hook here. A persuasive plan, several agreeing agents, or a hook name doesn't change what the evidence shows. Keep the proof next to the claim, and make an incomplete result easy for the next engineer to find.

## s16-continuity | 39:00-40:00 | Save the reason, not just the chat

> DRIVER Martin. No clip. Trace the decision into the next task. Pause five seconds. Handoff to Haflidi for C6. Tip: record why the boundary exists.

**Martin:** A later task needs to know why we chose this boundary. Private Corp consumption, existing network ownership, and separate application resources should survive beyond the conversation that introduced them. A short decision with its reason and source is more useful than a pasted transcript. Keep the decision close to the files whose behavior it constrains.

**Haflidi:** Scribe helps the Squad record that repository knowledge. The record still needs review, and the next task must actually read it. Native session resume brings back a conversation. It doesn't automatically prove that an agent recovered the repository's current decisions. We'll show both sides of that continuity, then inspect context and usage before starting more work.

## demo-c6 | 40:00-43:00 | C6: Resume with decisions intact

> DRIVER Martin. C6, 03:00. Show Scribe's actual record, `/resume`, a visible read/reference to that record, `/context`, and `/usage`. Allow about 30 seconds for observation. Do not display personal memory or unrelated sessions. Handoff to Martin at 43:00. Tip: confirm that the reason reached the resumed task.

**Haflidi:** Look first at what was saved. A useful decision identifies the accepted module boundary, the reason for private-network consumption, and the unresolved environment prerequisites. It doesn't need every sentence from the original conversation. The owning agent's history can add a short lesson, while the shared decision remains the common reference for the team.

**Martin:** Resume is a native CLI capability. We use it to return to the relevant session, not to browse unrelated conversations on a public screen. Confirm the working directory and active task. Then ask a concrete continuity question: which accepted constraints govern the next change, and which file records them?

**Haflidi:** The visible read or reference matters. A plausible answer might come from remaining conversation context rather than the file. We want evidence that the record created during this work becomes an input to the next task. If it is stale or incomplete, correct it openly before implementation continues.

**Martin:** Inspect the reported context and usage before another fan-out. Parent and subagents share credit accounting, and compaction can consume credits too. Limits are soft because accounting follows a response. Use those controls to make bounded decisions, not as a hard spending guarantee. Ask which unanswered question justifies the next task.

**Haflidi:** Model choice also belongs in the record. Keep it fixed for the comparison chapter; choose deliberately for later bounded tasks. We don't need a model ranking to make this useful. What matters is being able to explain the selected tool, the available context, and the reason for asking it to do another piece of work.

**Martin:** This is a modest continuity promise: the next task can recover a reviewed reason and use it. It is not perfect memory. That's why we keep important decisions in versioned repository artifacts and verify their use, rather than trusting a long chat to carry every requirement indefinitely.

## s18-memory | 43:00-45:00 | Three places to keep context

> DRIVER Martin. No clip. Keep personal memory closed. Allow ten seconds to read the comparison. Handoff to Haflidi for C7. Tip: separate CLI compaction from team-state hygiene.

**Martin:** There are three different mechanisms worth separating. Conversation context helps the current session continue its work. Native memory can retain useful facts, but we won't display personal memory contents. Squad's decisions and histories are repository-backed team knowledge. They have different owners and different review needs.

**Haflidi:** Compaction summarizes conversation context; it doesn't maintain Squad's decision ledger. Before reducing context, save the accepted module boundary, source, and unresolved prerequisite. After resuming, verify that the next owner read the relevant record. Don't quietly change the team state between comparison runs. Repository knowledge has its own review lifecycle, with maintenance references in the appendix. The contract should remain small enough for a human to inspect.

**Martin:** The rule I use is to put a requirement where the next owner can find and review it. The public module's contract belongs with the code and documentation. Private environment mapping stays in the environment's controlled location. A decision can link to a public requirement without copying private account details into a team history.

**Haflidi:** A reviewed testing recipe is useful portable knowledge. Retain the defect it detects, the evidence, and the limits, so another task can reuse the method. That is earned guidance, not model retraining. Keep the public lesson separate from private inputs and unrelated conversations. We can now review the consumer-facing change without reopening every earlier discussion.

## demo-c7 | 45:00-48:00 | C7: Reviewed diff to approved Terraform change

> DRIVER Martin. C7, 03:00. Show `/diff` for module/consumer changes, checks, actual resource plan if approved evidence exists, and the human decision. Reserve about 35 seconds for inspection. Azure read-back remains pending unless real evidence is supplied. No apply on stage. Handoff to Martin at 48:00. Tip: approve a specific artifact and scope.

**Haflidi:** Review the change as a consumer would. The module should have a defined input and output contract. The example root should show how to configure providers, own its backend, and supply approved network inputs. The documentation should identify prerequisites rather than bury them in a command that only works in the author's environment.

**Martin:** The diff should also make extraction visible. Which resources moved into the reusable module? Which provider and application concerns stayed outside it? Which tests and instructions changed with the interface? We need that context to avoid presenting all inherited infrastructure as newly generated code.

**Haflidi:** Next, compare the real check results with the accepted requirements. If a real resource plan is available, inspect the intended fresh workload resources and the target boundary. No estate imports, scope moves, or policy exceptions become acceptable because they're convenient for the recording. Keep private values out of the public evidence.

**Martin:** The human decision must name what is approved. A reviewed code change can be accepted while deployment remains blocked on environment prerequisites. A separately approved plan applies only to its exact artifact and scope. The clip title doesn't imply that an Azure deployment happened.

**Haflidi:** After an authorized deployment, read-back would need to establish the private-cluster behavior and relevant platform results. Until that evidence exists, it stays pending. There is no reason to replace a missing result with a green badge. The useful outcome here is a change whose code, checks, consumption path, and remaining decisions another engineer can inspect.

**Martin:** Our final handoff is the module revision, the example, the meaningful checks, and the unresolved gates. That is a much stronger starting point for reuse than a chat transcript saying the work is done.

## s20-consumer | 48:00-50:00 | Reuse the code, not the environment

> DRIVER Martin. No clip. Point from the consumer root into the module, then to private configuration. Pause ten seconds. Handoff to Haflidi for operating rules. Tip: version the module separately from environment inputs.

**Martin:** The public session material includes the reusable module and a sanitized consumption example. The same module tree is intended for its own repository so consumers can pin a reviewed revision independently of the slide deck. Publication and release claims need their own verification. Don't guess a version tag because the example would look cleaner with one.

**Haflidi:** In an existing landing zone, the consumer supplies the approved scope and network contract. It owns backend configuration and authentication. The module doesn't need to know an organization's private topology to describe its requirements. The public example should teach that boundary using generic values, with no state, secrets, or real environment inputs alongside it.

**Martin:** Keep infrastructure and application delivery separate. A Kubernetes application root may need cluster access and its own lifecycle. That isn't a reason to pull live cluster authentication into a mocked infrastructure test. Separate roots let us explain who owns each operation and which check can run without reaching a live service. That separation also makes the public example easier to review and maintain.

**Haflidi:** Before calling the module reusable, verify the example from a clean starting point. Check the interface, outputs, dependencies, and documented prerequisites. Then assess the actual environment separately. Reuse saves repeated implementation work; it doesn't remove the platform owner's responsibility for the network, identity, policy, and state decisions around it.

## s21-limits | 50:00-53:00 | Make the next change easier to review

> DRIVER Martin. No clip. Hold the three operating rules without extra fragments. Allow about 15 seconds for reflection and the Q&A transition. Haflidi closes the content; Martin opens the floor at 53:00. Tip: keep the artifact, the reason, and the check together.

**Haflidi:** The useful habits fit a normal engineering day. Start native Plan mode when the change has decisions worth resolving before edits. Attach the files and instructions that matter. Ask for the smallest module boundary that satisfies the consumer, the behavior that must remain unchanged, and the checks that will tell you whether the change worked.

**Martin:** Use Squad when the work benefits from named ownership and handoffs. Keep independent tasks independent. Keep one writer on a shared Terraform surface. Let the reviewer return an exact finding and let Scribe retain the reason for an accepted decision. More agents cannot vote a resource contract into correctness.

**Haflidi:** Use skills for repeatable procedures and MCP for a specific source or tool. Read the result and preserve its provenance. Approve the narrow action that is needed. A Markdown plan describes intended work; it isn't a permissions system. A role describes responsibility; it isn't isolation from the filesystem or cloud.

**Martin:** Check the diff and the tests, then check what they actually establish. Local validation, isolated contract tests, a consumer example, a real plan, and Azure read-back answer different questions. Keep pending gates visible. Don't replace the private-network requirement with a public default just to make the demonstration end neatly.

**Haflidi:** Recordings let us spend the room's time on decisions instead of waiting for another agent response. Keep the genuine sequence, label cuts, and preserve meaningful mistakes. On stage, we can pause at the point where a human changes the outcome. That is why the clip controls and readable evidence matter more than a fast edit.

**Martin:** The public code is the reusable part. Your environment inputs, state, and secrets are not conference material. Take the working pattern back to one bounded change in your own repository. If the next engineer can find the contract, run the relevant check, and understand the handoff, the tools have done useful work.

**Haflidi:** We'll stop the content here and keep the full seven minutes for questions.

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

> Reference only. Squad `status`, `doctor`, and `health` concern setup, not Terraform correctness. Installed doctor help and reference exit-code claims differ; detailed health help was unavailable. Read actual diagnostics and exit status. Back up before `import`; `export`/`import` help doesn't prove round-trip fidelity or safe overwrites. `nap --dry-run` previews team-state hygiene, unlike CLI `/compact`. `cost` depends on logs. Ralph triage can mutate labels without `--execute`; documented runners may inject broad permission flags. No watcher runs here.

> Reviewed current and stable Squad templates use `.github\skills` for bundled playbooks and `.squad\skills` for earned knowledge. Project `.copilot\skills` is legacy despite stale feature-page prose. Review the evidence and limits of learned recipes; expose native CLI skills through supported discovery locations. Current coordinator routing favors one accountable owner with bounded contributors, not guaranteed eager fan-out.

## a-evidence | Appendix | Know which gate you are reading

> Reference only. Keep the full upstream source pin, reviewed module revision, and exact check evidence with the release. For a detailed Terraform plan, exit codes are 0 for unchanged, 2 for proposed changes, and 1 for error. Private scope, state, network compatibility, policy evaluation, and authorized read-back remain separate gates.
