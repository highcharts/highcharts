$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Get axis extremes'
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });

    $('#getextremes').click(function () {
        var chart = $('#container').highcharts(),
            xExt = chart.xAxis[0].getExtremes(),
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
});