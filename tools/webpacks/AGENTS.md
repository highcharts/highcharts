# Agent Instructions for Highcharts Webpack Build

This document gives AI agents context for working under `tools/webpacks/`.

## Webpack externals system

The externals system prevents utility code from being duplicated across secondary
bundles (modules like `exporting.js`, `data.js`, etc.). It works at the
**module level**, not per-export.

### Key files

- `externals.json` — Configuration of which modules to externalize and how.
- `externals.mjs` — Runtime logic that resolves externals during webpack builds.
- `highcharts.webpack.mjs` — Webpack config for Highcharts product bundles.
- `highcharts-es5.webpack.mjs` — Webpack config for Highcharts ES5 product bundles.
- `dashboards.webpack.mjs` — Webpack config for Dashboards product bundles.
- `grid.webpack.mjs` — Webpack config for Grid product bundles.

### How `externals.json` works

Each entry has three fields:

- **`files`**: Module paths (relative to `code/es-modules/`, no extension) to
  externalize.
- **`included`**: Bundle names where the file should be **bundled** (included),
  NOT externalized. If a bundle is absent from this list, the module IS
  externalized for that bundle.
- **`namespacePath`**: How to resolve the external on the global object.
  - `""` (empty) → root namespace (e.g., `Highcharts` or `Dashboards`).
  - `".{name}"` → `Namespace.FileName` (e.g., `Highcharts.Chart`).

### Critical rule: namespace exposure

When a module is externalized with `namespacePath: ""`, **every named export**
from that module must be attached to the product namespace object. Otherwise
secondary bundles will fail at runtime with `xxx is not a function`.

The namespace attachments live in the master files:

- `ts/masters/highcharts.src.ts` — `G.xxx = xxx` for Highcharts
- `ts/masters-dashboards/dashboards.src.ts` — `G.xxx = xxx` for Dashboards

If you add a new export to `Shared/Utilities.ts`, you **must** also add
`G.xxx = xxx` to every master file that externalizes `Shared/Utilities`.

### Multi-product impact

`externals.json` is shared across **all** products (Highcharts, Dashboards,
Grid). A change to externals affects every product's webpack build. When
modifying `externals.json`:

1. Check which products use the affected module.
2. Verify the namespace object in each product's master file exposes all
   required exports.
3. Rebuild and test each affected product.

### Build pipeline order

Always run `scripts-ts` before `scripts-webpack`. The webpack step reads
compiled JS from `code/es-modules/`, so stale compiled output causes confusing
failures.

```bash
# Highcharts
npx gulp scripts-ts
npx gulp scripts-webpack

# Dashboards
npx gulp scripts-ts --product Dashboards
npx gulp scripts-webpack --product Dashboards

# Grid
npx gulp scripts-ts --product Grid
npx gulp scripts-webpack --product Grid
```

### Testing

```bash
# Highcharts module tests
node --import tsx --test test/ts-node-unit-tests/tests/modules.test.ts

# Dashboards tests
node --import tsx --test "test/ts-node-unit-tests/tests/Dashboards/**"
```

### Common mistakes

- **Adding a file to `externals.json` without exposing its exports on the
  namespace** → runtime errors in secondary bundles.
- **Running `scripts-webpack` without `scripts-ts` first** → stale compiled
  output, misleading test failures.
- **Assuming externals work per-export** → they don't. Webpack externalizes
  entire modules. If even one export is missing from the namespace, it breaks.
- **Forgetting Dashboards/Grid** → `externals.json` is shared. A change for
  Highcharts affects all products.

## Validation scripts

Two scripts validate the externals configuration against actual build output
and source code.

### check-duplicates.mjs

Detects when an externalized module has been accidentally inlined into a
secondary webpack bundle.

```bash
node tools/webpacks/check-duplicates.mjs
```

**Prerequisites:** Build must have been run (`npx gulp scripts`) so that
`code/` contains `.js` bundles.

**What it does:** Reads `externals.json` and `externals-dashboards.json`, then
scans all secondary bundles (excluding masters) for module path strings that
indicate the module was inlined rather than externalized.

**Exit codes:** 0 = no duplicates found (or no build output); 1 = violations
detected.

### check-namespace-exposure.mjs

Verifies that all named exports from modules with `namespacePath: ""` are
exposed on the global namespace in the corresponding masters file.

```bash
node tools/webpacks/check-namespace-exposure.mjs
```

**Prerequisites:** None (reads TypeScript source directly).

**What it does:** For each externalized module with `namespacePath: ""`, parses
the TS source for named exports, then checks the masters file for matching
`G.xxx = xxx` assignments.

**Exit codes:** 0 = all exports exposed; 1 = missing exposures found.

### When to run

Run both scripts after:
- Adding or removing entries in `externals.json` / `externals-dashboards.json`
- Adding new exports to an externalized module
- Modifying masters files
