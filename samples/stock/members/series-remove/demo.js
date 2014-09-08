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
        var chart = $('#container').highcharts();
        chart.series[0].remove();
        this.disabled = true;

    });
});