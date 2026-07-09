'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-react',
        docs: {
            include: ['react/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-react') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-react') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-react'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-react
description: Use to implement, configure, and troubleshoot Highcharts React applications from the bundled docs.
---

# Highcharts React

Use this for the \`@highcharts/react\` package: component setup, Chart/series-type components, chart elements (axes, legend, tooltip, title), modules (accessibility, boost, drilldown, exporting, stock tools), data handling, TypeScript, bundling, and Next.js integration.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer the documented component-based API over imperative chart mutation.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Stock, Maps, Gantt, or Morningstar, use the \`highcharts-stock\`, \`highcharts-maps\`, \`highcharts-gantt\`, or \`highcharts-morningstar\` skill.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/react/
`
    };
};
