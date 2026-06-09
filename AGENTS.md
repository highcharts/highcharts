# AGENTS.md

Scope: instructions for coding/review agents working in this repository.

## Setup

- Install deps with the package manager matching the existing lockfile (typically `npm install` in this repo).
- If the repo still uses `package-lock.json`, do not migrate lockfiles unless explicitly requested.
- Run commands from repo root unless a task says otherwise.

## Skills Sync

- Source of truth is `.agents/skills`.
- Mirror skills to `.claude/skills` with `npm run sync:skills`.
- Use `npm run sync:skills -- --help` to inspect script options.

## Read First

- `CODE_REVIEWS.md`
- `CONTRIBUTING.md`
- `repo-guidelines.md`
- `ts/DOCLETS.md`
- `samples/README.md`
- `test/readme.md`
- `tests/README.md`

## Core Priorities

- Keep changes minimal and focused. Do not bloat core.
- Prefer small, terse code with low file-size impact.
- Avoid larger changes in the primary bundles (`highcharts.js`, `grid.js` etc) if the functionality or issue is unique to a secondary module.
- Performance matters: avoid unnecessary loops, redraws, allocations, and DOM/SVG churn.
- Keep behavior compatible across evergreen browsers.
- Follow existing APIs and naming patterns; avoid broad refactors unless requested.

## Tooling Guardrails

- For tooling changes, use the `tooling` skill in `.agents/skills/tooling/SKILL.md`.
- Reuse existing repo tooling (npm scripts, gulp tasks, existing helpers in `tools/`) before adding new mechanisms.
- Prefer cross-platform Node-based scripts unless shell-specific behavior is explicitly required.
- Avoid introducing ad-hoc dependencies or an inconsistent automation stack.

## Docs, Doclets, and Types

- If behavior or API changes, update docs/doclets in the same PR.
- Flag code changes that are not reflected in docs/doclets.
- New public options/types should have proper doclets and type declarations.

## Testing

- Write unit/regression tests for every code change.
- Prefer extending an existing test file over creating a new one.
- For bugfixes, prefer test-first workflow when practical.
- If automated coverage is hard, provide a short manual test plan in the PR/task output.

## Skill and Tooling Change Validation

- Validate script behavior with:
- `npm run sync:skills -- --help`
- `npm run sync:skills -- --yes`
- For non-interactive safety, validate:
- `npm run sync:skills < /dev/null` (should fail unless `--yes` is used)
- In PR description, include commands executed and whether result was expected.

## Skill Evaluation Notes

- For new/changed skills, compare at least one representative task run with and without the skill.
- In PR description, report: task used, qualitative outcome, and approximate token/step delta if available from the client logs.
- If no evaluator is used, explicitly state that and provide manual observations.

## Samples and Accessibility

- New samples should include accessibility support unless there is a concrete reason not to.
- Ensure chart type description, axis descriptions/titles, and keyboard navigation are considered.
- Verify sample responsiveness down to 320px.

## Working Notes

- If `./tmp/TODO.md` exists, follow it.
- Keep temporary plans/checklists in `tmp/` and remove stale scratch artifacts before finishing.
