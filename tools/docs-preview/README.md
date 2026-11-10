# Documentation preview

This preview uses [Docusaurus](https://docusaurus.io/) and is an npm workspace.
Run these commands from the repository root. Dependencies and overrides are
managed by the root `package.json` and `package-lock.json`.

Install dependencies:

```sh
npm ci
```

Start the local development server:

```sh
npm run preview-docs
```

Build the static preview in `tools/docs-preview/build`:

```sh
npm run build --workspace=docs-preview
```
