# Which repository to clone, read, and change

Audience: presenters, contributors, and demo operators. Purpose: choose the correct source and deployment boundary without treating the public session clone as a live environment.

Public GitHub metadata was read on October 12, 2026; the October 13 owned fork is added below. Linked source repositories are public. This confirms their identity and visibility, not current collaborator rights or a running service.

| Repository | Owns | Operator instruction |
| --- | --- | --- |
| [martinopedal/squad-terraform-session-2026-10-14](https://github.com/martinopedal/squad-terraform-session-2026-10-14) | Deck, notes, session setup, generic Corp module copy, and native teaching profiles | Clone this for presenting and C1-C7. Change presentation source in `presentation\src` and the talk docs; regenerate HTML with the existing build. It is **not the live environment deployment entry**. |
| [martinopedal/aks-automatic-demo-env](https://github.com/martinopedal/aks-automatic-demo-env) | Live Online AKS/demo-VM consumer roots, manifests, operator scripts, and gated workflows | Clone this for the live AKS consumer and VM operator procedure. Read its operations runbook before any approved deployment. It pins the upstream Automatic module at `v0.6.0`; public clone access is not deployment authorization. |
| [martinopedal/terraform-azapi-aks-automatic](https://github.com/martinopedal/terraform-azapi-aks-automatic) | Upstream reusable Automatic module consumed by demo-env | Read/change the canonical reusable Automatic contract here. Do not add environment roots or live secrets to the module. |
| [alz-avm-tf-demo/terraform-azapi-aks-automatic-corp](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp) | Independently reusable **public** Corp module | Clone/read/change the canonical Corp teaching module here. The local `module-public` checkout maps to this repository. The session copy at `terraform\modules\aks-automatic-corp` is not an independent deployment root. |
| [haflidif/squad-on-aca](https://github.com/haflidif/squad-on-aca) | Haflidi's authored hosted Squad implementation for ACA Jobs | Read this implementation for the optional hosted lane. It is not the customer-managed MicroVM resource contract and is not the issue/queue target. Provisioning, credentials, and actual runtime acceptance remain separately gated. |
| [martinopedal/squad-on-aca](https://github.com/martinopedal/squad-on-aca) | Owned MIT fork with @haflidif credit/license preserved | [PR1](https://github.com/martinopedal/squad-on-aca/pull/1) source accepted at `411bbf1810799bbfeea176e0c4123504a05430e8`, 71 tests and actual Linux image/UID/protected-publication CI SUCCESS; normal merge `623c1906c1b8cacd13ccd1890d3d77ad3241560` preserves tree parity. Source acceptance is not deployment/E2E. The existing owner-native Terraform remains the sole whole-body infrastructure writer; do not deploy standalone fork Bicep as a second writer. |

## Copy versus canonical source

The session's copied Corp teaching module and its unchanged [manifest](../terraform/module-source.json) bind public Corp module commit `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`, tree `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8`. The live demo consumer instead pins the different upstream Automatic module at `v0.6.0`. Neither pin replaces the other. Change canonical module source first through its reviewed release process; mirror only the accepted revision and refresh the manifest through its separate owner. A C1-C7 checkpoint edit is a teaching change, not an automatic module release.

## Private deployment and target boundaries

Haflidi's original hosted implementation is completed/previously demonstrated;
leave it unchanged. The new personal target/rehearsal status is separate and
must not be read as missing original implementation or a native Sandbox gate.
Fresh current **SQUAD ON ACA APPS/JOBS** issue -> Job/agent -> PR qualification
is pending; both independent demos need their own proof. Corrected **ACA
SANDBOXES** host/MicroVM success does not establish that hosted chain.

The intended private hosted target, `<approved-private-target>`, receives issues, queue workflow activity, and bot PRs. It is **a target, not the hosted service implementation repository**. Public docs alone cannot run that private issue-to-workflow-to-job-to-bot-PR chain. Owned fork/target source is accepted/merged; target checker still reports runtimeProven false. Chosen mode is private scheduled poller -> one approved issue -> existing queue -> genuine Squad UID10001 worker -> trusted README App-bot PR; no new runner registration or AppAdmin. Credential-free manual status is source-prepared, not a trigger or runtime proof.

Private publisher source is accepted/merged, but actual Docker/DNS/TLS qualification
is waiting at the existing human gate with zero executed steps. Owner-native
Terraform/full source QA/real plan, immutable image, authentication and genuine bot
PR remain pending. Leave the old zero-step queued run untouched; it is neither
cancelled nor proof of success. Original Haflidi service remains working/unchanged.
Owner-native source preparation is under review; executable delivery remains
held. Plan/apply/destroy are unconditionally disabled; signer/current-head/
private-plan transport/executable integration are not provisioned, not just
operator-receipt holds or deploy-on-merge.

Real environment values, tenant/subscription/resource identifiers, credentials, backend/state, saved plans, exact approvals, and private diagnostics belong at the private deployment boundary. Use aliases such as `<approved-subscription>`, `<approved-resource-group>`, and `<approved-sandbox-group>` in public examples. A public consumer can own generic wiring without publishing those values.

The private coordinator root, state, and worktrees are neither public documentation nor deployment/source truth. Start the presenter CLI in this session clone or its disclosed checkpoint, not the coordinator folder. Do not copy private histories or settings.

## Current placement decision

Online is **primary placement for eligible demo components**, not a fallback or
policy escape. Corp-required private workloads remain Corp. Public/private
GitHub repo visibility does not determine network placement, ingress or
control-plane exposure. AKS has a public demo app; native SandboxGroup access
still requires the approved authenticated scope and may remain private.

The existing Online placement is primary for a **separate native ACA SandboxGroup and resource group**. The five-object deployment and credential-free base probe were independently verified October 12, including current exact-group access and an empty cleanup list. It does not run inside AKS and is not Haflidi's hosted Squad Jobs/runner. Standard managed networking is not a transplant of Corp BYO VNet/UAMI/FIC wiring. Leave Corp resources untouched. The held Corp qualification was blocked on an unexpected change-type check; no apply performed in that qualification. This is not a proven Corp policy restriction or a claim that changing placement fixes policy.

Online describes placement, not anonymous MicroVM ingress or permission to expose credentials, change Corp networking, relocate resources, or redeploy a healthy AKS cluster. Use the [official ACA CLI quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli), [progress matrix](sandboxing.md#october-12-progress-and-next-actions) and [runtime coverage checklist](aca-sandboxes.md#full-test-coverage-checklist) before any demo GO decision. Basic provisioning/access/probe acceptance is not full host Copilot/Squad integration, both-presenter readiness or rehearsal GO.

Native source is in the same demo-env consumer at
`deployments\aca-sandboxes-online` and a separate sandbox-only workflow protected
by `online`. The independently verified graph is RG + SandboxGroup + two group Data Owner
grants + one RG Contributor grant for the existing consumer actor. The approved
one-time Owner bootstrap and current readbacks are separate from the public
source PR's still-pending human review; they are not a claim that GitHub merged
or executed that source lane. It does not change
Corp, AKS or hosted Jobs. Existing AKS source stays `deployments\online` and
`deploy-online.yml`; hosted Jobs deployment stays at its private protected
boundary. A source folder/workflow is not authority for another apply.

Keep four demo lanes independent: existing Online AKS consumer; native ACA SandboxGroup MicroVMs; hosted Squad ACA Jobs issue-to-PR; local Copilot sandbox. GitHub-managed `--cloud` is an additional optional account/runtime lane, not another name for any of these.
