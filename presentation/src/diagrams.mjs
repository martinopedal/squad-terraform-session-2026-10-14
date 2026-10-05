const text = (x, y, value, size = 25, weight = 400, fill = '#1A1B1B') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${value}</text>`;
const rect = (x, y, width, height, fill = '#98F8FE', stroke = '#1A1B1B', radius = 8) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const path = (d, id, color = '#1A1B1B') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#${id}-arrow)"/>`;
const svg = (id, width, height, label, content) => `<svg xmlns="http://www.w3.org/2000/svg"
  id="${id}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
  role="img" aria-labelledby="${id}-title" style="font-family:'Roboto',system-ui,sans-serif">
  <title id="${id}-title">${label}</title>
  <defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1A1B1B"/></marker></defs>
  ${content}</svg>`;

export const hero = () => svg('hero-map', 450, 396,
  'An existing codebase becomes a reusable module with code, tests, and a public contract. Private environment inputs remain outside.',
  `${rect(42, 20, 324, 244, '#98F8FE', '#1A1B1B', 12)}
   ${text(70, 62, 'REUSABLE MODULE', 17, 600, '#1A1B1B')}
   ${text(68, 147, '{ }', 82, 600, '#1A1B1B')}
   ${text(204, 110, 'Code', 29, 600)}
   ${text(204, 156, 'Tests', 29, 600)}
   ${text(204, 202, 'Contract', 29, 600)}
   <path d="M 338 318 V 301 H 82 V 277" fill="none" stroke="#1A1B1B" stroke-width="2" stroke-dasharray="6 6"/>
   ${rect(102, 318, 312, 60, '#98F8FE', '#1A1B1B')}
   ${text(122, 356, 'Private environment', 25, 600)}
   ${path('M 82 283 V 268', 'hero-map')}
   ${text(128, 292, 'approved inputs', 17, 400, '#1A1B1B')}`);

export const layers = () => svg('product-map', 1152, 356,
  'A human supplies the brief and approval. Copilot CLI hosts execution and the Squad custom agent. Squad coordinates ownership. Terraform, Git, and MCP tools return evidence.',
  `${rect(0, 73, 220, 204, '#98F8FE')}
   ${text(24, 116, 'HUMAN', 18, 600, '#1A1B1B')}
   ${text(24, 159, 'Brief', 31, 600)}
   ${text(24, 204, 'Revision', 27)}
   ${text(24, 246, 'Approval', 27)}
   ${rect(292, 8, 480, 144, '#98F8FE', '#1A1B1B')}
   ${text(318, 49, 'NATIVE COPILOT CLI', 19, 600, '#1A1B1B')}
   ${text(318, 91, 'Plan / context / execution', 29, 600)}
   ${text(318, 127, 'Tools, permissions, subagents', 24)}
   ${rect(292, 208, 480, 140, '#98F8FE', '#1A1B1B')}
   ${text(318, 248, 'SQUAD TEAM LAYER', 19, 600, '#1A1B1B')}
   ${text(318, 288, 'Roles / routing / handoffs', 29, 600)}
   ${text(318, 324, 'Decisions, histories, Scribe', 24)}
   ${rect(858, 73, 292, 204, '#98F8FE')}
   ${text(882, 113, 'EXTERNAL TOOLS', 18, 600, '#1A1B1B')}
   ${text(882, 158, 'Terraform / Git', 27, 600)}
   ${text(882, 202, 'MCP sources', 27)}
   ${text(882, 245, 'Checks and artifacts', 23)}
   <g class="fragment" data-fragment-index="0">
   ${path('M 220 145 H 253 V 82 H 285', 'product-map')}
   ${path('M 532 155 V 200', 'product-map')}
   ${text(548, 187, 'hosts', 20, 400, '#1A1B1B')}
   </g>
   <g class="fragment" data-fragment-index="1">
   ${path('M 777 81 H 815 V 147 H 851', 'product-map')}
   ${path('M 858 244 H 816 V 285 H 780', 'product-map')}
   </g>`);

export const corp = () => svg('corp-map', 1152, 337,
  'The reusable AKS module consumes approved inputs for an existing Corp network. API-server, system-node, and user-node subnets stay platform owned alongside DNS, egress, and identity permissions. The workload has a private API.',
  `<rect x="1" y="3" width="718" height="328" rx="10" fill="#98F8FE" stroke="#1A1B1B" stroke-width="2" stroke-dasharray="7 6"/>
   ${text(25, 43, 'EXISTING CORP PLATFORM', 20, 600, '#1A1B1B')}
   ${text(25, 84, 'Platform-owned network', 30, 600)}
   ${rect(24, 109, 206, 80, '#98F8FE')}
   ${rect(254, 109, 206, 80, '#98F8FE')}
   ${rect(484, 109, 206, 80, '#98F8FE')}
   ${text(43, 144, 'API-server', 25, 600)}${text(43, 173, 'subnet', 22)}
   ${text(273, 144, 'System-node', 25, 600)}${text(273, 173, 'subnet', 22)}
   ${text(503, 144, 'User-node', 25, 600)}${text(503, 173, 'subnet', 22)}
   ${text(25, 239, 'DNS / egress / identity permissions', 26)}
   ${text(25, 290, 'Reviewed IDs and prerequisites', 24, 600, '#1A1B1B')}
   ${rect(844, 76, 306, 194, '#98F8FE', '#1A1B1B')}
   ${text(868, 118, 'WORKLOAD MODULE', 18, 600, '#1A1B1B')}
   ${text(868, 166, 'AKS Automatic', 29, 600)}
   ${text(868, 208, 'Private API', 28, 600)}
   ${text(868, 244, 'Fresh workload', 23)}
   ${path('M 724 170 H 835', 'corp-map')}
   ${text(730, 146, 'inputs', 19, 400, '#1A1B1B')}`);

