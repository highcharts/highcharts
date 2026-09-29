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

## Guides

Read only what the task needs:

- For changes in `ts/`, with their tests and samples, use the `hc-development` skill in `.agents/skills/hc-development/SKILL.md`. It condenses what developers need from `CONTRIBUTING.md`, `repo-guidelines.md` and `CODE_REVIEWS.md`.
- For code review, use the `review-pr` skill in `.agents/skills/review-pr/SKILL.md`.
- Other docs: `CONTRIBUTING.md` (bug reports, pull requests, changelog), `repo-guidelines.md` (issues, new series types, prose style), `CODE_REVIEWS.md` (review criteria), `ts/DOCLETS.md` (doclets), `samples/README.md` (samples), `tests/AGENTS.md` (tests; details in `test/readme.md` and `tests/README.md`).

## Tooling Guardrails

- For tooling changes, use the `tooling` skill in `.agents/skills/tooling/SKILL.md`.
- Reuse existing repo tooling (npm scripts, gulp tasks, existing helpers in `tools/`) before adding new mechanisms.
- Prefer cross-platform Node-based scripts unless shell-specific behavior is explicitly required.
- Avoid introducing ad-hoc dependencies or an inconsistent automation stack.

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

## Working Notes

- If `./tmp/TODO.md` exists, follow it.
- Keep temporary plans/checklists in `tmp/` and remove stale scratch artifacts before finishing.
