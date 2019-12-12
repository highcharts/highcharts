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
        { 'chart-and-series-types/networkgraph': 'chart-and-series-types/network-graph' }
    ]
};
