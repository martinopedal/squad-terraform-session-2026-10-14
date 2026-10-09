import { escape, speakerProfiles, gateMapText, c3B1v2Brief } from './slides.mjs';

export const shortTitle = 'From prompt to reusable Terraform: Copilot CLI and Squad, short deck';

const snippet = (label, value, language = 'text') => `<div class="short-snippet">
  <p class="code-label">${escape(label)}</p>
  <pre><code class="language-${language}">${escape(value)}</code></pre>
</div>`;

const speakerCard = (speaker, imageUrl) => `<article class="short-speaker-card">
  <img src="${imageUrl}" alt="${escape(speaker.name)}" width="112" height="112">
  <div>
    <p class="eyebrow">${escape(speaker.initials)}</p>
    <h3>${escape(speaker.name)}</h3>
    <p>${escape(speaker.title)}</p>
    <div class="short-link-pills">${speaker.links
      .map(link => `<a href="${escape(link.url)}">${escape(link.label)}</a>`)
      .join('')}</div>
  </div>
</article>`;

export function createShortSlides({ martinPhoto, haflidiPhoto }) {
  const [martin, haflidi] = speakerProfiles;
  return [
    {
      id: 'short-who-we-are',
      title: 'Who we are.',
      time: 'Short deck / slide 1',
      layer: 'Speakers',
      kind: 'short',
      tip: 'Open with the two speakers, public links, and the session promise.',
      sources: [
        { label: 'Full deck', url: '../index.html' },
        { label: 'Overview', url: '../docs/overview.md' }
      ],
      notes: '<p><strong>Driver:</strong> Martin opens, Haflidi confirms the shared promise.</p><p>Use this as the fast introduction when the room needs the short path.</p>',
      content: `<div class="short-speakers">
        ${speakerCard(martin, martinPhoto)}
        ${speakerCard(haflidi, haflidiPhoto)}
      </div>
      <p class="short-summary">We show a practical Copilot CLI and Squad loop for Terraform work that stays reviewable, source-backed, and gated.</p>`
    },
    {
      id: 'short-what-we-show',
      title: 'What we show.',
      time: 'Short deck / slide 2',
      layer: 'Five-step flow',
      kind: 'short',
      tip: 'Walk the five steps once and keep the chapter names short.',
      sources: [
        { label: 'Talk track', url: '../docs/talk-track.md' },
        { label: 'Run plan', url: '../docs/run-plan.md' }
      ],
      notes: '<p><strong>Driver:</strong> Haflidi walks the five-step story.</p><p>This is the compressed version of the C0-C7 path.</p>',
      content: `<ol class="short-flow-list">
        <li><strong>Bootstrap</strong><span>Install tools, sign in, and run <code>squad init</code>.</span></li>
        <li><strong>Plan</strong><span>Pin the change boundary before edits start.</span></li>
        <li><strong>Route</strong><span>Give one writer the diff and keep validator and reviewer independent.</span></li>
        <li><strong>Check</strong><span>Ground the change with source, tests, and a controlled repair loop.</span></li>
        <li><strong>Consume</strong><span>Show the gated path from pull request to runtime evidence.</span></li>
      </ol>`
    },
    {
      id: 'short-snippets',
      title: 'A few concrete snippets.',
      time: 'Short deck / slide 3',
      layer: 'Proof points',
      kind: 'short',
      tip: 'Pick one snippet per minute and move on.',
      sources: [
        { label: 'Playbook', url: '../docs/playbook.md' },
        { label: 'Prompt pack', url: '../docs/prompt-pack.md' }
      ],
      notes: '<p><strong>Driver:</strong> Martin shows the lane, gate, and prompt examples.</p><p>Keep this at excerpt level.</p>',
      content: `<div class="short-snippets-grid">
        ${snippet('Agent profile', `name: "terraform-coder"\ndescription: "Implement bounded public Terraform module changes."\ntools: ["read", "search", "edit"]`, 'yaml')}
        ${snippet('One gate', gateMapText)}
        ${snippet('B1v2 prompt excerpt', c3B1v2Brief)}
      </div>`
    },
    {
      id: 'short-takeaways',
      title: 'What you take away.',
      time: 'Short deck / slide 4',
      layer: 'Takeaways',
      kind: 'short',
      tip: 'Keep the three rules visible.',
      sources: [
        { label: 'Feature guide', url: '../docs/feature-guide.md' },
        { label: 'Sandboxing note', url: '../docs/sandboxing.md' }
      ],
      notes: '<p><strong>Driver:</strong> Haflidi closes the short story.</p><p>These are the carry-home rules.</p>',
      content: `<div class="short-takeaways-grid">
        <div><h3>Bound the work</h3><p>Plan the change, name the owner, and keep the stop condition explicit.</p></div>
        <div><h3>Keep gates visible</h3><p>Source checks, local tests, review, and runtime evidence answer different questions.</p></div>
        <div><h3>Leave a resume trail</h3><p>Decisions, prompts, and docs belong with the repo so the next engineer can inspect them.</p></div>
      </div>`
    },
    {
      id: 'short-links',
      title: 'Links.',
      time: 'Short deck / slide 5',
      layer: 'Public handoff',
      kind: 'short',
      tip: 'End on the public assets and the repeatable bootstrap path.',
      sources: [
        { label: 'Session repo', url: 'https://github.com/martinopedal/squad-terraform-session-2026-10-14' },
        { label: 'Module repo', url: 'https://github.com/martinopedal/terraform-azapi-aks-automatic' }
      ],
      notes: '<p><strong>Driver:</strong> Martin lands on the public follow-up links.</p><p>Invite the audience to start with the bootstrap and short deck.</p>',
      content: `<div class="short-links-grid">
        <a href="../index.html"><strong>Full deck</strong><span>Reveal.js session deck with notes</span></a>
        <a href="../docs/bootstrap.md"><strong>Bootstrap guide</strong><span>Demo VM setup, login, init, and app checklist</span></a>
        <a href="../docs/talk-track.md"><strong>Talk track</strong><span>Minute-by-minute speaker script</span></a>
        <a href="../docs/sandboxing.md"><strong>Sandboxing note</strong><span>Feasibility verdict and live-demo recommendation</span></a>
      </div>`
    }
  ];
}
