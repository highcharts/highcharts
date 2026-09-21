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
        skillMd: {
            description: 'Highcharts Maps GeoJSON, TopoJSON, mapView, projections, map series, tiledwebmap, tilemap, flowmap, color axis, and map navigation from the bundled docs.',
            title: 'Highcharts Maps',
            scope: 'Use this for Highcharts Maps work: map series, mappoint, mapline, mapbubble, flowmap, tilemap, geoheatmap, tiled web map, projections, GeoJSON/TopoJSON, color axis, and map navigation.',
            workflow: [
                'Start with `references/docs/index.md` and select every entry that matches the requested Maps feature.',
                'Read the selected docs before coding; the docs step is complete when every map source, projection, series type, or navigation feature you plan to use is covered by docs or named as an API/declaration lookup.',
                'Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.',
                'Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.'
            ],
            boundaries: [
                'For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-map chart setup, use the `highcharts-js` skill.',
                'For Stock, Gantt, React wrapper work, or Morningstar, use the `highcharts-stock`, `highcharts-gantt`, `highcharts-react`, or `highcharts-morningstar` skill.',
                'For Dashboards or Grid, consult `docs/<area>/` directly or the live docs.'
            ],
            references: [
                'Live docs: https://www.highcharts.com/docs/maps/',
                'API reference: https://api.highcharts.com/highmaps/'
            ]
        }
    };
};
