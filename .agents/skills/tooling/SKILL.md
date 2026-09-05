---
name: tooling
description: Keep changes aligned with the existing Highcharts tooling stack and avoid introducing ad-hoc or inconsistent build/test infrastructure.
---

# Highcharts Tooling Guardrails

Use this skill for changes in `tools/`, build scripts, test runners, or repository automation.

## Rules

1. Reuse existing tooling first:
- Prefer npm scripts, gulp tasks, eslint/playwright setup, and existing helpers under `tools/`.
- Do not add a new toolchain when equivalent behavior already exists.

2. Keep stack consistency:
- Prefer Node-based scripts for cross-platform support unless shell behavior is explicitly required.
- Avoid adding repo-wide dependencies for one-off automation.

3. Keep automation safe and predictable:
- Default scripts to non-destructive behavior.
- Require explicit confirmation flags for destructive replacements.
- Support non-interactive CI mode.

4. Verify tooling changes:
- Add or update usage docs/help output (`--help`) for new scripts.
- Include a minimal validation checklist in task/PR output with exact commands used.

## Output format

For each tooling change:

- Change
- Why this stack choice
- Validation command(s)
