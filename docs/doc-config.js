/**
 * Config file for documentation generator.
 */
module.exports = {
    /* List of docs that should be ignored when checking commit for docs consistency
     * Refer to doc by relative path without extension, i.e.: 'maps/drilldown'
     */
    unlisted: [
        'export-module/legacy-export-servers'
    ],
    /* List of old paths that should be redirected */
    redirects: [
        { from: 'chart-and-series-types/networkgraph', to: 'chart-and-series-types/network-graph' },
        { from: 'chart-and-series-types/technical-indicator-series', to: 'stock/technical-indicator-series' },
        { from: 'advanced-chart-features/highcharts-typescript-beta', to: 'advanced-chart-features/highcharts-typescript-declarations' },
        { from: 'maps/create-custom-maps-for-highmaps', to: 'maps/create-custom-maps' },
        { from: 'stock/understanding-highstock', to: 'stock/understanding-highcharts-stock' },
        { from: 'getting-started/compatibility', to: 'getting-started/system-requirements' }
    ]
};
