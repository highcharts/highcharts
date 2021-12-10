QUnit.test('MapView Inset', assert => {
    const geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [0, 0],
                        [10, 0],
                        [10, 10],
                        [0, 10],
                        [0, 0]
                    ]
                ]
            },
            properties: {
                name: 'Mainland'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [90, 50],
                        [100, 50],
                        [100, 60],
                        [90, 60],
                        [90, 50]
                    ]
                ]
            },
            properties: {
                name: 'Island'
            }
        }]
    };

    const chart = Highcharts.mapChart('container', {
        chart: {
            map: geojson,
            margin: 20,
            plotBorderWidth: 1
        },
        mapView: {
            projection: {
                name: 'EqualEarth'
            },
            insetOptions: {
                relativeTo: 'plotBox'
            },
            insets: [{
                field: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [0, 80],
                            [20, 80],
                            [20, 100],
                            [0, 100]
                        ]
                    ]
                },
                geoBounds: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [80, 40],
                            [80, 70],
                            [110, 70],
                            [110, 40],
                            [80, 40]
                        ]
                    ]

                }
            }]
        },
        series: [{
            dataLabels: {
                enabled: true,
                pointFormat: '{point.name}'
            }
        }]
    });

    const coords1 = { lon: 95, lat: 55 },
        projectedPos = chart.fromLatLonToPoint(coords1),
        chartPos = chart.mapView.projectedUnitsToPixels(projectedPos);

    assert.deepEqual(
        chartPos,
        { x: 56, y: 324 },
        'fromLatLonToPoint: inside inset'
    );

    assert.deepEqual(
        chart.fromPointToLatLon(chart.mapView.pixelsToProjectedUnits(chartPos)),
        coords1,
        'fromPointToLatLon: inside inset'
    );

    const coords2 = { lon: 5, lat: 5 },
        projectedPos2 = chart.fromLatLonToPoint(coords2),
        chartPos2 = chart.mapView.projectedUnitsToPixels(projectedPos2);

    assert.ok(
        chartPos2.x > 200,
        'fromLatLonToPoint: outside inset'
    );

    const roundtripCoords2 = chart.fromPointToLatLon(
        chart.mapView.pixelsToProjectedUnits(chartPos2)
    );
    assert.close(
        roundtripCoords2.x,
        coords2.x,
        0.01,
        'fromPointToLatLon: outside inset'
    );
    assert.close(
        roundtripCoords2.y,
        coords2.y,
        0.01,
        'fromPointToLatLon: outside inset'
    );

    chart.series[0].points.forEach(p => {
        assert.ok(
            (
                p.plotX > chart.plotLeft &&
                p.plotX < chart.plotLeft + chart.plotWidth &&
                p.plotY > chart.plotTop &&
                p.plotY < chart.plotTop + chart.plotHeight
            ),
            `Plot coordinates of ${p.name} should be within pane (currently \
 [${p.plotX}, ${p.plotY}])`
        );
    });


});