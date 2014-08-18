$(function () {
    $('#container').highcharts('StockChart', {

        loading: {
            style: {
                backgroundColor: 'silver'
            },
            labelStyle: {
                color: 'white'
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

    var chart = $('#container').highcharts();
    $('#showloading').click(function () {
        chart.showLoading();
    });
    $('#hideloading').click(function () {
        chart.hideLoading();
    });
});