# Copilot local sandboxing (different from ACA Sandboxes)

This note is about GitHub Copilot local sandboxing. It is not about Azure Container Apps Sandboxes.

- GitHub announced local sandboxing as generally available on 2026-10-07 for Copilot CLI, the Copilot app, and VS Code sessions that use Agent Host.
- The feature is powered by [Microsoft eXecution Container (MXC)](https://github.com/microsoft/mxc).
- In Copilot CLI, the controls are `/sandbox`, `/sandbox enable`, `/sandbox disable`, `/sandbox status`, `/sandbox policy`, `/sandbox config`, and the one-session `--sandbox` flag.
- Local sandboxing is off by default.
- By default, sandboxed commands can write inside the current working directory and temporary folders. Outbound internet access is on by default. Local network access is off by default.
- On Windows, local sandboxing requires Windows 11 25H2 with KB5124010 or later, or Windows 11 26H1 with KB5124006 or later.
- GitHub's docs say cloud sandboxes are still in public preview.

Sources:

- <https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/>
- <https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing>
- <https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes>
