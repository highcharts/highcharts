$(function () {
    $('#container').highcharts('StockChart', {

        scrollbar: {
            enabled: true
        },

        navigator: {
            enabled: true
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'MSFT',
            data: MSFT
        }]
    });

    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.addSeries({
            name: 'ADBE',
            data: ADBE
        });
        $(this).attr('disabled', true);
    });
});