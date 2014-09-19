$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {


        // Remove Greenland from the map and the data set
        var mapDataIndex,
            dataIndex,
            mapData = Highcharts.geojson(Highcharts.maps['custom/world']),
            greenland;

        for (mapDataIndex = 0; mapDataIndex < mapData.length; mapDataIndex += 1) {
            if (mapData[mapDataIndex].properties['iso-a2'] === 'GL') {
                break;
            }
        }
        for (dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
            if (data[dataIndex].code === 'GL') {
                break;
            }
        }

        greenland = Highcharts.extend(data[dataIndex], mapData[mapDataIndex]); // for use below
        data.splice(dataIndex, 1);
        mapData.splice(mapDataIndex, 1);


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
                mapData: mapData,
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

        // Activate the button
        $('#addpoint').click(function () {
            $('#container').highcharts().series[0].addPoint(greenland);
            $(this).attr('disabled', true);
        });
    });
});