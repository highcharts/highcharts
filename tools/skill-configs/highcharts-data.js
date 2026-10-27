'use strict';
const path = require('node:path');

module.exports = function (repoRoot) {
    return {
        name: 'highcharts-data',
        docs: {
            include: [
                'working-with-data/',
                'react/components/modules/data.md',
                'react/getting-started.md',
                'react/bundling-and-tree-shaking.md'
            ],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, 'skills', 'highcharts-data') }
        ],
        skillMd: {
            description: 'Highcharts core data configuration, loading, parsing, tabular mapping, compression, and live updates from the bundled docs.',
            title: 'Highcharts Data',
            scope: 'Use this for application work involving Highcharts series data, DataTables, the Data module, external data sources, custom preprocessing, data compression, and live updates.',
            workflow: [
                'Start with `references/docs/index.md` and select the matching working-with-data documentation.',
                'Read the selected docs before coding; finish when every data source, mapping, parser, or update method you plan to use is covered by documentation or an API lookup.',
                'Use direct `series.data` for ordinary series configuration, DataTables and `dataMapping` for structured or shared tabular data, and the Data module for CSV, HTML-table, or Google Spreadsheet sources.',
                'For dynamic data, choose declarative Data module polling or chart API updates according to the required level of control.',
                'Use the API reference only for exact option names, signatures, and defaults not covered by the selected documentation.',
                'In React, use the documented `Data` component and pass data API options as props.'
            ],
            boundaries: [
                'This skill covers core Highcharts data loading and processing, not Grid, Dashboards, Morningstar, or other product-specific connectors.',
                'For Stock-specific data grouping or product behavior, consult the relevant product documentation directly.',
                'For React wrapper behavior beyond the documented Data component, consult the React documentation directly.'
            ],
            references: [
                'Working with data: https://www.highcharts.com/docs/working-with-data/',
                'Data API reference: https://api.highcharts.com/highcharts/data',
                'React Data component: https://www.highcharts.com/docs/react/components/modules/data',
                'Highcharts React documentation: https://www.highcharts.com/docs/react/'
            ]
        }
    };
};
