$(function () {
    Highcharts.stockChart('container', {
        title: {
            text: 'chart.type is set to \'areaspline\''
        },
        chart: {
            type: 'areaspline'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur,
            threshold: null // default is 0
        }]
    });
});