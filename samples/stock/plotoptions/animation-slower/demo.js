$(function () {
    $('#container').highcharts('StockChart', {

        plotOptions: {
            series: {
                animation: {
                    duration: 2000
                }
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