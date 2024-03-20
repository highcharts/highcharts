const chart = Highcharts.stockChart('container', {
    chart: {
        type: 'line',
        width: 400
    },
    rangeSelector: {
        selected: 2
    },
    title: {
        text: 'RangeSelector dropdown demo'
    },
    tooltip: {
        valueSuffix: '°C'
    },
    series: [{
        name: 'Temperatures',
        data: [1, 2, 3, 4, 3, 4, 32, 4, 324, 32, 4, 32, 4, 1]
    }]
});
