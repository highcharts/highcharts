---
name: hc-development
description: Use for any change to Highcharts, Stock, Maps, Gantt, Grid or Dashboards source in `ts/`, with its tests, samples and docs, including bugfixes, features and refactors. Gives the workflow, rules for minimal root-cause fixes and bundle size, and an architecture guide per product.
---

# Highcharts development

These rules apply to every product in the repository. Each product guide adds the rules and the architecture map for that product.

## Products

| Code in | Product guide |
|---|---|
| `ts/Core`, `ts/Series`, `ts/Extensions`, `ts/Stock`, `ts/Maps`, `ts/Gantt`, `ts/Accessibility`, `ts/masters`, `ts/masters-es5` | Highcharts, Stock, Maps, Gantt: [highcharts/index.md](highcharts/index.md) |
| `ts/Grid`, `ts/masters-grid` | Grid Lite and Grid Pro: [grid/index.md](grid/index.md) |
| `ts/Dashboards`, `ts/masters-dashboards` | Dashboards: [dashboards/index.md](dashboards/index.md) |
| `ts/Data`, `ts/Shared`, and the `ts/Core` and `ts/Accessibility` files listed in [shared.md](shared.md) | [shared.md](shared.md), then the guide of each product that ships the file |

Work in one product rarely affects the others, so read only your product's guide. Shared code is the exception. If the cause turns out to be in another product, switch to that product's guide.

## Workflow

Go through the stages in order. Return to an earlier stage when you learn something that changes the plan.

### 1. Plan

- Read your product guide. Use its map to find the function that owns the behavior, the bundle that ships it, and related code: overrides, compositions, event listeners, and other bundles or products that include the file.
- Decide if it is a bug: code that doesn't do what it is designed and documented to do. If it works as designed but misses the reported case, or the docs mention the limitation, it is a feature request.
- Decide where the code goes ([below](#where-code-goes)).
- Note the files to read, the intended change and the test to add. If unclear, stop and ask before proceeding.

### 2. Investigate

- Reproduce the problem, preferably as the failing test you will keep.
- Read the owning function, its callers and its overrides before choosing a fix. Delegate searches that span many files ([Subagents](#subagents)).
- Find the root cause. Needing the same guard in several places means the cause is upstream.
- If several fixes are reasonable, take the smallest one that fixes the cause, and keep the others for the report.

### 3. Implement

Bugfixes:

- Fix the function that owns the behavior, not its call sites: no `if (series.type === 'x')`, flags, or correcting values afterwards. A bug that shows only with one module, series type, component or Pro feature is fixed there.
- Restructure the owning function and its direct helpers if that makes the change smaller. Delete code the fix makes obsolete.
- Fix the same cause wherever it occurs, such as a copy of the faulty loop in a sibling method, and say so in the report. Go no further: no renames, moves, type rewrites or cleanups elsewhere. Propose larger refactors; don't do them.
- Handle real use only: the reported case and documented option combinations. Don't guard against states the public API can't reach, invalid internal input, or what types guarantee. Don't re-default merged options.

Features:

- No speculative options or extras.
- Follow existing APIs, option names and patterns. Reuse `ts/Shared/Utilities.ts` and existing compositions before adding helpers.
- A new option needs a type, a doclet, a default, a sample and a test. The product guide gives the doclet tags.
- Changed behavior or API: update docs and doclets in the same change. In `docs/`, link to other docs, the API and samples with absolute `https://www.highcharts.com/…` URLs; `npx gulp test-docs` checks those links and `@sample` paths.

Code:

- 4 spaces, max 80 columns, single quotes, no `console`, no `any`. Avoid `as`; narrow types instead. ESLint enforces the rest.
- Support evergreen browsers.
- Performance: no extra loops, redraws, re-renders, allocations or DOM churn.
- Security: HTML from options or data goes through `AST`. No secrets. No copied code, except MIT, BSD, Apache 2.0 or MPL code with a comment naming license and author. Full list in [review.md](review.md#security).
- No commented-out code or unused imports. New functions get doclets.
- Doclets and comments: fill lines to 80 columns; break lines only between paragraphs.

### 4. Test

- Bugfixes and features get a regression test that fails without the change; refactors keep the existing tests passing. Extend an existing test file and reuse its setup, with minimal options. The product guide says where tests live and how to run them.
- Tests must not depend on each other. Undo global changes such as `setOptions`.
- Run the new test, the tests for the area, lint and type-check.
- If automated coverage is hard, write a short manual test plan for the report.

### 5. Self-review and iterate

Review the full diff with [review.md](review.md): size and bloat, logic, conventions and security. The security check starts with `SECURITY.md`. When the diff touches a main bundle, shared code, security-sensitive code or several files, a reviewer subagent with a fresh context finds more than you will ([Subagents](#subagents)). Fix, re-test and review again until a round finds nothing, for at most three rounds.

### 6. Report

Keep it short:

- What changed, the root cause, and why the fix belongs where it is.
- Tests added and their results, or the manual test plan.
- Size delta if a main bundle changed.
- Open questions, security-sensitive changes, alternative approaches, and refactors you propose but did not do.
- Wrong facts in this Skill's product guide that should be updated.

## Where code goes

Each product has a main bundle that nearly every user loads: `highcharts.js`, Grid's core (in both Grid Lite and Grid Pro), and `dashboards.js`. The bar for adding code there is very high, for bugfixes too. Take the first option that works:

1. Existing options, events or API can do it: write a demo or docs.
2. The module, composition or component that owns the area.
3. A new module or composition that hooks into the main classes.
4. The main bundle: only if nearly every user needs it and no hook can do it.

Correcting wrong logic in a main bundle is fine; keep it small. Before adding new logic there, for a feature or a bug, stop and ask. Present the options with the size cost of each. If an add-on needs to change main-bundle behavior, add an event hook there and keep the logic in the add-on. The product guide maps these levels to its code.

## Subagents

Subagents keep search results, file contents and test logs out of your context. If your agent can start them, use them as below; if not, do the same steps yourself. Skip them for small changes in one file.

- Plan and investigate: delegate broad read-only searches, one question per subagent, in parallel when they are independent. For example: the overrides, compositions and event listeners of a method, or every bundle and product that ships a file. Ask for `path:line` answers, not file contents. Read the code you will change yourself.
- Test: a long test or lint run can go to a subagent that reports only the failures and their errors. Run builds and test runs one at a time; they write to shared folders such as `code/`.
- Self-review: give each round to a new subagent with a fresh context, not a fork of this conversation. Pass the task, the base commit, the decisions you made and why, and the paths to your product guide, to [shared.md](shared.md) if shared code changed, and to [review.md](review.md), all in this skill's folder. Tell it to review without editing. Wait for its findings before you report.
- Do these yourself: the plan, questions to the user, code and test edits, fixes and the report. Don't delegate file edits.
- A subagent sees neither this skill nor your conversation. Each prompt states the task, the scope, the files to read and the output format.
- Verify what subagents report before you act on it.

## Commits and PRs

- Commit messages: past tense, `Fixed #1234, description.`
- The first paragraph of the PR description is the changelog entry: past tense, the bug as users see it, API names in backticks. It is used only if the PR is labeled `Changelog: Bugfix` or `Changelog: Feature`; the product guide gives the product label.
