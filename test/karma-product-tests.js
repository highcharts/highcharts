// Map of products to subfolders of unit-tests to run
module.exports = {
    always: [
        'accessibility',
        'tooltip'
    ],
    Core: [
        'axis',
        'chart',
        'exporting',
        'point',
        'series',
        'series-line',
        'series-column',
        'series-pie',
        'series-scatter',
        'highcharts',
        'styled-mode',
        'legend',
        'polar'
    ],
    Stock: [
        'stock-tools',
        'stockchart',
        'indicators',
        'indicator-sma',
        'series-candlestick',
        'navigator',
        'rangeselector'
    ],
    Gantt: ['gantt'],
    Maps: [
        'maps',
        'coloraxis',
        'mapview'
    ],
    Dashboards: []
};
