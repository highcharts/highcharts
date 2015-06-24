$(function () {

    var H = Highcharts,
        map = H.maps['countries/us/us-all'],
        chart;


    // Add series with state capital bubbles
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=us-capitals.json&callback=?', function (json) {
        var data = [];
        $.each(json, function () {
            this.z = this.population;
            data.push(this);
        });

        $('#container').highcharts('Map', {

            title: {
                text: 'Highmaps lat/lon demo'
            },

            tooltip: {
                formatter: function () {
                    return this.point.capital + ', ' + this.point.parentState + '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon + '<br>Population: ' + this.point.population;
                },
                crosshairs: [{
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }, {
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }]
            },

            mapNavigation: {
                enabled: true
            },

            series: [{
                name: 'Basemap',
                mapData: map,
                borderColor: '#606060',
                nullColor: 'rgba(200, 200, 200, 0.2)',
                showInLegend: false
            }, {
                name: 'Separators',
                type: 'mapline',
                data: H.geojson(map, 'mapline'),
                color: '#101010',
                enableMouseTracking: false
            }, {
                type: 'mapbubble',
                dataLabels: {
                    enabled: true,
                    format: '{point.capital}'
                },
                name: 'Cities',
                data: data,
                maxSize: '12%',
                color: H.getOptions().colors[0]
            }]
        });

        chart = $('#container').highcharts();
    });

    // Display custom label with lat/lon next to crosshairs
    $('#container').mousemove(function (e) {
        var position;

        if (chart) {
            if (!chart.lab) {
                chart.lab = chart.renderer.text('', 0, 0)
                    .attr({
                        zIndex: 5
                    })
                    .css({
                        color: '#505050'
                    })
                    .add();
            }

            e = chart.pointer.normalize(e);
            position = chart.fromPointToLatLon({
                x: chart.xAxis[0].toValue(e.chartX),
                y: chart.yAxis[0].toValue(e.chartY)
            });

            chart.lab.attr({
                x: e.chartX + 5,
                y: e.chartY - 22,
                text: 'Lat: ' + position.lat.toFixed(2) + '<br>Lon: ' + position.lon.toFixed(2)
            });
        }
    });

    $('#container').mouseout(function () {
        if (chart && chart.lab) {
            chart.lab.destroy();
            chart.lab = null;
        }
    });
});
