// This should maybe be a visual test
QUnit.test('MapPoint with LineWidth', function (assert) {
    var proj4Script = window.proj4;
    window.proj4 = null;

    var clock = TestUtilities.lolexInstall();
    try {
        var chart = Highcharts.mapChart('container', {
            chart: {
                proj4: proj4Script
            },
            plotOptions: {
                mappoint: {
                    animation: {
                        duration: 50
                    }
                }
            },
            series: [
                {
                    mapData: Highcharts.maps['countries/gb/gb-all']
                },
                {
                    type: 'mappoint',
                    lineWidth: 2,
                    data: [
                        {
                            lat: 51.507222,
                            lon: -0.1275
                        },
                        {
                            lat: 52.483056,
                            lon: -1.893611
                        },
                        {
                            x: 1600,
                            y: -3500
                        },
                        {
                            x: 2800,
                            y: -3800
                        }
                    ]
                }
            ]
        });
        TestUtilities.lolexRunAndUninstall(clock);
        assert.ok(true, 'Animation should run without errors (#16541)');


        assert.strictEqual(
            chart.series[1].graph['stroke-width'],
            2,
            'Points have stroke width'
        );
        assert.close(
            Math.abs(Math.round(chart.series[1].data[0].plotY)),
            252,
            10,
            'The proj4 library was loaded correctly from the chart.proj4 property'
        );

        const data = [
            [-0.1275, 51.507222],
            [-1.893611, 52.483056]
        ];

        chart.series[1].update({
            type: 'mapline',
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: data,
                    color: 'red'
                }
            }]
        });

        const projectedData = data.map(coords => {
            const { x, y } = chart.mapView.lonLatToProjectedUnits({
                lon: coords[0],
                lat: coords[1]
            });
            return [x, y];
        });

        assert.deepEqual(
            chart.series[1].data[0].geometry.coordinates,
            projectedData,
            'Mapline series should have correct position on non TopoJSON chart.'
        );

    } finally {
        window.proj4 = proj4Script;
        TestUtilities.lolexUninstall(clock);
    }
});
