$(function () {
    var data = usdeur.splice(0, 500);

    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: data
        }]
    });

    $('#button').click(function () {
        var chart = $('#container').highcharts(),
            i = 0,
            series = chart.series[0];
        data = usdeur.splice(0, 100);

        for (i; i < data.length; i += 1) {
            series.addPoint(data[i], false, true);
        }
        chart.redraw();

        if (!usdeur.length) {
            this.disabled = true;
        }
    });
});