---
name: security-review
description: Review current Highcharts changes or changes since a specified commit for security vulnerabilities, including the safety of JSON options. Investigate and run local reproductions, then report without fixing product code.
---

# Highcharts Security Review

Review security implications of the selected changes and their reachable code paths. Include JSON options safety whenever those paths consume options. Keep pre-existing findings separate; do not expand into a repository-wide audit.

## Select the changes

- **Current changes** (default): inspect `git status --short`, staged and unstaged diffs, and relevant untracked files. Evaluate the combined working-tree state against `HEAD`. If the staged state differs materially, identify which state each finding applies to. Honor an explicitly staged-only scope.
- **Since a commit**: resolve the supplied commit to a SHA and review its tree against `HEAD` (`git diff BASE HEAD`). Exclude uncommitted work unless requested. Do not silently substitute a merge base or master for the requested base.
- Record the base SHA, candidate SHA plus any local changes, and included paths. If there are no changes in scope, say so rather than starting a full scan.

For example: `$security-review` or `$security-review changes since abc1234`.

## Review the affected paths

Read `SECURITY.md`, `docs/chart-concepts/security.md`, and the relevant repository review and test guidance. Trace changed inputs through their callers and consumers to the operation that could cause harm. Inspect surrounding unchanged code where needed to establish reachability and impact.

Review applicable security boundaries beyond JSON options, including DOM insertion, URL handling, data exposure, file or command operations, and tooling or CI permissions. Require a concrete attacker-controlled input, reachable operation, and security impact; a suspicious API or ordinary configuration error alone is not a vulnerability. Assess denial of service and unexpected network behavior case by case, accounting for intended features and realistic input sizes.

### Required JSON options check

For affected options paths, verify that an untrusted JSON options object cannot cause code execution or prototype pollution with normal Highcharts protections enabled.

- Construct payloads from literal JSON with `JSON.parse`, without a reviver. Do not inject functions, getters, DOM objects, or manually crafted prototypes. In particular, an object literal containing `__proto__` does not model the same input as parsed JSON.
- Follow options through merging, nested property access, format strings, HTML/SVG rendering, attributes, and URLs as relevant to the diff. Include chart creation and affected add/update APIs, relevant modules/products, and `useHTML` modes where applicable.
- Distinguish caller-supplied executable callbacks or an explicitly disabled AST filter from JSON-only attacks. Keep default allowlists and filtering enabled. If JSON itself reaches or disables a protection, that remains in scope.
- Exercise the path through a public options API. A direct helper test supports diagnosis but does not by itself prove that JSON options reach the vulnerable operation.
- Assert an observable security effect, such as a harmless execution marker or a changed prototype. A thrown exception, an alarming string in output, or a test that never reaches the sink is insufficient evidence.

Useful existing coverage includes `samples/unit-tests/svgrenderer/xss`, `samples/unit-tests/ast/ast`, `samples/unit-tests/series/data-nested-keys`, `samples/unit-tests/utilities/format`, and `test/ts-node-unit-tests/tests/Utilities.test.ts`. Use these as context, not an exhaustive checklist.

## Reproduce and compare

Keep the user's checkout intact: use isolated snapshots or worktrees for other revisions, and keep review artifacts under `tmp/`. Do not fix product code or add permanent regression tests during a review.

For each plausible candidate:

1. Attempt a minimal local reproduction on the reviewed state before preparing other revisions. Prefer existing Playwright/QUnit or Node test infrastructure (`tests/README.md`, `test/readme.md`). Select relevant tests explicitly: `gulp test --modified` alone does not establish coverage of unstaged changes. Use a fresh browser context or process for security payloads, and restore any changed globals and AST settings. Keep network effects local or intercepted. Record restrictions such as CSP, Trusted Types, or routing that might mask the behavior under test.
2. Resolve the repository's upstream master and fetch it when available. Record the exact master SHA and whether freshness was verified. A local branch named master or an old remote-tracking ref is not proof of the latest state. If fetching is unavailable, continue with the available evidence and state the limitation.
3. Compare the same reproducer against the requested review base and freshly resolved master. For every run, build with repository-supported tooling and Node; verify that the loaded bundles come from that revision. Do not share stale generated output across revisions. Record blocked reproductions or comparisons as limitations.
4. Check existing tests, merged fixes, and accessible reports or PRs for duplicates. Describe the matching mechanism and fix, not just a similar title. Note when pending private fixes cannot be checked; lack of access does not establish that a finding is new.

Record introduction status relative to the requested base:

- **Introduced or worsened:** demonstrate the difference from the base.
- **Pre-existing:** also reproducible at the base; report separately when encountered along an affected path.
- **Unconfirmed:** the effect or its relationship to the base is not established; state the missing evidence.

Separately record known-report and master-fix status, linking any matching report or fix and stating whether the reviewed state still reproduces. A finding can be introduced by this branch and also be a known duplicate. A passing master test alone proves neither a duplicate nor an existing fix.

Do not discard a candidate just because it does not reproduce on master, or attribute it to the diff just because master also fails. For a suspected reintroduction, compare the relevant fix and changed code.

## Report

Lead with actionable findings, separating new regressions from pre-existing findings. Keep unreproduced candidates separate from confirmed findings. For each finding include:

- Severity with a brief impact rationale and prerequisites.
- Source location and the input-to-impact path; use a changed line for a regression where possible.
- Minimal payload, invocation or local reproducer path, exact commands, and observed versus expected behavior.
- Candidate, base, and master SHAs and outcomes, introduction status, and separate duplicate/fix evidence or access limitations.
- A focused fix direction and regression-test suggestion, without implementing either.

Finish with reviewed scope, tests actually run, and material coverage gaps. If none were confirmed, say so without claiming that all valid JSON is safe or that the entire repository was audited. Finite tests cannot prove that universal property.

Keep findings and reproductions local to the review. CVE eligibility, advisory publication, and whether to fix without an advisory are maintainer decisions; do not create issues, send reports, or publish advisories as part of this skill.

### Example report

Illustrative classification excerpt, not a finding against Highcharts. Use the requirements above for the full report.

```markdown
### JSON options can pollute Object.prototype

| Revision | SHA | Reproduction result |
| --- | --- | --- |
| Requested base | `<base-SHA>` | No prototype mutation |
| Candidate HEAD | `<candidate-SHA>` | Prototype mutation |
| Fresh upstream master | `<master-SHA>` | No prototype mutation |

**Introduction:** Introduced by the reviewed changes: the candidate fails while the requested base passes.
**Known report:** Matches `<report-link>`; this regression is also a known duplicate.
**Master fix:** Not established. The issue is absent from tested master, but no matching fix was verified. This does not dismiss the branch regression.
```
