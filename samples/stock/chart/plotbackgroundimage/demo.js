$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            plotBackgroundImage: 'http://www.highcharts.com/samples/graphics/skies.jpg'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur,
            color: '#202040'
        }]
    });
});