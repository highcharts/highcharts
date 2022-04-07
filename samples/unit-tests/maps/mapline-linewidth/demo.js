QUnit.test(
    'Setting lineWidth of mapline series should work in all browsers (#5201)',
    function (assert) {
        var chart = Highcharts.mapChart('container', {
            series: [
                {
                    type: 'mapline',
                    data: Highcharts.geojson(
                        Highcharts.maps['countries/us/custom/us-small'],
                        'mapline'
                    ),
                    lineWidth: 30
                }
            ]
        });

        assert.close(
            chart.series[0].transformGroups[0].element.getAttribute(
                'stroke-width'
            ) * chart.mapView.getSVGTransform().scaleX,
            30,
            0.0000000001,
            'Line width should be set'
        );
    }
);

(async () => {
    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    QUnit.test(
        'Setting lineWidth hover state for the mapLine series (#17105)',
        function (assert) {

            // Initialize the chart
            const chart = Highcharts.mapChart('container', {

                title: {
                    text: 'Highmaps simple flight routes demo'
                },

                legend: {
                    align: 'left',
                    layout: 'vertical',
                    floating: true
                },

                mapNavigation: {
                    enabled: true
                },

                tooltip: {
                    formatter: function () {
                        return this.point.id + (
                            this.point.lat ?
                                '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
                        );
                    }
                },

                series: [{
                    mapData,
                    name: 'Basemap',
                    showInLegend: false
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    dataLabels: {
                        format: '{point.id}'
                    },
                    data: [{
                        id: 'London',
                        lat: 51.507222,
                        lon: -0.1275
                    }, {
                        id: 'Glasgow',
                        lat: 55.858,
                        lon: -4.259
                    }, {
                        id: 'Belfast',
                        lat: 54.597,
                        lon: -5.93
                    }, {
                        id: 'Lerwick',
                        lat: 60.155,
                        lon: -1.145,
                        dataLabels: {
                            align: 'left',
                            x: 5,
                            verticalAlign: 'middle'
                        }
                    }]
                }]
            });

            // Function to return an SVG path between two points, with an arc
            function pointsToPath(fromPoint, toPoint, invertArc) {
                const
                    from = chart.mapView.lonLatToProjectedUnits(fromPoint),
                    to = chart.mapView.lonLatToProjectedUnits(toPoint),
                    curve = 0.05,
                    arcPointX = (from.x + to.x) /
                        (invertArc ? 2 + curve : 2 - curve),
                    arcPointY = (from.y + to.y) /
                        (invertArc ? 2 + curve : 2 - curve);
                return [
                    ['M', from.x, from.y],
                    ['Q', arcPointX, arcPointY, to.x, to.y]
                ];
            }

            const londonPoint = chart.get('London');

            // Add a series of lines for London
            chart.addSeries({
                name: 'London flight routes',
                type: 'mapline',
                lineWidth: 2,
                color: Highcharts.getOptions().colors[3],
                // Needed functionality on hover state
                states: {
                    hover: {
                        color: 'red',
                        lineWidth: 4
                    }
                },
                data: [{
                    id: 'London - Belfast',
                    path: pointsToPath(londonPoint, chart.get('Belfast'), true)
                }]
            }, true, false);

            chart.series[2].points[0].setState('hover');

            assert.strictEqual(
                chart.series[2].options.states.hover.lineWidth,
                4,
                'Line width should have a value of 4 on hover state (#17105).'
            );
        });
})();
