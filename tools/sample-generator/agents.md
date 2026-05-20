# Sample Generator Test Guidelines

This file describes when to run unit tests and when to add new tests for
`tools/sample-generator`.

For generator usage and output-format examples, see
`tools/sample-generator/README.md`.

Do not remove existing comments in code, unless explicitly requested
or required for correctness.

## Run unit tests when

- You change generator logic in `index.ts`.
- You change templates in `tpl/` (for example `tpl/demo.jsx`).
- You change output mode behavior (`classic` vs `react`).
- You change module import/setup behavior (for example `setHighcharts` logic).
- You change checksum inputs or generated file lists.
- You add, remove, or refactor type handlers in `type-handlers/`.

Run:

```bash
node --import tsx --test tools/sample-generator/tests/*.test.ts
```

## Add new tests when

- You add a new branch/condition in generation code.
- You fix a bug in generated output (add a regression test first or together
  with the fix).
- You add a new output token or template placeholder.
- You add support for new config options that affect generated files.
- You change expected imports, chart constructor/component selection, or
  dependency handling.

## What to test

- Assert output content, not implementation details.
- Cover both positive and negative cases when behavior is conditional.
- Keep fixtures minimal and deterministic.
- Prefer small focused tests over one large snapshot-style test.

## Before opening a PR

- Run the sample-generator unit tests.
- If generation behavior changed, run a focused smoke check:

```bash
npx gulp generate-samples --samples "highcharts/xaxis/type-linear" --outputMode react
```
