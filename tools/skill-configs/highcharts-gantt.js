'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-gantt',
        docs: {
            include: ['gantt/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-gantt') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-gantt') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-gantt'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: {
            description: 'Highcharts Gantt task configuration, dependencies, axis grid, grouping, milestones, and project schedule charts from the bundled docs.',
            title: 'Highcharts Gantt',
            scope: 'Use this for Highcharts Gantt work: task configuration, dependencies, axis grids, grouping tasks, milestones, and project schedule charts.',
            workflow: [
                'Start with `references/docs/index.md` and select every entry that matches the requested Gantt feature.',
                'Read the selected docs before coding; the docs step is complete when every task option, dependency, grid, grouping, or milestone behavior you plan to use is covered by docs or named as an API/declaration lookup.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.'
            ],
            boundaries: [
                'For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-Gantt chart setup, use the `highcharts-js` skill.',
                'For Stock, Maps, React wrapper work, or Morningstar, use the `highcharts-stock`, `highcharts-maps`, `highcharts-react`, or `highcharts-morningstar` skill.',
                'For Dashboards or Grid, consult `docs/<area>/` directly or the live docs.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/gantt/',
                'API reference: https://api.highcharts.com/gantt/'
            ]
        }
    };
};
