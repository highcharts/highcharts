$(function () {

    // Load the data from the HTML table and tag it with an upper case name used for joining
    var data = [];
    Highcharts.data({
        table: document.getElementById('data'),
        startColumn: 1,
        startRow: 1,
        complete: function (options) {
            $.each(options.series[0].data, function () {
                data.push({
                    ucName: this[0],
                    value: this[1]
                });
            });
        }
    });

    // Get the map data and do some processing
    var mapData = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small']);    
    $.each(mapData, function (i, point) {
        var path = point.path,
            copy = { path: path };

        // This point has a square legend to the right
        if (path[1] === 1730) {

            // Identify the box
            Highcharts.seriesTypes.map.prototype.getBox.call(0, [copy]);

            // Place the center of the data label in the center of the point legend box
            point.middleX = ((path[1] + path[4]) / 2 - copy._minX) / (copy._maxX - copy._minX);
            point.middleY = ((path[2] + path[7]) / 2 - copy._minY) / (copy._maxY - copy._minY);

        }
        // Tag it for joining
        point.ucName = point.name.toUpperCase();
    });




    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'US unemployment rate 2014'
        },

        subtitle: {
            text: 'Small US map with data labels'
        },

        mapNavigation: {
            enabled: true,
            enableButtons: false
        },

        xAxis: {
            labels: {
                enabled: false
            }
        },

        colorAxis: {},

        series: [{
            mapData : mapData,
            data: data,
            joinBy: 'ucName',
            name: 'Unemployment rate per 2014',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.point.properties['hc-a2'];
                },
                style: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                valueSuffix: '%'
            }
        }, {
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small'], 'mapline'),
            color: 'silver'
        }]
    });
});