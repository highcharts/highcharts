$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Update the color axis'
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                minColor: '#FFFFFF',
                maxColor: '#000000'
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

    var blackAndWhite = true,
        log = true;

    $('#update-color').click(function () {
        var colorAxis = $('#container').highcharts().colorAxis[0];

        colorAxis.update({
            maxColor: blackAndWhite ? '#980043' : '#000000'
        });
        blackAndWhite = !blackAndWhite;
    });

    $('#update-linlog').click(function () {
        var colorAxis = $('#container').highcharts().colorAxis[0];

        colorAxis.update({
            type: log ? 'linear' : 'logarithmic'
        });
        log = !log;
    });
});