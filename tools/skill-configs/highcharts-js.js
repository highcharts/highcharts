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
        skillMd: {
            description: 'Highcharts JS options, axes, series, data, styling, accessibility, exporting, and modules from the bundled docs.',
            title: 'Highcharts JS',
            scope: 'Use this for Highcharts JS work: installation, chart setup, options, axes, series, data, styling, common chart types, accessibility overview, export basics, and selected advanced features.',
            workflow: [
                'Start with `references/docs/index.md` and select every entry that matches the requested Highcharts JS feature.',
                'Read the selected docs before coding; the docs step is complete when every option, series type, or module you plan to use is covered by docs or named as an API/declaration lookup.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.'
            ],
            boundaries: [
                'For Stock, Maps, Gantt, React, or Morningstar, use the `highcharts-stock`, `highcharts-maps`, `highcharts-gantt`, `highcharts-react`, or `highcharts-morningstar` skill.',
                'For Dashboards, Grid, or Flutter, consult `docs/<area>/` directly or the live docs because no generated skill exists yet.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/',
                'API reference: https://api.highcharts.com/highcharts/'
            ]
        }
    };
};
