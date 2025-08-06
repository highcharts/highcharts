/**
 * Config file for documentation generator.
 */
module.exports = {
    /* List of docs that should be ignored when checking commit for docs consistency
     * Refer to doc by relative path without extension, i.e.: 'maps/drilldown'
     */
    unlisted: [
        'export-module/deprecated-async-option',
        'export-module/legacy-export-servers',
        'maps/latlon'
    ],
    /* List of old paths that should be redirected */
    redirects: [
        { from: 'chart-and-series-types/networkgraph', to: 'chart-and-series-types/network-graph' },
        { from: 'chart-and-series-types/technical-indicator-series', to: 'stock/technical-indicator-series' },
        { from: 'advanced-chart-features/highcharts-typescript-beta', to: 'advanced-chart-features/highcharts-typescript-declarations' },
        { from: 'advanced-chart-features/axis-resizer', to: 'stock/axis-resizer' },
        { from: 'maps/create-custom-maps-for-highmaps', to: 'maps/create-custom-maps' },
        { from: 'stock/understanding-highstock', to: 'stock/understanding-highcharts-stock' },
        { from: 'getting-started/compatibility', to: 'getting-started/system-requirements' },
        { from: 'getting-started/how-to-create-custom-highcharts-files', to: 'getting-started/how-to-create-custom-highcharts-packages' },
        { from: 'chart-and-series-types/packed-bubble-charts', to: 'chart-and-series-types/packed-bubble' },
        { from: 'chart-concepts/navigator', to: 'stock/navigator' },
        { from: 'chart-concepts/range-selector', to: 'stock/range-selector' },
        { from: 'chart-concepts/accessibility', to: 'accessibility/accessibility-module' },
        { from: 'accessibility/sonification', to: 'sonification/getting-started' },
        { from: 'datagrid/general', to: 'grid/general' },
        { from: 'datagrid/installation', to: 'grid/installation' },
        { from: 'datagrid/understanding-datagrid', to: 'grid/understanding-grid' },
        { from: 'datagrid/columns', to: 'grid/columns' },
        { from: 'datagrid/header', to: 'grid/header' },
        { from: 'datagrid/events', to: 'grid/events' },
        { from: 'datagrid/performance', to: 'grid/performance' },
        { from: 'datagrid/style-by-css', to: 'grid/theming/theming' },
        { from: 'datagrid/accessibility', to: 'grid/accessibility' },
        { from: 'datagrid/datagrid-v2-migration', to: 'dashboards/grid-migration' },
        { from: 'datagrid/datagrid-with-angular', to: 'grid/wrappers/grid-with-angular' },
        { from: 'datagrid/datagrid-with-react', to: 'grid/wrappers/grid-with-react' },
        { from: 'datagrid/datagrid-with-vue', to: 'grid/wrappers/grid-with-vue' },
        { from: 'dashboards/dashboards-with-angular', to: 'dashboards/wrappers/dashboards-with-angular' },
        { from: 'dashboards/dashboards-with-react', to: 'dashboards/wrappers/dashboards-with-react' },
        { from: 'dashboards/dashboards-with-vue', to: 'dashboards/wrappers/dashboards-with-vue' },
        // Special case for xmlns schema in Map Collection
        { from: 'mc', to: 'maps/map-collection#map-properties' }
    ]
};
