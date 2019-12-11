/**
 * Config file for documentation generator.
 */
module.exports = {
    /* List of docs that should be ignored when checking commit for docs consistency
     * Refer to doc by relative path without extension, i.e.: 'maps/drilldown'
     */
    unlisted: [
        'advanced-chart-features/advanced-chart-features',
        'advanced-chart-features/data-sorting',
        'advanced-chart-features/marker-clusters',
        'chart-and-series-types/chart-and-series-types',
        'chart-and-series-types/dumbbell-series',
        'chart-and-series-types/lollipop-series',
        'chart-and-series-types/radial-bar-chart',
        'chart-and-series-types/venn-diagram',
        'chart-concepts/accessibility',
        'chart-concepts/chart-concepts',
        'chart-design-and-style/chart-design-and-style',
        'export-module/export-module',
        'export-module/legacy-export-servers',
        'export-module/setting-up-the-server-3',
        'export-module/setting-up-the-server-old',
        'frequently-asked-questions/frequently-asked-questions',
        'getting-started/getting-started',
        'highcharts-5-competition/food-and-agriculture-data-extraction-tutorial',
        'highcharts5-competition/food-and-agriculture-data-extraction-tutorial',
        'maps/drilldown',
        'working-with-data/working-with-data'
    ],
    /* List of old paths that should be redirected */
    redirects: [
        { 'chart-and-series-types/networkgraph': 'chart-and-series-types/network-graph' }
    ]
};
