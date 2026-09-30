# Public material boundary

Publish only the generic presentation, module source, examples, recording tools, and approved evidence.

The following must stay out of this repository:

- Real environment tfvars/backend configuration and Terraform state or saved plans.
- Access tokens, private keys, kubeconfig credentials, device codes, or authentication logs.
- Private organization configuration, policy snapshots, customer data, and internal source excerpts.
- Raw captures, unreviewed screenshots, private agent histories, or complete session dumps.

The separately versioned module and the copy in this repository must have matching tracked source. Record the module revision and hashes when the copy is refreshed. Keep upstream license notices with any reused source.

Local ignore rules reduce accidental commits; they are not an access-control or data-loss-prevention system. Before each public push, review the exact staged files and diff, scan for credentials and real environment values, and verify that no inherited deployment workflow or estate import command has been copied.

Recorded output is published content too. A clip must not display information that would be excluded from a source commit.
