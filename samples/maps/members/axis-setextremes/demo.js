
var chart;
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    chart = Highcharts.mapChart('container', {

        chart: {
            width: 600,
            height: 500
        },

        title: {
            text: 'Set axis extremes'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});

$('#setextremes').click(function () {
    chart.xAxis[0].setExtremes(4800, 4800, false);
    chart.yAxis[0].setExtremes(-9300, -7500, false);
    chart.redraw();
});
