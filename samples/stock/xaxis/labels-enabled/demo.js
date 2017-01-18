$(function () {
    Highcharts.stockChart('container', {
        title: {
            text: 'xAxis.labels.enabled = false'
        },
        xAxis: {
            labels: {
                enabled: false
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