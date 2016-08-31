$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                width: 600,
                height: 500
            },

            title : {
                text : 'Set axis extremes'
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

    $('#setextremes').click(function () {
        var chart = $('#container').highcharts();

        chart.xAxis[0].setExtremes(740, 1180, false);
        chart.yAxis[0].setExtremes(-1730, -1470, false);
        chart.redraw();
    });
});