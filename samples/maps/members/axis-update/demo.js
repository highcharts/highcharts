
var chart;
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    chart = Highcharts.mapChart('container', {

        title: {
            text: 'Update the color axis'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            minColor: '#FFFFFF',
            maxColor: '#000000',
            tickPixelInterval: 100
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

var blackAndWhite = true,
    log = true;

$('#update-color').click(function () {
    var colorAxis = chart.colorAxis[0];

    colorAxis.update({
        maxColor: blackAndWhite ? '#980043' : '#000000'
    });
    blackAndWhite = !blackAndWhite;
});

$('#update-linlog').click(function () {
    var colorAxis = chart.colorAxis[0];

    colorAxis.update({
        type: log ? 'linear' : 'logarithmic'
    });
    log = !log;
});
