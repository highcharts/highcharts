# Agent Instructions for Highcharts Tools

This document gives AI agents context for working under `tools/`.

## Gulp dist example indexes

`tools/gulptasks/dist-examples.js` builds package-local examples under
`build/dist/<product>/examples/` and writes the package index page at
`build/dist/<product>/index.html`.

The package index content is generated locally by
`tools/gulptasks/lib/demoIndex.js`. Do not reintroduce a dependency on an
externally generated `sidebar.html` or on `highcharts-demo-manager` output for
this release/dist path.

The index generator reads:

- `samples/demo-config.js` for product categories and product tag filters.
- `samples/<product>/demo/<sample>/demo.details` for sample names, tags,
  categories and per-category priority.

Important behavior:

- Supported package product paths are explicit in `PRODUCT_CONFIG` in
  `tools/gulptasks/lib/demoIndex.js`.
- Grid Lite and Grid Pro have separate source trees:
  - `grid-lite` -> `samples/grid-lite/demo`
  - `grid-pro` -> `samples/grid-pro/demo`
- `demo.details` is parsed as YAML with `js-yaml`'s `safeLoad` API for
  compatibility with the version used by this repo.
- Missing `demo.details`, missing `name`, missing `tags`, or missing
  `categories` means that demo is skipped for the index.
- Malformed YAML or malformed category/config metadata should fail the build.
- Categories present in a demo but not configured for the product in
  `samples/demo-config.js` are ignored, not treated as errors.
- The generated index is static HTML with category headings and package-local
  links like `examples/<demo>/index.html`; there is no sidebar toggle JS in the
  package index page.

When changing this area, run the focused tests:

```bash
node --test tools/gulptasks-tests/demo-index.test.mjs \
  tools/gulptasks-tests/dist-examples.test.mjs \
  tools/gulptasks-tests/dashboard-dist.test.mjs
```

For packaging verification, also check generated index output:

```bash
npx gulp dist-clean
npx gulp dist-examples --product Highcharts
npx gulp dist-examples --product Dashboards
npx gulp dist-examples --product Grid
```

Then verify that the generated `build/dist/*/index.html` files contain
package-local `href="examples/.../index.html"` links and the expected category
headings for each product.

## Sample generator checksum caveat

The repo pre-commit path runs `npm run test:precommit`, which starts with
`npx gulp test --modified`. That task performs a repo-wide sample generator
consistency check before applying modified-test filtering.

If it fails with `generated samples not in sync with config.ts` while the change
did not touch `samples/`, check whether ignored `.generated-checksum` files are
missing and generated sample files have newer mtimes than `config.ts`. This can
be local workspace mtime drift rather than a problem with the current change.
Record the exact failing command and run the focused verification for the files
you changed before bypassing hooks.
