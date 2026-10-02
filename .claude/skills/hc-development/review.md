# Self-review

Stage 5 of the workflow in [SKILL.md](SKILL.md). Review the change before you report it, and iterate until the review is clean.

If you are a reviewer subagent: review against this list, answer in the [reviewer output](#reviewer-output) format and stop. Don't edit files; the author iterates. Report real problems only: bugs, missed requirements, broken rules from this list, and code that can go. Don't ask for guards, options or tests the task doesn't need.

## Scope

- The diff against the base commit, plus new files (`git status`). Every changed line, including tests, samples and docs.
- Re-read the task. The change should solve it, and only it.

## Size and bloat

- Every added line is needed for the task. Remove speculative options, guards for states the public API can't reach, re-defaulted options, debug code, commented-out code and unused imports.
- Existing helpers are reused (`ts/Shared/Utilities.ts`, the product's utilities), not reimplemented.
- Code the change made obsolete is deleted.
- No unrelated edits: renames, moves, formatting, type rewrites or cleanups elsewhere.
- A bugfix diff is small, ideally a negative line count. If a smaller change fixes the same cause, use it.
- If a main bundle changed, its size was measured before and after, and the delta is in the report. The product guide says how.

## Logic

- The root cause is fixed in the function that owns the behavior: not at a call site, not with a type check or flag, not by correcting values afterwards.
- Overrides, subclasses, compositions, event listeners, and other bundles or products that ship the file still work. Name each one and check it.
- Documented option combinations and the whole lifecycle work: first render, `update()`, re-render, `destroy()`, empty and null data, repeated calls.
- Async code returns or awaits its promises, doesn't race with `destroy()`, and removes its listeners and timers on destroy.
- Performance: no extra loops over data, redraws, re-renders or DOM churn in hot paths.
- The regression test fails without the change and passes with it.

## Conventions

- Lint and type-check pass. No `any`; `as` only where narrowing can't do it.
- New functions have doclets. A new public option has a type, a default, a doclet with the product's tags, a sample and a test.
- The product guide's rules hold: CSS class names and styling, lang strings, accessibility, and bundle placement.
- Changed behavior or API is reflected in docs and doclets.
- Tests follow the product's test rules. Samples follow `samples/README.md`: only the options they need, readable in light and dark mode, usable at 320px wide and by keyboard.
- Doclets and comments fill lines to 80 columns, with line breaks only between paragraphs.

## Security

Read `SECURITY.md` in the repository root first. It holds the current policy and wins over this list. Its threat model: function options (formatters, event handlers) are the implementer's trusted code, while strings and data may come from end users, so the library filters them. Then check:

- HTML from options, data, lang strings or remote sources reaches the DOM only through `AST` or as plain text. No new `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write` with such content.
- URLs from options or data pass the AST attribute filter (`AST.filterUserAttributes`) before they reach an `href` or `src`. Code that checks a URL parses it instead of matching substrings.
- Changes to the AST allowlists (`allowedTags`, `allowedAttributes`, `allowedReferences`) or uses of `AST.bypassHTMLFiltering` widen what user HTML can do everywhere the AST is shared: justify and flag them.
- Objects built from option, data or JSON keys can't be polluted: use `merge` or `extend`, or skip `__proto__`, `constructor` and `prototype`, also inside dotted key paths.
- No `eval`, `new Function`, or string arguments to `setTimeout` and `setInterval`.
- Styles from options are set as style properties (`css()`), not concatenated into `style` attributes or `<style>` elements.
- No secrets, tokens, license keys or private URLs in code, tests or samples. No new third-party hosts.
- No new dependencies. No copied code, except MIT, BSD, Apache 2.0 or MPL code with a comment naming the license and author.
- Flag security-sensitive changes in the report, so that someone with security expertise reviews them.

## Iterate

- Verify each finding before acting on it; reviewers are sometimes wrong. Reject findings that would add code the task doesn't need.
- Fix what is confirmed, re-run the affected tests, and review the new diff.
- Stop when a round finds nothing, or after three rounds. Report what remains.

## Reviewer output

For each finding: severity (high, medium or low), `path:line`, the problem, and a suggested fix. If there are none, say "No findings".
