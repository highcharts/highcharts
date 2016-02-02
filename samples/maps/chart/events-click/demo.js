$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                events: {
                    click: function (e) {
                        var x = Math.round(e.xAxis[0].value),
                            y = Math.round(e.yAxis[0].value),
                            latLon = this.fromPointToLatLon({ x: x, y: y });

                        this.get('clicks').addPoint({
                            x: x,
                            y: y,
                            name: '[N' + latLon.lat.toFixed(2) + ', E' + latLon.lon.toFixed(2) + ']'
                        });
                    }
                }
            },

            title: {
                text : 'Add points on chart click'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series: [{
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
            }, {
                type: 'mappoint',
                id: 'clicks',
                name: 'Clicks',
                data: []
            }]
        });
    });
});