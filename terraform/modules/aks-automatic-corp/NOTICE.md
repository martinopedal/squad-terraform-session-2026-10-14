# Public source attribution

Module consumers and redistributors can use this notice to trace the public sources and retain their required MIT attribution.

| Source | Pinned revision | Contribution and copyright |
| --- | --- | --- |
| [martinopedal/terraform-azapi-aks-automatic](https://github.com/martinopedal/terraform-azapi-aks-automatic/tree/e9a9a481b9b5bf3a4af8046cb602895c89a9ac24) | `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` | Public starting root-module reference. Copyright (c) 2026 martinopedal. |
| [Azure/terraform, private custom-network AzAPI sample](https://github.com/Azure/terraform/tree/0af68bf1013a6e7edc498db58b1db5c55563bda3/quickstart/101-aks-automatic-private-custom-network-azapi) | `0af68bf1013a6e7edc498db58b1db5c55563bda3` | Public reference for the private Automatic request and hosted-system networking. Copyright (c) Microsoft Corporation. All rights reserved. |

`aks-automatic-corp` is a new generic child-module adaptation, not an unchanged copy of the starting root. It separates caller-owned provider/backend configuration and application resources, accepts existing dependency IDs, and adds a bounded interface and contract-test surface. Its files and source header identify the implementation; the source references are not deployment validation.

No private landing-zone implementation, estate deployment workflow, real environment inputs, credentials, or state are copied into this package. The example values are synthetic fixtures.

Both sources use the MIT license. [LICENSE](LICENSE) preserves both copyright notices and the full common permission, inclusion condition, and disclaimer. Retain this notice and the license with the separately versioned module and any session-repository copy.

These module notices do not replace the licenses for Terraform, AzAPI, presentation dependencies, or unrelated session material.
