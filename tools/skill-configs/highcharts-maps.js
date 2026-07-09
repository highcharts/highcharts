'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-maps',
        docs: {
            include: ['maps/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-maps') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-maps') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-maps'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-maps
description: Use to implement, configure, and troubleshoot Highcharts Maps from the bundled docs.
---

# Highcharts Maps

Use this for Highcharts Maps work: map series, mappoint, mapline, mapbubble, flowmap, tilemap, geoheatmap, tiled web map, projections, GeoJSON/TopoJSON, color axis, and map navigation.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Stock, Gantt, or Morningstar, use the \`highcharts-stock\`, \`highcharts-gantt\`, or \`highcharts-morningstar\` skill.
- For Dashboards or Grid, consult \`docs/<area>/\` directly or the live docs.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/maps/
- API reference: https://api.highcharts.com/highmaps/
`
    };
};
