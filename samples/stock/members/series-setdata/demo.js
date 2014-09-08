$(function () {
    $('#container').highcharts('StockChart', {

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
        chart.series[0].setData(ADBE);
        this.disabled = true;
    });
});