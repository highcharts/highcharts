# Agent guidance for `tools/docs-preview`

This workspace owns the Docusaurus preview app for Highcharts documentation. Treat it as the source for docs UI/theme/plugins/tests, while the Markdown content and sidebar data live in the repo-level `docs/` directory.

## Source ownership

- `tools/docs-preview/` owns the Docusaurus app, theme overrides, local MDX components, remark plugins, CSS, static assets, and Playwright docs-preview tests.
- `docs/` owns documentation content and `docs/sidebars.js`.
- `doc-builder` is a separate external repository, not a directory in this repo. It consumes this app for branch builds; do not duplicate this app into the external `doc-builder` repo or restore legacy embedded Docusaurus files there.

## Common commands

Run from the repository root:

```bash
npm run start --workspace=docs-preview
npm run build --workspace=docs-preview
npm run test:pw:docs
npm run lint-docs
```

If dependencies appear missing after a branch switch, install workspace dependencies from the root. Some local environments may have npm configured with `omit=dev`; use `npm install --include=dev --ignore-scripts` when you only need local validation dependencies and want to avoid running repo postinstall scripts.

## Validation expectations

- For theme/plugin/component changes, run `npm run build --workspace=docs-preview` and `npm run test:pw:docs`.
- For docs content or sidebar changes, also run `npm run lint-docs`.
- `docusaurus build` may pass while reporting existing broken-anchor warnings; do not treat those as newly introduced unless your change touched the linked pages or anchors.
- Keep `git diff --check` clean, especially workflow/script YAML and generated snippets.

## MDX and routing notes

- The docs route base is `/docs/`; preview links should use `/docs/<path>?branch=<encodedBranch>` when pointing at branch builds.
- Local MDX helpers are registered globally in `src/theme/MDXComponents/index.tsx`: `GridProBadge`, `GridProBanner`, and `CodeSwitchable`.
- `gridProPlugin.js` injects Grid Pro badges/banners from metadata; avoid duplicating those manually unless there is a specific rendering need.
- `iframePlugin.js` and the `removeIframeStyle` hook in `docusaurus.config.js` normalize iframe-heavy docs content for Docusaurus/MDX compatibility.

## Cross-repo caution

When finishing integration work with the external `doc-builder` repository, update and validate `highcharts/tools/docs-preview` first, then update the consuming `doc-builder` branch. Preserve the split: Highcharts owns preview UI and docs source; the external doc-builder repo owns fetch/build/deploy/server orchestration.
