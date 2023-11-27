// Map of products to subfolders of unit-tests to run
module.exports = {
    always: ['accessibility'],
    Core: [
        'axis',
        'chart',
        'exporting',
        'point',
        'series-line',
        'series-column',
        'series-pie',
        'tooltip',
        'highcharts',
        'styled-mode'
    ],
    Stock: [
        'stock-tools',
        'stockchart',
        'indicators',
        'indicator-*'
    ],
    Gantt: ['gantt'],
    Maps: ['maps'],
    Dashboards: []
};
