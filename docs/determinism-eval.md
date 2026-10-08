# Repeatability eval: three Terraform briefs, five runs each

Audience: engineers using Copilot CLI and Squad for bounded Terraform changes. You will learn what we measured, what passed, what failed, and how to read the result without claiming identical model behavior.

## Purpose

The eval measures repeatability for small Terraform maintenance briefs under pinned conditions. It does not try to establish identical model behavior, general agent quality, or Azure deployment correctness. The useful question was: from the same starting point, how often does the run reach the pre-registered oracle?

## Method

- Three briefs, five fresh runs per brief.
- Base commit `4689d3c` of the public session repository's corp module copy.
- Each run used a fresh worktree, a new Copilot CLI process, identical flags, and the same allowed tool set.
- Model pinned to `claude-sonnet-5`.
- Copilot CLI `1.0.93`.
- Terraform `1.16.5`.
- Terraform MCP server image pinned by digest `sha256:423a6b8e...`.
- Oracle rules were pre-registered in the harness before the runs. The oracle reran Terraform checks on the final tree, enforced allowed files, and applied brief-specific semantic rules.
- A brief passed the repeatability bar at `>= 4/5` green runs. Infrastructure failures counted as not green and would be disclosed.

Common oracle commands were `terraform fmt -check -recursive`, `terraform init -backend=false -input=false -lockfile=readonly`, `terraform validate -no-color`, module `terraform test -no-color`, and example `terraform test -no-color`.

## Results

| Brief | Task | Green runs | Repeatability bar | Oracle evidence | Notes |
| --- | --- | ---: | --- | --- | --- |
| B1 | `alternate_network_payload` | 0/5 | Failed | Every run passed 53/53 module contract tests and 2/2 example tests | All five runs asserted the pod CIDR, service CIDR, DNS service IP, and private API server value, but used two assert blocks. The pre-registered rule required at least three assert blocks, so the result is reported as fail and was not rescored. |
| B1v2 | `alternate_network_payload_clarified_assert_shape` | 5/5 | Passed | Five fresh runs from base `4689d3c` were green under the same pinned conditions | Clarified brief asked for four separate assert blocks, each with its own `error_message`; run durations were 61.04-113.658 s, with no failure modes observed. |
| B2 | `seeded-mutation-repair` | 5/5 | Passed | Every run passed 52/52 module contract tests and 2/2 example tests | The seeded repair met the oracle in all five fresh runs. |
| B3 | `forbidden-tag-characters` | 4/5 | Passed | Every rescored B3 run passed 53/53 module contract tests and 2/2 example tests | Original automated B3 was 0/5 because the oracle failed before scoring after the bad `-AllowedFiles` invocation. After fixing the harness bug, saved `final.diff` artifacts were rescored without rerunning Copilot; final B3 was 4/5, and run 2 stayed red for the out-of-scope README edit. |

### B1v2: clarified brief (re-measurement)

B1v2 exists because the original B1 brief did not state the `>= 3` assert-block rule explicitly. All five original B1 runs passed the Terraform checks, but each used two assert blocks. The pre-registered oracle required at least three assert blocks, so original B1 stays 0/5 and is not rescored.

The clarified B1v2 brief says: "Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file."

Method: B1v2 used five fresh runs from base `4689d3c`, model `claude-sonnet-5`, and the same harness, flags, allowed tools, and pins as the original eval. Its pre-registered oracle required `>= 4` separate assert blocks. It was a separate brief written after seeing B1, not a retroactive pass for B1.

Result: 5/5 green, meeting the `>= 4/5` bar. The five runs lasted 108.031 s, 97.131 s, 87.806 s, 61.04 s, and 113.658 s (61-114 s rounded), and no failure modes were observed in those five runs. The ambiguous B1 brief failed the oracle 5/5 times in the same way: it produced two assert blocks. B1v2 stated the expected test shape in the brief and was 5/5 green under the same pinned conditions; this five-run follow-up does not isolate causality.

This is still a five-run checkpoint. It is repeatable only in this eval under pinned conditions, not a guarantee of future runs or broader model behavior.

## What this shows

- Under these pins and prompts, two of the three original briefs met the pre-registered `>= 4/5` repeatability bar; the separate B1v2 clarified-brief follow-up also met it.
- B1 is an important failure because the functional tests passed while the style and maintainability rule failed. The harness oracle, not the model summary, marked the result.
- B3 shows why file-scope checks matter. Passing tests did not excuse an out-of-scope edit.
- The sample is small: the original eval was 15 runs across three briefs, plus one five-run clarified follow-up. Treat it as a measured checkpoint, not a statistical guarantee.

## What this does not show

- It does not establish that Copilot CLI, the model, Terraform, or Squad produce identical output across runs.
- It does not establish that future runs will behave the same after model, CLI, MCP, prompt, or repository changes.
- It does not establish that deployed Azure resources are correct or secure. This eval used offline Terraform oracles.

## What to do next

Use the result as a design input: narrow the brief, pin the toolchain, pre-register the oracle, and report misses honestly. These results stand as recorded; do not rerun just to fish for a greener sample. If the prompt, code, or oracle changes, treat that as a new eval and publish the new conditions beside the new results.
