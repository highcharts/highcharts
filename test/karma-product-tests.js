// Map of products to subfolders of unit-tests to run
module.exports = {
    always: [
        'a11y'
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
        'polar',
        'tooltip'
    ],
    Stock: [
        'stock-tools',
        'stockchart',
        'indicators',
        'indicator-sma',
        'series-candlestick',
        'navigator',
        'rangeselector',
        'tooltip'
    ],
    Gantt: ['gantt'],
    Maps: [
        'maps',
        'coloraxis'
    ],
    Dashboards: [],
    Grid: [],
    A11y: [] // a11y tests already in always, but need the key to work as a "product"
};
