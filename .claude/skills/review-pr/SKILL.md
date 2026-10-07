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
- For doclet wording and style, apply the `api-ref-tone` skill.

6. Verify tests:
- Require unit/regression tests.
- Prefer adding to existing test files.
- If not automatable, require a manual test plan.

7. Verify security:
- Read `SECURITY.md`; for product code, use the [development security checklist](../hc-development/review.md#security).
- For security-relevant changes, follow [Security review](#security-review).

## Security review

When changes affect untrusted input, HTML/URL filtering, file paths or network requests, auth/credentials, dependencies or install hooks, CI permissions or publishing, suggest a native security review to the user and briefly explain the relevant risk:

- In Codex, suggest the installed Codex Security plugin's `security-diff-scan` skill for the PR, commit, branch diff or working-tree patch.
- In Claude Code, suggest the installed [Claude Security plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-security/README.md): `/claude-security`, then **Scan changes**.

Recommend an available plugin to the user with a suggested scope limited to the current diff or relevant paths. Keep the recommendation proportionate; it is not required for every edit. Obtain explicit user approval before invoking a plugin or starting any scan. Only after approval, verify its supported invocation, scope and baseline from its installed instructions and run within the approved scope. Do not auto-install plugins. If unavailable, tell the user, continue normal review, and suggest setup only when relevant.

Keep source within approved access and data-handling boundaries; do not upload it elsewhere or expose secrets. Plugin review complements tests, existing SAST and human review. Validate findings against `SECURITY.md` and reachable code before treating them as vulnerabilities. Applying fixes or publishing findings needs authorization; the recommendation grants neither.

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
