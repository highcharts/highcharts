---
name: review-pr
description: Review Highcharts code changes for correctness, performance, API consistency, accessibility, docs/doclets, and tests using CODE_REVIEWS.md.
---

# Highcharts PR Review

Use this skill when reviewing a PR, branch diff, staged diff, or selected files.

## Inputs

- Optional scope: file paths, commit range, or branch.
- If no scope is provided, review `git diff` and `git diff --staged`.
- If PR metadata is available, review labels/tags and the PR description before reviewing code.

## Checklist

1. Read context first:
- `CODE_REVIEWS.md`
- `CONTRIBUTING.md`
- `repo-guidelines.md`
- `ts/DOCLETS.md`
- `samples/README.md`
- `test/readme.md`

2. Check PR metadata when available:
- Verify labels/tags are correct.
- Review the PR description against `CONTRIBUTING.md#writing-content-for-the-changelog`.
- Confirm changelog labels/product tags are present when needed, and that the first paragraph is suitable changelog text.

3. Verify correctness:
- Edge cases, null/undefined handling, backward compatibility, API consistency.

4. Verify performance and size:
- Avoid O(n^2) loops in hot paths, avoid extra redraw/reflow, keep bundle/core impact low.

5. Verify docs/doclets/types:
- New/changed options and public types should have doclets and type coverage.
- Flag undocumented behavior changes.

6. Verify tests:
- Require unit/regression tests.
- Prefer adding to existing test files.
- If not automatable, require a manual test plan.

## Output format

For each finding:

- Severity: Critical | High | Medium | Low
- Location: `path:line`
- Issue
- Suggestion

Then provide:

1. Verdict: Ready / Needs changes / Needs discussion
2. Blocking issues
3. Non-blocking improvements
