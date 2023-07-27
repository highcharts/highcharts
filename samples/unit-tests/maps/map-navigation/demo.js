QUnit.test(
    'Zoom in/out with padding, panning in both directions.',
    async assert => {
        const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json());

        const chart = Highcharts.mapChart('container', {
            chart: {
                plotBorderWidth: 1,
                map: world,

                // Square plot area
                width: 400,
                height: 400,
                margin: 40
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                minColor: '#e6e696',
                maxColor: '#003700'
            },

            // The map series
            series: [{}]
        });

        const plotLeft = chart.plotLeft,
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
        assert.close(
            chart.mapView.zoom,
            zoomBefore,
            1e-14,
            'The chart should be zoomed out to original state'
        );

        chart.mapZoom(0.2);

        const [lon, lat] = chart.mapView.center;
        // #17238
        controller.pan(
            [plotLeft + 50, plotTop + 50],
            [plotLeft + 100, plotTop + 100]
        );

        assert.ok(
            chart.mapView.center[0] < lon,
            'The chart should pan horizontally'
        );

        assert.ok(
            chart.mapView.center[1] > lat,
            'The chart should pan vertically'
        );

        // #17082 start
        // Set zoom to a little more than 1, then do zoomBy(-1) twice
        chart.mapView.update({
            zoom: chart.mapView.minZoom + 1.1
        });

        chart.mapView.zoomBy(-1);
        chart.mapView.zoomBy(-1);

        assert.strictEqual(
            chart.mapView.zoom,
            chart.mapView.minZoom,
            'Chart should be maximally zoomed out (to minZoom), #17082.'
        );
        // #17082 end

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

        // Zoom out and try to pan in a way that would cause the center to
        // be outside of the +/-90 range for lat when using EqualEarth.
        chart.mapZoom(3);
        chart.mapZoom(0.75);

        controller.pan(
            [plotLeft + chart.chartWidth / 2 - 20, plotTop + 10],
            [plotLeft + chart.chartWidth / 2, plotTop + chart.plotHeight - 20]
        );

        assert.ok(
            !/NaN/.test(chart.series[0].group.element.childNodes[0]
                .getAttribute('transform')),
            'The map should not flip when drag causes invalid center, #19190.'
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

    let event;
    const chart = Highcharts.mapChart('container', {
        chart: {
            animation: false,
            events: {
                click: function (e) {
                    // Assign the global event
                    event = e;
                }
            }
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
            zoom: -1,
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
            }, {
                name: 'B',
                id: 'B',
                geometry: {
                    type: 'Point',
                    coordinates: [90, 0]
                }
            }],
            color: '#313f77'
        }]
    });

    const controller = new TestController(chart),
        point = chart.get('A'),
        oldPlotX = point.plotX;
    let oldRotation = chart.mapView.projection.options.rotation;

    controller.pan([350, 150], [200, 150], void 0);
    assert.ok(
        true,
        `No errors about NaN values when paning with mouse outside the
        container (#18542).`
    );
    controller.pan([200, 150], [350, 150], void 0);

    // Zoom needed to pan initially.
    chart.mapView.zoomBy(1);

    // Test event properties
    controller.click(350, 300, void 0);
    // No idea why Safari fails this, possibly related to test controller. It
    // works in practice.
    assert.close(
        event.lon,
        20.4,
        5,
        'Longitude should be available on event'
    );

    assert.close(
        event.lat,
        49.2,
        10,
        'Latitude should be available on event'
    );

    const beforeZoom = chart.mapView.zoom;

    controller.pan([305, 50], [350, 150], void 0);

    // eslint-disable-next-line
    if (!/14\.1\.[0-9] Safari/.test(navigator.userAgent)) {
        assert.ok(
            (point.plotX > oldPlotX),
            'Panning should be activated (#16722).'
        );
    }

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

    assert.strictEqual(
        chart.get('B').dataLabel.attr('visibility'),
        'hidden',
        'Data labels behind the horizon on an Ortho map should be hidden (#17907)'
    );
    assert.notStrictEqual(
        chart.get('A').dataLabel.attr('visibility'),
        'hidden',
        'Data labels on the near side should not be hidden'
    );
    assert.strictEqual(
        chart.get('B').graphic.attr('visibility'),
        'hidden',
        'Point graphics behind the horizon on an Ortho map should be hidden'
    );
    assert.notStrictEqual(
        chart.get('A').graphic.attr('visibility'),
        'hidden',
        'Point graphics on the near side should not be hidden'
    );

    assert.strictEqual(
        beforeZoom,
        chart.mapView.zoom,
        'Map shouldn\'t be zoomed out after panning (#18542).'
    );
});
