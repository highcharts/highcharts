$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'Chart title',
            floating: true,
            align: 'left',
            x: 75,
            y: 70
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