# Docs Preview

This workspace contains the Docusaurus site used to preview Highcharts documentation while drafting content. It shares Markdown and MDX files with the main project and adds tooling that mirrors the production docs build (custom remark plugins, shared UI components, and Highsoft-specific styling).

## Install Dependencies

```bash
npm install
```

This installs dependencies for every workspace, including the docs preview site.

## Useful npm Scripts

- Local development: `npm run start --workspace docs-preview`
  Starts the Docusaurus dev server on `http://localhost:3000`, hot-reloading when you edit docs, sidebar config, or component source.

- Production build: `npm run build --workspace docs-preview`
  Emits a static site into `tools/docs-preview/build`. Useful for CI output and verifying that MDX compiles without warnings.

- Serve build locally: `npm run serve --workspace docs-preview`
  Serves the contents of the `build` directory so you can validate the production bundle.

- Clear caches: `npm run clear --workspace docs-preview`
  Removes generated metadata (helpful when switching branches or Docusaurus versions).

Additional scripts (such as `write-translations` or `swizzle`) are available in `tools/docs-preview/package.json`.

## Content Pipeline

The preview site loads documentation from `docs/` with a couple of local enhancements:

- `tools/docs-preview/src/remark/gridProPlugin.js` injects Grid Pro badges and banners based on metadata.
- `tools/docs-preview/src/theme/MDXComponents/index.tsx` registers shared React components that MDX pages can use without explicit imports.
- `tools/docs-preview/src/css/custom.css` mirrors production styles so the preview matches the published docs.

When adding new docs content, keep these extensions in mind to stay consistent with the live site.

## Custom MDX Components

In addition to the default Docusaurus components, the preview site registers a few local MDX helpers that can be used directly in `.md` content:

- `GridProBadge`: Inline badge that renders the "Pro" label. Insert it where you need to flag a sentence or heading as Grid Pro only, for example `Some feature <GridProBadge />`.
- `GridProBanner`: Flow component that renders a banner at the top of a Grid Pro document. Typically added automatically by `gridProPlugin`, but you can place it manually with `<GridProBanner />` if needed.
- `CodeSwitchable`: Wraps multiple fenced code blocks and renders them as a tabbed code switcher. Use the component wrapper, then nest code blocks as children:

    ````mdx
    <CodeSwitchable>
      ```js
      // JavaScript example
      ```

      ```ts
      // TypeScript example
      ```
    </CodeSwitchable>
    ````

All three components are exported from `tools/docs-preview/src/theme/MDXComponents/index.tsx`, so they are available globally in the docs preview environment.
