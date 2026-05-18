# Agent Instructions for Highcharts Documentation

This directory contains Highcharts documentation content. Treat files here as user-facing documentation unless the file is explicitly contributor-only, such as `AUTHORING.md` or this file.

## Source ownership

- `docs/` owns documentation articles and `docs/sidebars.js`.
- `tools/docs-preview/` owns the Docusaurus app, theme overrides, local MDX components, remark plugins, CSS and docs-preview tests.
- Do not duplicate Docusaurus app files into `docs/`.

## Authoring guidance

Follow `docs/AUTHORING.md` when creating or editing documentation articles. In particular:

- Use valid Docusaurus 3 / MDX 3 syntax.
- Add useful front matter, normally at least `title` and, for substantial articles, `description`.
- Use descriptive headings and link text.
- Use meaningful image alt text and descriptive iframe `title` attributes.
- Use fenced code blocks with language identifiers.
- Use `CodeSwitchable` for equivalent switchable code examples.
- Use `grid-pro` front matter tags for Grid Pro-specific articles and the supported badge markers from `docs/AUTHORING.md` for inline Grid Pro badges.
- Use Docusaurus `Tabs` / `TabItem` for longer framework-specific sections, with explicit `defaultValue`, `groupId` and `values` props.
- Keep `docs/sidebars.js` in sync when adding, moving or renaming pages.

## Validation

For docs content or sidebar changes, run from the repository root:

```bash
npm run build --workspace=docs-preview
npm run lint-docs
```

For docs-preview UI, theme, component or plugin behavior that affects pages in this directory, also run:

```bash
npm run test:pw:docs
```

`docusaurus build` may report existing broken-anchor warnings. Do not treat them as newly introduced unless the current change touched the linked pages or anchors. Keep `git diff --check` clean.

## URL and routing notes

- The docs route base is `/docs/`.
- Use `slug` front matter when the published URL should differ from the file path.
- If a published URL changes, coordinate redirects before merging.
- Branch preview links should use `/docs/<path>?branch=<encodedBranch>` when pointing at branch builds.
