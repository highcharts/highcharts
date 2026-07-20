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
        skillMd: {
            description: 'Highcharts Morningstar standard and DWS connectors, InvestmentsConnector, time series, screeners, risk, goal analysis, x-ray, security compare, and regulatory news from the bundled docs.',
            title: 'Highcharts Morningstar Connectors',
            scope: 'Use this for Morningstar connector work: standard and DWS variants, InvestmentsConnector, time series, screeners, risk score, goal analysis, x-ray, security compare, and regulatory news.',
            workflow: [
                'Start with `references/docs/index.md` and `references/docs/morningstar/morningstar.md` to choose the standard or DWS connector type.',
                'Read every selected connector doc before coding; the docs step is complete when the connector variant, constructor options, load call, and table mapping you plan to use are covered by docs or named as an API/declaration lookup.',
                'If the request mentions DWS, Direct Web Services, or InvestmentsConnector, read `references/docs/morningstar/dws-connector.md` after the overview.',
                'Follow the connector constructor → load → table-mapping pattern shown in the docs.'
            ],
            boundaries: [
                'For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-connector chart setup, use the `highcharts-js` skill.',
                'For Highcharts Stock chart types such as candlestick, OHLC, navigator, indicators, and data grouping, use the `highcharts-stock` skill.',
                'For Maps, Gantt, or React wrapper work, use the `highcharts-maps`, `highcharts-gantt`, or `highcharts-react` skill.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/morningstar/'
            ]
        }
    };
};
