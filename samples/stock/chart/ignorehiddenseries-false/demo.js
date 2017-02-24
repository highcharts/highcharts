
Highcharts.stockChart('container', {

    chart: {
        ignoreHiddenSeries: false
    },

    rangeSelector: {
        selected: 1
    },

    legend: {
        enabled: true
    },

    series: [{
        name: 'GOOGL',
        data: GOOGL
    }, {
        name: 'MSFT',
        data: MSFT
    }]
});