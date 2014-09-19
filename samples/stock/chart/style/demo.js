$(function () {

    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'serif'
            }
        }
    });

    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]

    });

});