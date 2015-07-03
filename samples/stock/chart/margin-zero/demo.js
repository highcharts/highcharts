$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            margin: 0,
            borderWidth: 1
        },

        navigator: {
            top: 340,
            margin: 30
        },

        rangeSelector: {
            selected: 1
        },

        yAxis: {
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});