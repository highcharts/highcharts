'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-stock',
        docs: {
            include: ['stock/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-stock') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-stock') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-stock'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: {
            description: 'Highcharts Stock navigator, range selector, indicators, OHLC, candlestick, flags, data grouping, compare mode, and stock tools from the bundled docs.',
            title: 'Highcharts Stock',
            scope: 'Use this for Highcharts Stock work: candlestick, OHLC, HLC, flags, technical indicators, navigator, range selector, data grouping, compare mode, and stock tools.',
            workflow: [
                'Start with `references/docs/index.md` and select every entry that matches the requested Stock feature.',
                'Read the selected docs before coding; the docs step is complete when every Stock feature, series type, or module you plan to use is covered by docs or named as an API/declaration lookup.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.'
            ],
            boundaries: [
                'For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-Stock chart setup, use the `highcharts-js` skill.',
                'For Morningstar data connectors, use the `highcharts-morningstar` skill.',
                'For Maps, Gantt, or React wrapper work, use the `highcharts-maps`, `highcharts-gantt`, or `highcharts-react` skill.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/stock/',
                'API reference: https://api.highcharts.com/highstock/'
            ]
        }
    };
};
