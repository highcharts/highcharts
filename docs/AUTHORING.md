# Writing documentation articles

This guide covers how to write and update articles in the Highcharts documentation.

## Current docs stack

The documentation source lives in `docs/`. The sidebar is maintained in `docs/sidebars.js`. The local Docusaurus preview app lives in `tools/docs-preview/` and currently uses Docusaurus 3, MDX 3 and React 19.

Useful commands from the repository root:

```bash
npm run start --workspace=docs-preview
npm run build --workspace=docs-preview
npm run lint-docs
npm run test:pw:docs
```

For a content-only change, run at least:

```bash
npm run build --workspace=docs-preview
npm run lint-docs
```

## Article structure

Start each article with front matter, then a clear title and a short introduction that explains what the reader will learn. If a Markdown `#` title is present, Docusaurus uses that as the rendered page title; if the article has no Markdown title, Docusaurus can render the front matter `title` instead.

```md
---
title: Custom technical indicators
description: Learn how to create custom technical indicators in Highcharts Stock.
---

# Custom technical indicators

This article explains how to create a custom technical indicator series in Highcharts Stock.
```

Useful front matter fields:

- `title`: Page title used by Docusaurus.
- `description`: Short description for search, link previews and summaries.
- `slug`: Optional URL override when the published URL should differ from the file path. Prefer an absolute docs path, for example `slug: /my/custom/path`.
- `sidebar_label`: Optional shorter label for the sidebar.
- `hide_table_of_contents`: Use only when the right-side table of contents is not useful.
- `toc_min_heading_level` and `toc_max_heading_level`: Use when the article needs unusual heading depth in the table of contents.

Use headings in order. Do not skip from `##` to `####`. Prefer descriptive headings such as `Install from npm` over vague headings such as `Usage`.

## MDX syntax

The docs use MDX, which combines Markdown with JSX. HTML-like tags are parsed as JSX, so keep these rules in mind:

- Use `className`, not `class`.
- JSX props must be valid JSX.
- Inline styles should be objects, for example `style={{ width: '100%' }}`, not HTML strings.
- Escape literal `{` and `<` when they are not code because they can trigger MDX expression or JSX parsing. Escape `>` when it appears at the beginning of a line and should not become a blockquote.
- Prefer fenced code blocks for examples that contain JSX or HTML.

The docs-preview build includes plugins that normalize some existing iframe-heavy content, but new content should still use valid MDX/JSX where practical.

## Links

Use descriptive link text. Avoid vague links such as `here`, `read more` or `click this`.

Good:

```md
Read more about [technical indicator series](https://www.highcharts.com/docs/stock/technical-indicator-series).
```

Avoid:

```md
To read more about technical indicators, click [here](https://www.highcharts.com/docs/stock/technical-indicator-series).
```

For internal documentation links, prefer relative Markdown links where practical, for example by linking the text `Installation` to the relative path `./installation.md`. Docusaurus validates relative links during the build, while hardcoded public URLs are not checked in the same way. If a page is moved or renamed, update `docs/sidebars.js` and any affected links.

## Images and embeds

Images and embedded examples need accessible descriptions.

Use meaningful image alt text:

```md
![Line chart showing monthly revenue increasing from January to June](revenue-chart.png)
```

Store article-specific images near the article that uses them and link with relative paths. This keeps assets easy to move with the article and lets Docusaurus resolve them during the build.

Avoid vague alt text:

```md
![chart](chart.png)
![image](image.png)
```

Every iframe should have a descriptive `title`:

```mdx
<iframe
  src="https://www.highcharts.com/samples/embed/highcharts/members/renderer-basic"
  title="Interactive demo of a basic line chart"
/>
```

Do not rely only on surrounding text to explain an image or embedded sample. Screen reader users should receive the same essential information.

## Code examples

Use backticks for inline code:

```md
Load `highcharts/esm/highcharts.js` from your application entry point.
```

Use fenced code blocks for longer examples. Always specify a language when practical:

````md
```js
Highcharts.chart('container', {
    series: [{ data: [1, 2, 3] }]
});
```
````

Use standard Docusaurus and Prism language identifiers such as `js`, `ts`, `tsx`, `jsx`, `html`, `css`, `json`, `bash`, `yaml` and `markdown`. For content that should not be highlighted, use a plain-text identifier such as `text` or `plaintext`. If a language does not highlight correctly, check the Docusaurus/Prism configuration before adding a new identifier.

Docusaurus supports code block metadata.

Add a code title:

````md
```js title="chart.js"
Highcharts.chart('container', {
    series: [{ data: [1, 2, 3] }]
});
```
````

Highlight lines:

````md
```js {2,4-6}
const chart = Highcharts.chart('container', {
    title: { text: 'Demo' },
    series: [{
        data: [1, 2, 3]
    }]
});
```
````

Show line numbers:

````md
```ts showLineNumbers
const options: Highcharts.Options = {
    series: [{ data: [1, 2, 3] }]
};
```
````

Prefer complete, copyable examples. If an example omits setup code, explain what has been omitted.

## Switchable examples

Use the global `CodeSwitchable` component when showing equivalent examples in multiple languages or frameworks.

