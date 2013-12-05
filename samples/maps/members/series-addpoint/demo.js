$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Remove Greenland from the map
        var greenland = Highcharts.extend(data[73], Highcharts.maps.world[72]);
        data.splice(73, 1);
        Highcharts.maps.world.splice(72, 1);

        
        // Initiate the chart
        $('#container').highcharts('Map', {

            title: {
                text: 'Add point'
            },
            
            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },
            series : [{
                data : data,
                mapData: Highcharts.maps.world,
                joinBy: 'code',
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

        // Activate the button
        $('#addpoint').click(function () {
            $('#container').highcharts().series[0].addPoint(greenland);
            $(this).attr('disabled', true);
        });
    });
});