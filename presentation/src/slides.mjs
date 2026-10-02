import { hero, layers, corp, memory, consumption } from './diagrams.mjs';

export const title = 'From prompt to reusable Terraform: Copilot CLI and Squad';
export const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const code = (value, label, language = 'hcl') => `<div class="code-panel"><p class="code-label">${escape(label)}</p><pre><code class="language-${language}">${escape(value)}</code></pre></div>`;
const fig = value => `<figure class="figure-svg">${value}</figure>`;
const source = (label, url) => ({ label, url });
const cli = source('Copilot CLI', 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli');
const squad = source('Squad source', 'https://github.com/bradygaster/squad/tree/93aec83accb44e08c39e4a799f13b55208215a13');
const upstream = source('Pinned public source', 'https://github.com/martinopedal/terraform-azapi-aks-automatic/tree/e9a9a481b9b5bf3a4af8046cb602895c89a9ac24');
const automatic = source('Private Automatic guidance', 'https://learn.microsoft.com/en-us/azure/aks/automatic/quick-automatic-private-custom-network');
const tests = source('Terraform tests', 'https://developer.hashicorp.com/terraform/language/tests');
const tfplan = source('Terraform plan', 'https://developer.hashicorp.com/terraform/cli/commands/plan');
const guide = source('Feature guide', '../docs/feature-guide.md');
const small = text => `<p class="supporting">${text}</p>`;
const row = (label, text, detail = '') => `<div class="reference-row"><div><h3>${label}</h3>${detail ? small(detail) : ''}</div><p>${text}</p></div>`;

const chapter = (number, duration, time, chapterTitle, layer, points, tip, sources) => ({
  id: `demo-c${number}`, title: chapterTitle, time, layer, kind: 'demo',
  chapter: `C${number}`, duration, points, tip, sources,
  treatment: 'SHOW target / footage pending'
});

export const slides = [
  {
    id: 's01-outcome', title: 'A module worth reusing.', time: '00:00-01:00',
    layer: 'Copilot CLI / Squad / Terraform', kind: 'hero',
    tip: 'Define the useful artifact before choosing agents.', sources: [cli, squad],
    content: `<div class="hero-copy"><p class="hero-lede">Copilot CLI and Squad,<br>working together.</p>
      <p class="hero-description">Existing code. A reusable module.<br>A private Azure landing-zone consumer.</p>
      <div class="speakers"><span>Martin</span><span class="speaker-separator" aria-hidden="true"></span><span>Haflidi</span></div>
      <p class="session-meta">October 14, 2026 / 10:00-11:00 / Room 6</p></div>
      <div class="hero-art">${fig(hero())}<p class="diagram-caption">The intended boundary, not deployment evidence.</p></div>`
  },
  chapter(1, 180, '01:00-04:00', 'Same task, different agent choices', 'Native Copilot CLI',
    ['Same brief and reviewed starting state', 'Selected model and effective context', 'One decision and its consequence'],
    'Hold inputs fixed. Equal results are valid.', [cli]),
  {
    id: 's03-baseline', title: 'Start with the code you have.', time: '04:00-05:00',
    layer: 'Terraform / source evidence', kind: 'baseline', sources: [upstream],
    tip: 'Disclose the source, qualified reference, clean checkpoint, and recorded change.',
    content: `<div class="baseline-facts"><div class="source-pin"><span class="eyebrow">Inherited public source</span><strong>e9a9a48</strong></div>
      <div class="stat"><strong>10</strong><span>existing negative test cases<br><em>Not a passing test claim.</em></span></div>
      <p class="supporting">Root declarations overlap.<br>An active provider sits outside the mocks.</p></div>
      <div>${code('sku = {\n  name = "Base"\n  tier = "Standard"\n}', 'Inherited resource excerpt')}
      <p class="code-caption">Inherited mismatch, not AI-attributed.<br>Qualify first; disclose the later clean run.</p></div>`
  },
  {
    id: 's04-layers', title: 'One workflow. Three distinct layers.', time: '05:00-08:00',
    layer: 'Native CLI / Squad / external tools', kind: 'diagram', sources: [cli, squad],
    tip: 'Name the layer before troubleshooting the behavior.',
    content: fig(layers())
  },
  {
    id: 's05-parallel', title: 'Give parallel work separate owners.', time: '08:00-10:00',
    layer: 'Native subagents / Squad routing', kind: 'ownership', sources: [cli, squad],
    tip: 'One writer per shared Terraform surface. Every task has a stop condition.',
    content: `<div role="table" aria-label="Artifact ownership and handoffs"><div class="lane-header" role="row"><span role="columnheader">Owner</span><span role="columnheader">Artifact</span><span role="columnheader">Handoff</span></div>
      <div class="lane" role="row"><strong role="rowheader">Module writer</strong><span role="cell">Infrastructure and interface</span><span role="cell">Diff and contract</span></div>
      <div class="lane" role="row"><strong role="rowheader">Test author</strong><span role="cell">Isolated contract cases</span><span role="cell">Commands and results</span></div>
      <div class="lane" role="row"><strong role="rowheader">Docs writer</strong><span role="cell">Consumption example</span><span role="cell">Inputs and prerequisites</span></div>
      <div class="lane" role="row"><strong role="rowheader">Reviewer</strong><span role="cell">Read-only inspection</span><span role="cell">Finding and next owner</span></div></div>
      <p class="ownership-note">CLI supplies subagents and <code>/fleet</code>. Squad adds roles and routing.<br>The lead integrates; Scribe records decisions.</p>`
  },
  {
    id: 's06-contract', title: 'Fit the platform you already have.', time: '10:00-12:00',
    layer: 'Terraform / Azure contract', kind: 'diagram', sources: [automatic],
    tip: 'Consume approved network inputs. Do not rebuild or import the landing zone.',
    content: `${fig(corp())}<p class="status-line"><span class="status pending">Environment gate pending</span>Live policy, compatibility, and deployment need separate evidence.</p>`
  },
  chapter(2, 240, '12:00-16:00', 'Pin the brief and approve a plan', 'Native Plan mode / Squad',
    ['Actual Plan indicator and explicit file context', 'Plan artifact, proposed scope, and human revision', 'Approval, then visible implementation mode'],
    'Inspect the real Plan indicator and artifact before approving implementation.', [cli, guide]),
  {
    id: 's08-plan-boundary', title: 'Extract a module, not an environment.', time: '16:00-18:00',
    layer: 'Terraform / module boundary', kind: 'boundary', sources: [upstream, tests],
    tip: 'Make ownership testable before moving resources.',
    content: `<div class="boundary-panel public"><p class="eyebrow">Reusable module</p><h3>Own the infrastructure contract.</h3>
      <ul><li>Typed inputs and useful outputs</li><li>Provider requirements</li><li>Isolated resource assertions</li></ul></div>
      <div class="boundary-panel"><p class="eyebrow">Consumer and application roots</p><h3>Keep environment ownership outside.</h3>
      <ul><li>Provider configuration and backend</li><li>Private inputs and authentication</li><li>Separate Kubernetes resources</li></ul></div>
      <p class="boundary-warning fragment" data-fragment-index="0">Fresh workload only. Existing state migration needs a separate review.</p>`
  },
  chapter(3, 240, '18:00-22:00', 'Activate Squad and route independent work', 'Native custom agents / Squad',
    ['Selected agent, roster, charters, and routing', 'Actual task starts and owned file edits', 'A concrete result and a named handoff'],
    'Pass essential constraints explicitly. A role assignment is not completed work.', [cli, squad, guide]),
  {
    id: 's10-tool-roles', title: 'Give context the right job.', time: '22:00-23:00',
    layer: 'Native Copilot CLI / external tools', kind: 'context', sources: [cli],
    tip: 'A recipe, repository rule, and external fact are different inputs.',
    content: `<div class="context-column"><span class="large-index">01</span><h3>Instructions</h3><p>Persistent repository expectations.</p><code>@file /instructions</code></div>
      <div class="context-column"><span class="large-index">02</span><h3>Skills</h3><p>A focused procedure, invoked when useful.</p><code>/skills</code></div>
      <div class="context-column"><span class="large-index">03</span><h3>MCP</h3><p>Tools and information beyond the conversation.</p><code>/mcp</code></div>`
  },
  chapter(4, 240, '23:00-27:00', 'Ground the work with tools', 'Native skills / MCP / permissions',
    ['A skill invocation that affects the work', 'An authoritative source and relevant version', 'One narrow, visible permission decision'],
    'Tool availability and approval are separate controls.', [cli, automatic, guide]),
  {
    id: 's12-source-check', title: 'Turn the source into an assertion.', time: '27:00-28:00',
    layer: 'External source / Terraform tests', kind: 'assertion', sources: [upstream, tests],
    tip: 'Assert the generated resource, not the name of an input.',
    content: `<div class="assertion-source"><p class="eyebrow">Source claim</p><h3>Automatic is a resource contract.</h3>
      <p class="fragment" data-fragment-index="0">Choose the supported SKU, private API, and system-pool behavior.</p></div>
      <div class="fragment" data-fragment-index="1">${code('condition = (\n  azapi_resource.aks.body.sku.name == "Automatic"\n)', 'Illustrative assertion, not test output')}
      <p class="code-caption">The real case must match the reviewed module.</p></div>`
  },
  {
    id: 's13-test-gap', title: 'Test both sides of the boundary.', time: '28:00-30:00',
    layer: 'Terraform / test design', kind: 'test-design', sources: [tests],
    tip: 'Enumerate every loaded provider before calling a test isolated.',
    content: `<div class="test-pair"><div><p class="eyebrow">Negative cases</p><h3>Reject incompatible inputs.</h3><p>Preserve meaningful validation and precondition coverage.</p></div>
      <div><p class="eyebrow">Positive cases</p><h3>Inspect the resource and outputs.</h3><p>Check the supported private-network contract and consumer interface.</p></div></div>
      <div class="mutation-strip"><strong>Test the test.</strong><span>Deliberate mutation</span><span>Intended failure</span><span>Restore and rerun</span></div>`
  },
  chapter(5, 300, '30:00-35:00', 'Catch a mistake and repair it', 'Native review / Squad handoff / Terraform',
    ['A real command and nonzero result', 'A finding, owner, and focused repair diff', 'The same check rerun, with criteria intact'],
    'Ordinary test repair is not formal rejection. Preserve the actual repair evidence.', [cli, tests, guide]),
  {
    id: 's15-proof', title: 'Evidence has levels.', time: '35:00-39:00',
    layer: 'Source / local checks / Azure', kind: 'evidence', sources: [tests, tfplan],
    tip: 'A check proves only what it checks. Pending gates stay visible.',
    content: '',
    treatment: 'Current evidence register'
  },
  {
    id: 's16-continuity', title: 'Save the reason, not just the chat.', time: '39:00-40:00',
    layer: 'Native resume / Squad knowledge', kind: 'diagram', sources: [cli, squad],
    tip: 'Keep the accepted boundary and its reason close to the code.',
    content: `${fig(memory())}<p class="large-note">A saved conversation and a repository decision are different artifacts.</p>`
  },
  chapter(6, 180, '40:00-43:00', 'Resume with decisions intact', 'Native session controls / Squad Scribe',
    ['The actual decision record created in this work', 'A resumed task that reads the record', 'Context, usage, and deliberate model choice'],
    'Verify that the reason reached the resumed task.', [cli, squad, guide]),
  {
    id: 's18-memory', title: 'Three places to keep context.', time: '43:00-45:00',
    layer: 'Native CLI / Squad', kind: 'reference', sources: [cli, squad],
    tip: 'CLI compaction and team-state hygiene solve different problems.',
    content: `${row('Conversation', 'Resume the relevant task. Inspect context and usage.', '<code>/resume /context /usage /compact</code>')}
      ${row('Native memory', 'Manage remembered facts. Keep personal contents off screen.', '<code>/memory</code>')}
      ${row('Repository knowledge', 'Review decisions, histories, and learned testing recipes.', 'Squad / Scribe / reviewed evidence')}`
  },
  chapter(7, 180, '45:00-48:00', 'Reviewed diff to approved Terraform change', 'Native diff / Squad / Terraform',
    ['Module extraction and the consumer-facing diff', 'Meaningful checks and the exact approval', 'Real plan and read-back only when evidence exists'],
    'Approve a specific artifact and scope, not a hopeful summary.', [cli, tfplan]),
  {
    id: 's20-consumer', title: 'Reuse the code, not the environment.', time: '48:00-50:00',
    layer: 'Public Terraform / private consumption', kind: 'diagram', sources: [tests, automatic],
    tip: 'Pin the reviewed module revision separately from environment inputs.',
    content: `${fig(consumption())}<p class="status-line"><span class="status pending">Consumer validation pending</span>Public code stays separate from private inputs, state, and secrets.</p>`
  },
  {
    id: 's21-limits', title: 'Make the next change easier to review.', time: '50:00-53:00',
    layer: 'Copilot CLI / Squad / engineering practice', kind: 'closing', sources: [cli, squad],
    tip: 'Keep the artifact, the reason, and the check together.',
    content: `<div class="closing-line"><span>01</span><p><strong>Bound the work.</strong><br>Plan, context, ownership, and stop conditions.</p></div>
      <div class="closing-line"><span>02</span><p><strong>Inspect what changed.</strong><br>Source, diff, tests, and human review.</p></div>
      <div class="closing-line"><span>03</span><p><strong>Leave a useful handoff.</strong><br>Module, consumer example, decisions, and open gates.</p></div>
      <p class="closing-statement">More agents cannot vote a contract into correctness.</p>`
  },
  {
    id: 's22-questions', title: 'Which part would you inspect?', time: '53:00-60:00',
    layer: 'Questions / seven minutes', kind: 'questions', sources: [guide],
    tip: 'Martin and Haflidi / prepared Q&A fallback is in the speaker notes.',
    content: `<p class="questions-lede">Your repository. One bounded change.</p>
      <div class="appendix-links">
      <a href="#/a-cli-controls"><span>01</span>Branch and recover</a>
      <a href="#/a-automation"><span>02</span>Bounded automation</a>
      <a href="#/a-handoffs"><span>03</span>Local or cloud work</a>
      <a href="#/a-integrations"><span>04</span>Editor and tool context</a>
      <a href="#/a-squad-ops"><span>05</span>Squad operations</a>
      <a href="#/a-evidence"><span>06</span>Evidence and prerequisites</a></div>`
  },
  {
    id: 'a-cli-controls', title: 'Branch and recover deliberately.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'A worktree separates files, not credentials. Rewind is not Azure rollback.',
    content: `${row('Explore an alternative', '<code>/fork</code> carries context.<br><code>/worktree</code> separates working files.')}
      ${row('Recover CLI work', '<code>/rewind</code><br>Inspect the resulting diff.')}
      ${row('Return to the task', '<code>/resume</code><br>Select the relevant session, not unrelated history.')}`
  },
  {
    id: 'a-automation', title: 'Automate bounded work.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'Keep the objective, permissions, and stopping point explicit.',
    content: `${row('Finish a finite task', '<code>/autopilot /limits</code><br>Soft credit limits, not financial or safety guarantees.')}
      ${row('Script a prompt', '<code>-p / --prompt</code><br>Programmatic work, not the interactive Plan-mode demo.')}
      ${row('Split independent work', '<code>/fleet /subagents</code><br>Give each task an artifact and owner.')}`
  },
  {
    id: 'a-handoffs', title: 'Choose where the work happens.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'Reference only. Cloud delegation and local-session steering are different operations.',
    content: `${row('Work locally', 'Use the local repository, review its diff, and retain ownership.')}
      ${row('Hand off a PR task', '<code>/delegate</code><br>Cloud-agent draft PR; review the resulting diff.')}
      ${row('Control a session remotely', '<code>/remote</code><br>Steer the running local session. Its host stays online.')}`
  },
  {
    id: 'a-integrations', title: 'Add the context you need.', time: 'Appendix',
    layer: 'Native Copilot CLI / external integrations', kind: 'reference', sources: [cli, guide],
    tip: 'Availability is not setup evidence. Review tools and sources before use.',
    content: `${row('Editor and code context', '<code>/ide /lsp</code><br>Useful with a configured editor or language service.')}
      ${row('Packaged capabilities', '<code>/plugin</code><br>Review trust, permissions, and dependencies.')}
      ${row('Investigate or challenge a claim', '<code>/research /rubber-duck</code><br>Sourced investigation or focused design critique.')}`
  },
  {
    id: 'a-squad-ops', title: 'Keep team state useful.', time: 'Appendix',
    layer: 'Squad 0.13.0 / native CLI distinction', kind: 'reference', sources: [squad, guide],
    tip: 'CLI /compact is conversation context. Squad nap is team-state hygiene.',
    content: `${row('Check the setup', '<code>status / doctor / health</code><br>Team setup is not Terraform correctness.')}
      ${row('Move and maintain state', '<code>export / import / nap --dry-run</code><br>Back up before import. Preview maintenance.')}
      ${row('Inspect usage or route issues', '<code>cost</code> and optional Ralph<br>Logs are not a cap. Triage can change labels.')}`
  },
  {
    id: 'a-evidence', title: 'Know which gate you are reading.', time: 'Appendix',
    layer: 'Terraform / Azure / evidence', kind: 'reference', sources: [tests, tfplan, automatic],
    tip: 'Raw plans, state, private inputs, and credentials are not public artifacts.',
    content: `${row('Reproduce the source', '<code>e9a9a48</code><br>Keep the full pin and reviewed module revision.')}
      ${row('Check the code and example', 'Format, validate, lint, isolated tests, and a deliberate mutation.<br>Then verify the consumer interface.')}
      ${row('Read the real plan', '<code>0</code> unchanged / <code>2</code> changes / <code>1</code> error<br>Scope, policy, approval, and read-back remain separate.')}`
  }
];

export function evidenceContent(evidence) {
  return `<div role="table" aria-label="Current evidence and remaining gates"><div class="evidence-heading" role="row"><span role="columnheader">Evidence</span><span role="columnheader">Current status</span><span role="columnheader">What it establishes</span></div>
    ${evidence.checks.map((item, index) => `<div class="evidence-row" role="row"><strong role="rowheader"><span class="evidence-index" aria-hidden="true">${index + 1}</span>${escape(item.label)}</strong>
      <span role="cell" class="status ${item.status === 'Pending' ? 'pending' : 'observed'}">${escape(item.status)}</span><p role="cell">${escape(item.detail)}</p></div>`).join('')}</div>`;
}

export function demoContent(slide, media) {
  const file = media[slide.chapter];
  const attached = Boolean(file.available);
  const status = attached ? 'Reviewed native recording attached' : 'Recording not attached yet';
  return `<div class="media-well" data-chapter="${slide.chapter}">
    <div class="media-pending"${attached ? ' hidden' : ''}>
      <div class="chapter-art" aria-hidden="true">${slide.chapter}</div>
      <div class="pending-copy"><p class="recording-label">Native CLI recording slot / ${String(slide.duration / 60).padStart(2, '0')}:00</p>
        <h3>Recording not attached yet</h3><p class="pending-explanation">Viewing guide, not executed evidence.</p>
        <ol>${slide.points.map(point => `<li>${point}</li>`).join('')}</ol></div>
    </div>
    <video controls playsinline preload="metadata" aria-label="${escape(slide.chapter + ': ' + slide.title)}" ${attached ? `src="${escape(file.file)}"` : 'hidden'}></video>
  </div>
  <div class="media-tools"><p class="media-status" role="status">${escape(status)}</p>
    <button type="button" class="attach-video" data-chapter="${slide.chapter}">Open local MP4<span class="visually-hidden"> for ${slide.chapter}</span></button>
    <input type="file" accept="video/mp4,.mp4" data-chapter="${slide.chapter}" class="video-file" hidden>
    <span class="local-only">Local only. Nothing uploads.</span></div>`;
}

export function renderSection(slide, index, noteHTML, evidence, media) {
  const isAppendix = slide.id.startsWith('a-');
  let content = slide.kind === 'demo' ? demoContent(slide, media)
    : slide.kind === 'evidence' ? evidenceContent(evidence) : slide.content;
  const fallback = slide.kind === 'demo'
    ? 'If media is absent or fails, keep the clearly labeled viewing guide. Do not narrate an unobserved result.'
    : isAppendix ? 'Answer from the verified reference, then return to Q&A. Do not start an unplanned live demonstration.'
      : 'Use the static slide and its spoken explanation. Keep any unresolved evidence labeled pending.';
  const captureRule = slide.kind === 'demo'
    ? '<p><strong>Capture surface:</strong> Genuine Copilot CLI with Squad selected, standalone or in a real integrated terminal. Recording automation is external, off-screen tooling, not a Squad feature. Qualify code before filming, then capture genuine new execution from a disclosed clean checkpoint. Do not present preparation as filmed first-ever implementation.</p>'
    : '';
  return `<section id="${slide.id}" class="slide-${slide.kind}" role="region" aria-labelledby="${slide.id}-title" data-stage-time="${slide.time}" ${isAppendix ? 'data-appendix="true"' : ''}>
    <div class="slide-content">
      <div class="slide-meta"><span class="eyebrow">${escape(slide.layer)}</span><span class="stage-time">${isAppendix ? 'APPENDIX / reference only' : escape(slide.time)}</span></div>
      <header class="slide-header">${slide.chapter ? `<span class="chapter-id">${slide.chapter}</span>` : ''}<${index === 0 ? 'h1' : 'h2'} id="${slide.id}-title">${escape(slide.title)}</${index === 0 ? 'h1' : 'h2'}></header>
      <div class="slide-body">${content}</div>
      <footer class="slide-footer"><p class="tip"><span>Working tip</span>${escape(slide.tip)}</p><div class="source-links">${isAppendix ? '<a href="#/s22-questions">Back to Q&amp;A</a>' : ''}${slide.sources.map(item => `<a href="${escape(item.url)}"${item.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(item.label)}</a>`).join('')}</div></footer>
    </div>
    <aside class="notes"><h2>${escape(slide.time)} / ${escape(slide.chapter ? slide.chapter + ': ' + slide.title : slide.title)}</h2>${noteHTML}<p><strong>Working tip:</strong> ${escape(slide.tip)}</p>${captureRule}<p><strong>Fallback:</strong> ${escape(fallback)} Source links are optional reading, not online demo dependencies.</p></aside>
  </section>`;
}