`````mdx
<CodeSwitchable>
  ```js
  Highcharts.chart('container', {
      series: [{ data: [1, 2, 3] }]
  });
  ```

  ```ts
  const options: Highcharts.Options = {
      series: [{ data: [1, 2, 3] }]
  };
  ```
</CodeSwitchable>
`````

Use switchable blocks only when the examples are genuinely equivalent. If the examples explain different concepts, use normal headings instead.

## Tabs

Use Docusaurus tabs for longer framework-specific or platform-specific sections.

````mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="js"
  groupId="framework"
  values={[
    { label: 'JavaScript', value: 'js' },
    { label: 'React', value: 'react' }
  ]}
>
  <TabItem value="js" label="JavaScript">

  JavaScript-specific content.

  </TabItem>
  <TabItem value="react" label="React">

  React-specific content.

  </TabItem>
</Tabs>
````

For compatibility with all docs build paths, include `defaultValue`, `groupId` and `values` on `Tabs`. Markdown inside indented `TabItem` content can render literally in some build paths; use clean blank lines around Markdown content or JSX/HTML paragraphs and links for short tab introductions. Do not indent tab content with four spaces, because MDX can parse that as an indented code block.

## Admonitions

Use admonitions for callouts instead of ad hoc bold warning text.

```md
:::note
Useful background information.
:::

:::tip
A recommended approach.
:::

:::warning
Something users should be careful about.
:::

:::danger
A risky or breaking behavior.
:::
```

Use admonitions sparingly. If every paragraph is a warning, rewrite the section.

## Highcharts-specific MDX components

The docs preview registers these components globally:

- `CodeSwitchable`: Tabbed code examples.
- `GridProBadge`: Inline Grid Pro badge.
- `GridProBanner`: Grid Pro banner.

## Grid Pro tags and badges

Use the `grid-pro` front matter tag for articles that are Grid Pro-specific. The docs preview automatically adds a `GridProBanner` to pages with this tag.

```md
---
title: Conditional formatting
tags:
  - grid-pro
---
```

When adding a Grid Pro-specific article to `docs/sidebars.js`, use the `doc` helper from `docs/sidebar-utils.js` instead of a raw string. The helper reads the same `grid-pro` tag and adds the sidebar `Pro` badge metadata automatically while preserving the page's normal sidebar label:

```js
const { doc } = require('./sidebar-utils');

const sidebars = {
    docs: {
        Grid: [
            doc('grid/grid-key'),
            doc('grid/events')
        ]
    }
};
```

For pages without the `grid-pro` tag, `doc('path/to/page')` returns the same value as the raw string, so it is safe to use when you want the sidebar entry to follow the page metadata.

For inline Grid Pro badges, prefer the supported text markers when editing Markdown content:

```md
This feature is available in **grid-pro**.
This feature is available in __grid_pro__.
```

The docs preview converts those markers to `GridProBadge`. You can use `<GridProBadge />` directly if the marker syntax does not fit the sentence, but avoid adding `GridProBanner` manually unless there is a specific rendering need.

## Creating a new document

1. Add the Markdown file under the appropriate `docs/` subdirectory.
2. Add front matter with at least `title` and, where useful, `description`.
3. Add the document ID to `docs/sidebars.js` in the correct section.
4. Run the docs preview build and spellcheck.

Example sidebar entry:

```js
const sidebars = {
    docs: {
        Grid: [
            'grid/general',
            'grid/installation',
            'grid/new-article'
        ]
    }
};
```

## Sidebar categories

The Highcharts docs use a manually maintained sidebar. Existing shorthand categories look like this:

```js
{
    'Columns': [
        'grid/columns/index',
        'grid/columns/styling-and-theming'
    ]
}
```

Docusaurus also supports explicit category objects:

```js
{
    type: 'category',
    label: 'Columns',
    collapsed: false,
    items: [
        'grid/columns/index',
        'grid/columns/styling-and-theming'
    ]
}
```

Match the surrounding style unless there is a reason to use the explicit form.

## URL changes

If an article should publish at a custom URL without moving the file, use `slug` front matter:

```md
---
title: My article
slug: /my/custom/path
---
```

If you rename or move a file, update `docs/sidebars.js` and any affected links. For already-published URLs, coordinate redirects before merging so external links do not break.

## Write for search, snippets and summaries

The docs preview generates LLM-friendly output. Articles should therefore be easy to summarize and quote:

- Start with a concise summary paragraph.
- Define product-specific terms before using them heavily.
- Use descriptive headings.
- Prefer complete examples that can be copied and adapted.
- Avoid vague references such as `above`, `below` and `here`.

## Validation checklist

Before opening a pull request, check:

- [ ] The article has useful front matter.
- [ ] The sidebar entry is correct, if the page should appear in the sidebar.
- [ ] Images have meaningful alt text.
- [ ] Iframes have descriptive titles.
- [ ] Code blocks have language identifiers.
- [ ] Tabs and `CodeSwitchable` examples render correctly in docs preview.
- [ ] `npm run build --workspace=docs-preview` passes or any unrelated existing warnings are documented.
- [ ] `npm run lint-docs` passes.
