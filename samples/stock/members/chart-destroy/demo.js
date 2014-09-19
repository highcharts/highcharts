$(function () {

    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]

    });

    $('#button').click(function () {
        $('#container').highcharts().destroy();
        $(this).attr('disabled', true);
    });
});