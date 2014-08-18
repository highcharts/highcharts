$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            plotBackgroundImage: 'http://www.highcharts.com/demo/gfx/skies.jpg'
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