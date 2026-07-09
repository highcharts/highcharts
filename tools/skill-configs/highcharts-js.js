'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-js',
        docs: {
            include: [
                'getting-started/',
                'chart-concepts/',
                'chart-and-series-types/',
                'working-with-data/',
                'chart-design-and-style/',
                'export-module/export-module-overview.md',
                'export-module/client-side-export.md',
                'accessibility/accessibility-module-feature-overview.md',
                'advanced-chart-features/boost-module.md',
                'advanced-chart-features/data-sorting.md',
                'advanced-chart-features/highcharts-typescript-declarations.md',
                'advanced-chart-features/internationalization.md',
                'advanced-chart-features/stacking-charts.md'
            ],
            exclude: [
                'react/',
                'stock/',
                'maps/',
                'gantt/',
                'dashboards/',
                'grid/'
            ]
        },
        destinations: [
            {
                path: path.join(repoRoot, '.agents', 'skills', 'highcharts-js')
            },
            {
                path: path.join(repoRoot, '.claude', 'skills', 'highcharts-js')
            },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-js'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-js
description: Use to implement, configure, and troubleshoot Highcharts JS charts from the bundled Highcharts markdown docs.
---

# Highcharts JS

Use this for Highcharts JS work: installation, chart setup, options, axes, series, data, styling, and common chart types. Includes accessibility overview, export basics, and selected advanced features.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For Stock, Maps, Gantt, or Morningstar, use the \`highcharts-stock\`, \`highcharts-maps\`, \`highcharts-gantt\`, or \`highcharts-morningstar\` skill.
 - For React, use the \`highcharts-react\` skill.
 - For Dashboards, Grid, or Flutter, consult \`docs/<area>/\` directly or the live docs — no generated skill exists yet.
- For exact option signatures, inspect local TypeScript declarations or the API reference after reading the copied tutorial docs.

## References

- Live docs: https://www.highcharts.com/docs/
- API reference: https://api.highcharts.com/highcharts/
`
    };
};