export const memory = () => svg('decision-map', 1152, 262,
  'A reviewed decision records the accepted boundary and its reason. Scribe writes repository knowledge. A resumed task must read the record before continuing.',
  `${rect(0, 44, 306, 171, '#98F8FE', '#1A1B1B')}
   ${text(26, 86, 'ACCEPTED DECISION', 18, 600, '#1A1B1B')}
   ${text(26, 128, 'Private Corp path', 28, 600)}
   ${text(26, 170, 'Boundary and reason', 24)}
   ${rect(422, 44, 306, 171)}
   ${text(448, 86, 'SQUAD / SCRIBE', 18, 600, '#1A1B1B')}
   ${text(448, 128, 'Repository record', 27, 600)}
   ${text(448, 170, 'Review what was saved', 23)}
   ${rect(844, 44, 306, 171)}
   ${text(870, 86, 'NEXT TASK', 18, 600, '#1A1B1B')}
   ${text(870, 128, 'Read, then continue', 26, 600)}
   ${text(870, 170, 'Verify the constraint', 24)}
   ${path('M 312 129 H 413', 'decision-map')}
   ${path('M 734 129 H 835', 'decision-map')}`);

export const consumption = () => svg('consumer-map', 1152, 304,
  'A consumer root calls the public module and supplies private configuration. It owns providers and backend state. The public module owns reusable infrastructure. Kubernetes applications have a separate root.',
  `${rect(1, 2, 376, 288, '#98F8FE', '#1A1B1B')}
   ${text(27, 42, 'PRIVATE CONSUMER ROOT', 19, 600, '#1A1B1B')}
   ${text(27, 88, 'Environment inputs', 29, 600)}
   ${text(27, 134, 'Provider configuration', 26)}
   ${text(27, 179, 'Backend and state', 26)}
   ${text(27, 224, 'Authentication', 26)}
   ${text(27, 268, 'Real values and state stay private', 20, 600)}
   ${rect(510, 2, 640, 168, '#98F8FE', '#1A1B1B')}
   ${text(539, 45, 'PUBLIC MODULE', 19, 600, '#1A1B1B')}
   ${text(539, 92, 'aks-automatic-corp', 33, 600)}
   ${text(539, 138, 'Typed inputs / outputs / isolated tests', 25)}
   ${rect(510, 204, 640, 86)}
   ${text(539, 240, 'Separate application root', 26, 600)}
   ${text(539, 274, 'Kubernetes access and lifecycle stay separate', 23)}
   ${path('M 382 91 H 502', 'consumer-map')}
   ${text(394, 69, 'calls', 20, 400, '#1A1B1B')}`);


export const agentSetup = () => svg('agent-setup-map', 1152, 304,
  'Repository guidance feeds both Squad coordination and three narrow native Terraform profiles. The operator explicitly selects coder, validator, and reviewer profiles. MCP sources provide read-only documentation and Squad memory.',
  `${rect(1, 7, 326, 130, '#98F8FE', '#1A1B1B')}
   ${text(24, 45, 'ALWAYS-ON REPO GUIDANCE', 17, 600, '#1A1B1B')}
   ${text(24, 82, 'AGENTS.md', 26, 600)}
   ${text(24, 114, '.github\\copilot-instructions.md', 19)}
   ${rect(1, 168, 326, 86, '#98F8FE')}
   ${text(24, 202, 'HCL APPLYTO RULES', 17, 600, '#1A1B1B')}
   ${text(24, 232, 'terraform.instructions.md', 21, 600)}
   ${rect(414, 42, 318, 181, '#98F8FE', '#1A1B1B')}
   ${text(439, 82, 'SQUAD COORDINATOR', 17, 600, '#1A1B1B')}
   ${text(439, 121, 'squad.agent.md', 27, 600)}
   ${text(439, 158, '.squad\\team + routing', 22)}
   ${text(439, 191, 'charters + decisions', 22)}
   ${rect(826, 7, 326, 247, '#98F8FE', '#1A1B1B')}
   ${text(850, 45, 'NATIVE TERRAFORM PROFILES', 17, 600, '#1A1B1B')}
   ${text(850, 84, 'terraform-coder', 24, 600)}
   ${text(850, 117, 'edit + read-only docs', 19)}
   ${text(850, 157, 'terraform-validator', 24, 600)}
   ${text(850, 190, 'offline checks only', 19)}
   ${text(850, 228, 'terraform-reviewer', 23, 600)}
   ${text(850, 249, 'read-only review + docs, separate context', 15)}
   ${path('M 333 77 H 405', 'agent-setup-map')}
   ${path('M 733 132 H 817', 'agent-setup-map')}
   ${path('M 333 211 H 405 V 162', 'agent-setup-map')}
   ${text(444, 284, 'MCP: Microsoft Learn, Terraform registry docs, squad_state memory', 21, 600, '#1A1B1B')}`);

