# AGENTS.md

Scope: instructions for coding/review agents working in this repository.

## Setup

- Install deps with the package manager matching the existing lockfile (typically `npm install` in this repo).
- If the repo still uses `package-lock.json`, do not migrate lockfiles unless explicitly requested.
- Run commands from repo root unless a task says otherwise.

## Skills Sync

- Source of truth is `.agents/skills`.
- Mirror skills to `.claude/skills` with `npm run sync:skills`.

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
- Performance matters: avoid unnecessary loops, redraws, allocations, and DOM/SVG churn.
- Keep behavior compatible across evergreen browsers.
- Follow existing APIs and naming patterns; avoid broad refactors unless requested.

## Docs, Doclets, and Types

- If behavior or API changes, update docs/doclets in the same PR.
- Flag code changes that are not reflected in docs/doclets.
- New public options/types should have proper doclets and type declarations.

## Testing

- Write unit/regression tests for every code change.
- Prefer extending an existing test file over creating a new one.
- For bugfixes, prefer test-first workflow when practical.
- If automated coverage is hard, provide a short manual test plan in the PR/task output.

## Samples and Accessibility

- New samples should include accessibility support unless there is a concrete reason not to.
- Ensure chart type description, axis descriptions/titles, and keyboard navigation are considered.
- Verify sample responsiveness down to 320px.

## Working Notes

- If `./tmp/TODO.md` exists, follow it.
- Keep temporary plans/checklists in `tmp/` and remove stale scratch artifacts before finishing.
