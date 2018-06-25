
var chart;
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    chart = Highcharts.mapChart('container', {

        title: {
            text: 'Get axis extremes'
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

$('#getextremes').click(function () {
    var xExt = chart.xAxis[0].getExtremes(),
        yExt = chart.yAxis[0].getExtremes(),
        colorExt = chart.colorAxis[0].getExtremes();

    chart.setTitle(null, {
        text: '<b>X axis</b><br>' +
            'min: ' + xExt.min + ', max: ' + xExt.max + '<br>' +
            'dataMin: ' + xExt.dataMin + ', dataMax: ' + xExt.dataMax + '<br>' +
            '<b>Y axis</b><br>' +
            'min: ' + yExt.min + ', max: ' + yExt.max + '<br>' +
            'dataMin: ' + yExt.dataMin + ', dataMax: ' + yExt.dataMax + '<br>' +
            '<b>Color axis</b><br>' +
            'min: ' + colorExt.min + ', max: ' + colorExt.max + '<br>' +
            'dataMin: ' + colorExt.dataMin + ', dataMax: ' + colorExt.dataMax + '<br>',
        align: 'left',
        floating: true,
        y: 250
    });
});
