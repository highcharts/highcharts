
var chart = Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});

$('#button').click(function () {
    var series = chart.series[0];
    if (series.visible) {
        series.hide();
    } else {
        series.show();
    }
});
