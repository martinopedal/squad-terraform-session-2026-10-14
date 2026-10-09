# Sandboxing for the demo

Short verdict: **use a 60-second note or skip it as a live dependency.**

## What the public docs say

- Local sandboxing for GitHub Copilot reached GA on **2026-10-07** in Copilot CLI and related surfaces, powered by [Microsoft eXecution Container](https://github.com/microsoft/mxc). [GitHub changelog](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/)
- In Copilot CLI, the controls are `/sandbox`, `/sandbox enable`, `/sandbox disable`, `/sandbox status`, `/sandbox policy`, `/sandbox config`, and the one-session `--sandbox` flag. [Using local sandboxing](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing)
- Local sandboxing is off by default.
- Default write scope is the current working directory plus temp. The rest of the repository above the current working directory is readable, not writable. Outbound internet is on. Local network is off. Git and `gh` credentials go through a local proxy for approved HTTPS hosts. [Using local sandboxing](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing)
- Windows needs Windows 11 25H2 with KB5124010 or later, or 26H1 with KB5124006 or later. Linux needs `bwrap` 0.5.0+ and `slirp4netns`. [Using local sandboxing](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing)
- Cloud sandboxes are still public preview. [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes)

## What we tested on this machine

Host used on 2026-10-09:

- Copilot CLI 1.0.94
- Windows build 26300

Observed behavior:

1. A first `copilot --sandbox` run failed before any shell command started. The host complained that Windows sandbox proxying needed local-network access.
2. After a temporary test-only policy change to allow local network and add `C:\` as a read-only path, the sandbox started.
3. Inside that adjusted policy:
   - Writing inside the working directory succeeded.
   - Writing one level above the working directory was blocked.
   - `gh repo view ...` succeeded.
   - `git push --dry-run origin HEAD` succeeded.
   - `terraform version` succeeded.
   - `terraform init -backend=false` in a throwaway provider test folder succeeded.
   - `docker version` and `docker run hashicorp/terraform-mcp-server:1.3.0 --help` failed on the Docker named pipe.
   - `az version` and `az account show --output none` failed because the sandboxed process could not resolve the Azure CLI bundled Python path.

## Demo impact

### Good live moment

If you include sandboxing, keep it short:

1. Show `/sandbox status` or explain that `--sandbox` is available.
2. Demonstrate a blocked write outside the working directory.
3. Say that Terraform shell work can succeed in a tuned policy, but Docker-backed local tooling is the current weak point on this machine.

### Risks

- The default Windows policy failed on first contact because Git and `gh` proxying needed local-network access.
- Docker-backed Terraform MCP was blocked by the Docker named pipe, so the current local MCP story is fragile.
- `terraform init` can need outbound downloads, so a stricter egress policy can break the demo.
- Azure CLI did not survive the adjusted sandbox on this host, so any `az login` or token-based moment is risky.

## Recommendation

**Recommendation: do not make sandboxing a required live chapter for this session.**

Use it as a short verbal update next to HydraFusion and Auto, or as an appendix note. If you want a live proof point, rehearse one safe 60-second clip around status plus a blocked write. Estimate **2 to 4 hours** to harden that clip and document the exact Windows policy. Estimate more if Docker-based MCP or Azure CLI must work inside the sandbox.
