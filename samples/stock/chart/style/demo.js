$(function () {

    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'serif'
            }
        }
    });

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]

    });

});