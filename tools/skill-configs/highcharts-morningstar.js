'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-morningstar',
        docs: {
            include: ['morningstar/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-morningstar') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-morningstar') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-morningstar'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-morningstar
description: Use to implement and configure Highcharts Morningstar connectors (standard and DWS variants) from the bundled docs.
---

# Highcharts Morningstar Connectors

Use this for Morningstar connector work: time series (price, OHLCV, growth, returns, dividends, ratings), screeners, risk score, goal analysis, x-ray, security compare, and regulatory news. Covers both standard and DWS connector variants — start with \`references/docs/morningstar/morningstar.md\` to pick the right one.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read \`morningstar/morningstar.md\` first to understand standard vs DWS connector variants.
3. Follow the connector constructor → load → table-mapping pattern shown in the docs.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Highcharts Stock chart types (candlestick, OHLC, navigator, indicators), use the \`highcharts-stock\` skill.
- For Maps or Gantt, use the \`highcharts-maps\` or \`highcharts-gantt\` skill.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/morningstar/
`
    };
};
