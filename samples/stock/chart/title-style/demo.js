$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'This is the chart title',
            style: {
                color: '#FF00FF',
                fontWeight: 'bold'
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