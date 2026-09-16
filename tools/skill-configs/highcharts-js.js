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
                'chart-design-and-style/',
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
            description: 'Highcharts JS chart setup, options, axes, series, styling, common chart types, baseline accessibility, and selected advanced features from the bundled docs.',
            title: 'Highcharts JS',
            scope: 'Use this for everyday Highcharts JS work: installation, chart setup, options, axes, series, basic series.data configuration, styling, common chart types, accessibility overview, and selected advanced features.',
            workflow: [
                'Start with `references/docs/index.md` and select the entries matching the requested Highcharts JS feature.',
                'Read the selected core docs before coding; for basic charts, begin with chart setup, chart concepts, axes, series, and styling.',
                'Use `highcharts-data`, `highcharts-accessibility`, or `highcharts-exporting` for detailed data workflows, accessibility and sonification, or exporting tasks.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.'
            ],
            boundaries: [
                'Basic `series.data` setup remains in this skill; use `highcharts-data` for DataTables, CSV or other data sources, data transformation, and advanced data workflows.',
                'Use `highcharts-accessibility` for detailed accessibility configuration, assistive technology support, keyboard navigation, and sonification. This skill retains the accessibility feature overview for baseline awareness.',
                'Use `highcharts-exporting` for exporting-module configuration, client-side export, and related export workflows.',
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
