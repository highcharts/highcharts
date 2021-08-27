const data = [
    [1566221400000, 10, 11, 8, 9],
    [1566307800000, 10, 12, 8, 9],
    [1566394200000, 10, 12, 8, 8.5],
    [1566480600000, 7, 11, 6, 8]
];

Highcharts.stockChart('container', {
    rangeSelector: {
        selected: 1
    },
    navigator: {
        series: {
            color: Highcharts.getOptions().colors[0]
        }
    },
    series: [{
        type: 'hollowcandlestick',
        name: 'Hollow Candlestick',
        data: data
    }]
});
