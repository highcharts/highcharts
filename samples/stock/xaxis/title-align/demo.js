$(function () {
    Highcharts.stockChart('container', {

        xAxis: {
            title: {
                text: 'Date/time',
                align: 'high'
            }
        },

        yAxis: {
            title: {
                text: 'USD to EUR',
                align: 'high',
                textAlign: 'left'
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});