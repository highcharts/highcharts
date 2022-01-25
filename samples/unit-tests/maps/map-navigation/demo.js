QUnit.test(
    'Zoom in - zoomout with padding, panning in both directions.',
    function (assert) {
        var chart = Highcharts.mapChart('container', {
            chart: {
                plotBorderWidth: 1,

                // Square plot area
                width: 400,
                height: 400,
                margin: 40
            },

            mapNavigation: {
                enabled: false
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                minColor: '#e6e696',
                maxColor: '#003700'
            },

            // The map series
            series: [
                {
                    data: [
                        {
                            value: 1,
                            path: 'M,0,0,L,100,0,L,100,100,L,0,100,z'
                        },
                        {
                            value: 2,
                            path: 'M,200,200,L,300,200,L,300,300,L,200,300,z'
                        }
                    ]
                }
            ]
        });

        var plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            controller = new TestController(chart);

        controller.pan(
            [plotLeft + 50, plotTop + 50],
            [plotLeft + 100, plotTop + 100]
        );

        assert.ok(
            !chart.resetZoomButton,
            'Reset zoom button should not appear while panning and chart is not zoomed.'
        );

        const zoomBefore = chart.mapView.zoom;
        chart.mapZoom(0.5);

        assert.notEqual(
            chart.mapView.zoom,
            zoomBefore,
            'The chart should have zoomed in'
        );

        chart.mapZoom(2);
        assert.strictEqual(
            chart.mapView.zoom,
            zoomBefore,
            'The chart should be zoomed out to original state'
        );

        chart.mapZoom(0.2);


        const [lon, lat] = chart.mapView.center;

        controller.pan(
            [plotLeft + 50, plotTop + 50],
            [plotLeft + 100, plotTop + 100]
        );

        assert.notEqual(
            chart.mapView.center[0],
            lon,
            'The chart should pan horizontally'
        );

        assert.notEqual(
            chart.mapView.center[1],
            lat,
            'The chart should pan vertically'
        );

        chart.series[0].remove(false);

        chart.update({
            chart: {
                map: 'countries/gb/gb-all'
            }
        }, false);

        chart.addSeries({}, false);

        chart.addSeries({
            type: 'mappoint',
            data: [{
                name: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }]
        });

        const pointPositionBeforeZoom = chart.series[1].points[0].plotX;

        chart.mapZoom(0.5);

        const pointPositionAfterZoom = chart.series[1].points[0].plotX;

        assert.notEqual(
            pointPositionBeforeZoom,
            pointPositionAfterZoom,
            'The map point should update its position on zooming, #16534.'
        );
    }
);

QUnit.test('Map navigation button alignment', assert => {
    const chart = Highcharts.mapChart('container', {
        chart: {
            plotBorderWidth: 1,
            width: 400
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [
            {
                data: [
                    {
                        path: 'M 0 0 L 100 0 L 0 100',
                        value: 1
                    },
                    {
                        path: 'M 100 0 L 100 100 L 0 100',
                        value: 2
                    }
                ]
            }
        ],
        responsive: {
            rules: [{
                condition: { maxWidth: 500 },
                chartOptions: {
                    mapNavigation: {
                        enabled: false
                    }
                }
            }]
        }
    });

    assert.ok(
        true,
        '#15406: Responsive rule should not make it throw'
    );

    chart.setSize(600);

    assert.close(
        chart.mapNavigation.navButtons[1].translateY +
            chart.mapNavigation.navButtons[1].element.getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should initially be bottom-aligned to the plot box (#12776)'
    );

    chart.setSize(undefined, 380);

    assert.close(
        chart.mapNavigation.navButtons[1].translateY +
            chart.mapNavigation.navButtons[1].element.getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should be bottom-aligned to the plot box after redraw (#12776)'
    );
});

QUnit.test('Orthographic map rotation and panning.', assert => {
    const getGraticule = partial => {
        const data = [];
        // Meridians
        for (let x = -180; x <= 180; x += 180) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: partial ? [
                        [x, 90],
                        [x, 45]
                    ] : [
                        [x, 90],
                        [x, 0],
                        [x, -90]
                    ]
                }
            });
        }

        const coordinates = [];
        for (let x = -180; x <= 180; x += 90) {
            coordinates.push([x, 0]); // only equator
        }
        data.push({
            geometry: {
                type: 'LineString',
                coordinates
            }
        });

        return data;
    };

    const chart = Highcharts.mapChart('container', {
        chart: {
            animation: false
        },

        title: {
            text: ''
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true,
            buttonOptions: {
                verticalAlign: 'top'
            }
        },

        mapView: {
            maxZoom: 30,
            projection: {
                name: 'Orthographic',
                rotation: [0, -90]
            }
        },

        colorAxis: {
            tickPixelInterval: 100,
            minColor: '#BFCFAD',
            maxColor: '#31784B',
            max: 1000
        },

        tooltip: {
            pointFormat: '{point.name}: {point.value}'
        },

        plotOptions: {
            series: {
                clip: false,
                animation: false
            }
        },

        series: [{
            name: 'Graticule',
            id: 'graticule',
            type: 'mapline',
            data: getGraticule(true),
            nullColor: 'rgba(0, 0, 0, 0.05)'
        }, {
            type: 'mappoint',
            data: [{
                name: 'A',
                id: 'A',
                geometry: {
                    type: 'Point',
                    coordinates: [0, 80]
                }
            }],
            color: '#313f77'
        }]
    });

    const controller = new TestController(chart),
        point = chart.get('A'),
        oldPlotY = point.plotY;
    let oldRotation = chart.mapView.projection.options.rotation;

    controller.click(20, 20, void 0, true); // Zoom needed to pan initially.
    controller.pan([305, 50], [350, 150]);

    assert.ok(
        (point.plotY > oldPlotY),
        'Panning should be activated (#16722).'
    );

    assert.deepEqual(
        chart.mapView.projection.options.rotation,
        oldRotation,
        'Rotation should not be activated (#16722).'
    );

    // Test on fully loaded graticule
    chart.series[0].update({
        data: getGraticule(false)
    });
    chart.setSize(500, 500); // Note: Otherwise map doesn't update.

    oldRotation = chart.mapView.projection.options.rotation;

    controller.pan([305, 50], [350, 150]);

    assert.notDeepEqual(
        chart.mapView.projection.options.rotation,
        oldRotation,
        'Rotation should be activated (#16722).'
    );
});
