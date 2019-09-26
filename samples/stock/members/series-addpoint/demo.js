var cursor = 500;
var chunk = 100;
var data = usdeur.slice(0, cursor);

var chart = Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: data
    }]
});

$('#button').click(function () {
    var i = 0,
        series = chart.series[0];
    data = usdeur.slice(cursor, cursor + chunk);
    cursor += chunk;
    for (i; i < data.length; i += 1) {
        series.addPoint(data[i], false);
    }
    chart.redraw();
});
