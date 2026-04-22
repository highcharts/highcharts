const duration = 300;

QUnit.test('Map drilldown with disabled animation', async assert => {
    const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        africa = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.topo.json'
        ).then(response => response.json());


    const chart = Highcharts.mapChart('container', {
        chart: {
            animation: false,
            events: {
                drilldown() {
                    const chart = this;
                    assert.close(
                        chart.series[0].options.custom.startPos.x,
                        chart.series[0].group.getBBox().x,
                        1,
                        `There shouldn't be drilldown animation when animation
                        is disabled.`
                    );
                }
            }
        },
        series: [{
            mapData: world,
            custom: {
                startPos: void 0
            },
            data: [{
                'hc-key': 'af',
                value: 1,
                drilldown: 'africa'
            }]
        }, {
            name: 'second',
            data: [{
                'hc-key': 'sa',
                value: 2
            }]
        }],
        drilldown: {
            animation: false,
            series: [{
                id: 'africa',
                mapData: africa
            }]
        }
    });
    chart.series[0].options.custom.startPos = chart.series[0].group.getBBox();

    assert.strictEqual(
        chart.mapView.projection.options.name,
        'EqualEarth',
        `Recommended map projection should be based on first big, world map,
        should be EqualEarth.`
    );

    chart.series[0].points[0].doDrilldown();

    assert.strictEqual(
        chart.mapView.projection.options.name,
        'LambertConformalConic',
        `Recommended map projection should be based on drilled into series,
        africa map, should be LambertConformalConic.`
    );

    assert.ok(
        true,
        `There shouldn't be any error (maximum call stack) in the console,
        when drilldown animation is disabled (#19373).`
    );

    // Drill up to prevent default animation breaking lolex.
    chart.drillUp();

    delete africa.objects.default['hc-decoded-geojson'];
    delete world.objects.default['hc-decoded-geojson'];
});

QUnit.test('Map drilldown with zooming animation', async assert => {
    const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        africa = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.topo.json'
        ).then(response => response.json());

    let clock = null;
    try {
        clock = TestUtilities.lolexInstall();
        const chart = Highcharts.mapChart('container', {
                chart: {
                    width: 200
                },
                mapView: {
                    projection: {
                        name: 'EqualEarth'
                    }
                },
                series: [{
                    mapData: world,
                    data: [{
                        'hc-key': 'af',
                        value: 1,
                        drilldown: 'africa'
                    }]
                }, {
                    name: 'second',
                    data: [{
                        'hc-key': 'sa',
                        value: 2
                    }]
                }],
                drilldown: {
                    animation: {
                        duration
                    },
                    mapZooming: true,
                    series: [{
                        id: 'africa',
                        mapData: africa
                    }]
                }
            }),
            startPos = chart.series[0].group.getBBox(),
            zoomBefore = chart.mapView.zoom;
        chart.series[0].points[0].doDrilldown();

        setTimeout(function () {
            assert.ok(
                startPos.x > chart.series[0].group.getBBox().x,
                'When drilling down, animation should first zoom to mappoint.'
            );
        }, duration / 2);

        setTimeout(function () {
            chart.drillUp();
            setTimeout(function () {
                assert.ok(
                    startPos.x > chart.series[1].group.getBBox().x,
                    `When drilling up, animation should zoom out from a
                    mappoint to a global view.`
                );
                assert.strictEqual(
                    chart.mapView.zoom,
                    zoomBefore,
                    `After drilling up, the zoom of the map should be the same
                    as before drilling (#19676).`
                );
            }, duration / 2);
        }, duration * 3);

        setTimeout(function () {
            chart.update({
                chart: {
                    animation: false
                },
                mapNavigation: {
                    enabled: true
                }
            }, false);
            chart.series[0].points[0].doDrilldown();

            setTimeout(function () {
                // Calculate scales before and after zooming in for test
                const scaleXBefore = chart.series[0].transformGroups[0].scaleX;
                chart.mapNavigation.navButtons[0].element
                    .dispatchEvent(new Event('click'));
                const scaleXAfter = chart.series[0].transformGroups[0].scaleX;
                chart.mapNavigation.navButtons[1].element
                    .dispatchEvent(new Event('click'));

                // Enable animation during zooming in
                chart.update({
                    chart: {
                        animation: true
                    }
                });
                chart.mapNavigation.navButtons[0].element
                    .dispatchEvent(new Event('click'));

                setTimeout(function () {
                    assert.ok(
                        scaleXBefore <
                            chart.series[0].transformGroups[0].scaleX &&
                        chart.series[0].transformGroups[0].scaleX < scaleXAfter,
                        `Map zooming animation should work correctly after
                        drilldown into series (#20857).`
                    );
                }, 100);
            }, duration * 3);
        }, duration * 5);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {

        delete africa.objects.default['hc-decoded-geojson'];
        delete world.objects.default['hc-decoded-geojson'];
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Map drilldown with disabled zooming animation', async assert => {
    const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        africa = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.topo.json'
        ).then(response => response.json());

    let clock = null;
    try {
        clock = TestUtilities.lolexInstall();
        const chart = Highcharts.mapChart('container', {
            series: [{
                mapData: world,
                custom: {
                    startPos: void 0
                },
                data: [{
                    'hc-key': 'af',
                    value: 1,
                    drilldown: 'africa'
                }]
            }, {
                name: 'second',
                data: [{
                    'hc-key': 'sa',
                    value: 2
                }]
            }],
            drilldown: {
                animation: {
                    duration
                },
                mapZooming: false,
                series: [{
                    id: 'africa',
                    mapData: africa
                }]
            }
        });
        const startPos = chart.series[0].group.getBBox();
        chart.series[0].points[0].doDrilldown();

        setTimeout(function () {
            assert.close(
                startPos.x,
                chart.series[0].group.getBBox().x,
                1,
                `When drilling down with disable map zooming, series should not
                zoom to mappoint.`
            );
            assert.ok(
                chart.series[0].group.opacity < 1,
                `When drilling down with disable map zooming, series should
                be only faded out.`
            );

            setTimeout(function () {
                chart.drillUp();

                setTimeout(function () {
                    assert.close(
                        startPos.x,
                        chart.series[0].group.getBBox().x,
                        1,
                        `When drilling up with disable map zooming, series
                        should not zoom to mappoint.`
                    );
                    assert.ok(
                        chart.series[0].group.opacity < 1,
                        `When drilling up with disable map zooming, series
                        should be only faded in.`
                    );
                }, duration * 1.5);
            }, duration);
        }, duration / 2);
        TestUtilities.lolexRunAndUninstall(clock);
    } finally {

        delete africa.objects.default['hc-decoded-geojson'];
        delete world.objects.default['hc-decoded-geojson'];
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Map drilldown animation for GeoJSON maps', async assert => {
    const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.geo.json'
        ).then(response => response.json()),
        africa = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.geo.json'
        ).then(response => response.json());

    let clock = null;
    try {
        clock = TestUtilities.lolexInstall();
        const chart = Highcharts.mapChart('container', {
                series: [{
                    mapData: world,
                    custom: {
                        startPos: void 0
                    },
                    data: [{
                        'hc-key': 'af',
                        value: 1,
                        drilldown: 'africa'
                    }]
                }, {
                    name: 'second',
                    data: [{
                        'hc-key': 'sa',
                        value: 2
                    }]
                }],
                drilldown: {
                    animation: {
                        duration
                    },
                    mapZooming: true,
                    series: [{
                        id: 'africa',
                        mapData: africa
                    }]
                }
            }),
            startPos = chart.series[0].group.getBBox();
        chart.series[0].points[0].doDrilldown();

        setTimeout(function () {
            assert.close(
                startPos.x,
                chart.series[0].group.getBBox().x,
                1,
                `When drilling down for geoJSON maps, series not
                zoom to mappoint (#18925).`
            );
            assert.ok(
                chart.series[0].group.opacity < 1,
                `When drilling down for geoJSON maps, series
                should be only faded out (#18925).`
            );
            setTimeout(function () {
                assert.strictEqual(
                    chart.mapView.zoom,
                    chart.mapView.minZoom,
                    `After drilling down on geoJSON maps zoom should be set
                    to minZoom (#18925).`
                );
            }, duration * 1.5);
        }, duration / 2);
        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test(
    '#21546, One series should be visible after drilldown',
    async assert => {
        const world = await fetch(
                'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
            ).then(response => response.json()),
            worldMapView = world.objects.default['hc-recommended-mapview'],
            africa = await fetch(
                'https://code.highcharts.com/mapdata/custom/africa.topo.json'
            ).then(response => response.json()),
            africaMapView = africa.objects.default['hc-recommended-mapview'];

        let clock = null;
        try {
            clock = TestUtilities.lolexInstall();
            const chart = Highcharts.mapChart('container', {
                colorAxis: {
                    min: 0,
                    max: 4,
                    minColor: '#E6E7E8',
                    maxColor: '#005645'
                },
                mapView: worldMapView,
                mapNavigation: {
                    enabled: true
                },
                series: [{
                    mapData: world,
                    custom: {
                        startPos: void 0
                    },
                    data: [{
                        'hc-key': 'af',
                        value: 1,
                        drilldown: 'africa',
                        mapView: africaMapView
                    }]
                }, {
                    name: 'second',
                    data: [{
                        'hc-key': 'sa',
                        value: 2
                    }]
                }],
                drilldown: {
                    animation: {
                        duration
                    },
                    mapZooming: true,
                    series: [{
                        id: 'africa',
                        mapData: africa
                    }]
                }
            });
            chart.series[0].points[0].doDrilldown();

            setTimeout(() => {
                assert.ok(
                    chart.series.length === 1,
                    'After drilldown, only one series should be visible.'
                );
            }, duration * 3);
            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);

            // Clear cache for other tests
            delete africa.objects.default['hc-decoded-geojson'];
            delete world.objects.default['hc-decoded-geojson'];
        }
    }
);

QUnit.test(
    '#20886, Map drilldown datalabel mouse tracking',
    async assert => {
        const world = await fetch(
                'https://code.highcharts.com/mapdata/custom/world-continents.geo.json'
            ).then(response => response.json()),
            africa = await fetch(
                'https://code.highcharts.com/mapdata/custom/africa.geo.json'
            ).then(response => response.json()),
            duration = 50;

        // Create the chart
        const chart = Highcharts.mapChart('container', {
                chart: {
                    animation: {
                        duration: duration
                    },
                    events: {
                        drillupall() {
                            const chart = this;
                            assert.notOk(
                                // eslint-disable-next-line no-underscore-dangle
                                chart.get('world_map')._hasTracking,
                                `Tracking should be false before chart
                                re-renders on \"drillupall\" event and
                                animations are enabled.`
                            );
                        }
                    }
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                plotOptions: {
                    map: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [{
                    id: 'world_map',
                    mapData: world,
                    custom: {
                        startPos: void 0
                    },
                    data: [{
                        'hc-key': 'af',
                        value: 1,
                        drilldown: 'africa'
                    }]
                }],
                drilldown: {
                    animation: {
                        duration: duration
                    },
                    mapZooming: true,
                    series: [{
                        id: 'africa',
                        mapData: africa
                    }]
                }
            }),
            done = assert.async();

        chart.series[0].points
            .find(p => p['hc-key'] === 'af').firePointEvent('click');

        setTimeout(() => {
            chart.drillUp();

            setTimeout(() => {
                assert.ok(
                    chart.get('world_map').dataLabelsGroup
                        .hasClass('highcharts-tracker'),
                    'Data label group should have tracking after drillup.'
                );

                done();
            }, duration * 1.5);
        }, duration * 1.5);
    }
);

QUnit.test(
    'Mappoint dataLabels visible after map drill up',
    async assert => {
        const usTopology = await fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
            ).then(response => response.json()),
            caTopology = await fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-ca-all.topo.json'
            ).then(response => response.json()),
            mapView = usTopology.objects.default['hc-recommended-mapview'],
            usData = Highcharts.geojson(usTopology);

        usData.forEach((d, i) => {
            d.drilldown = d.properties['hc-key'] === 'us-ca' ?
                'california' : void 0;
            d.value = i;
        });

        const caData = Highcharts.geojson(caTopology);
        caData.forEach((d, i) => {
            d.value = i;
        });

        const chart = Highcharts.mapChart('container', {
            chart: { animation: false },
            mapView,
            drilldown: {
                animation: false,
                mapZooming: true,
                series: [{
                    id: 'california',
                    name: 'California',
                    mapData: caTopology,
                    data: caData,
                    dataLabels: { enabled: true, format: '{point.name}' }
                }]
            },
            series: [{
                data: usData,
                name: 'USA',
                custom: { mapView }
            }, {
                type: 'mappoint',
                zIndex: 4,
                dataLabels: { enabled: true },
                data: [{ lon: -118.24, lat: 34.05, name: 'LA' }]
            }]
        });

        assert.ok(
            chart.series[1].dataLabelsGroup.element.childNodes.length > 0,
            'LA point should have dataLabel and be placed.'
        );

        const caPoint = chart.series[0].points.find(
            p => (
                p.drilldown === 'california' ||
                p.options?.drilldown === 'california'
            )
        );

        caPoint?.doDrilldown();
        chart.drillUp();

        assert.ok(
            chart.series[0].dataLabelsGroup.element.childNodes.length > 0,
            'LA point should have dataLabel and be placed after drill up.'
        );
    }
);

QUnit.test(
    '#23238, Remove previous map level after update and second drilldown',
    async assert => {
        const usTopology = await fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
            ).then(response => response.json()),
            alTopology = await fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-al-all.topo.json'
            ).then(response => response.json()),
            mapView = usTopology.objects.default['hc-recommended-mapview'],
            duration = 50;

        const toMapData = (topology, nextDrilldown, className) => {
            const data = Highcharts.geojson(topology);
            data.forEach((d, i) => {
                d.value = i;
                d.className = className;
                if (nextDrilldown) {
                    d.drilldown = nextDrilldown;
                }
            });
            return data;
        };

        const usData = Highcharts.geojson(usTopology);
        usData.forEach((d, i) => {
            d.value = i;
            d.drilldown = d.properties['hc-key'] === 'us-al' ?
                'al-level-2' : void 0;
        });

        let clock = null;
        try {
            clock = TestUtilities.lolexInstall();
            const drilldownIds = [];

            const chart = Highcharts.mapChart('container', {
                    chart: {
                        events: {
                            drilldown(e) {
                                if (e.seriesOptions) {
                                    return;
                                }
                                drilldownIds.push(e.point.drilldown);

                                const isSecondLevel =
                                        e.point.drilldown === 'al-level-2',
                                    data = toMapData(
                                        alTopology,
                                        isSecondLevel ? 'al-level-3' : void 0,
                                        isSecondLevel ?
                                            'level2-point' : 'level3-point'
                                    );

                                chart.mapView.update(
                                    Highcharts.merge(
                                        {
                                            insets: void 0,
                                            padding: 0
                                        },
                                        alTopology.objects.default[
                                            'hc-recommended-mapview'
                                        ]
                                    )
                                );

                                chart.addSeriesAsDrilldown(e.point, {
                                    data,
                                    className: isSecondLevel ?
                                        'drill-level-2' : 'drill-level-3',
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.name}'
                                    }
                                });
                            }
                        }
                    },
                    mapView,
                    series: [{
                        data: usData,
                        dataLabels: {
                            enabled: true,
                            format: '{point.properties.postal-code}'
                        },
                        custom: { mapView }
                    }],
                    drilldown: {
                        animation: {
                            duration: duration
                        },
                        mapZooming: true
                    }
                }),
                alabamaPoint = chart.series[0].points.find(
                    p => p.properties?.['hc-key'] === 'us-al'
                );

            alabamaPoint?.doDrilldown();

            setTimeout(() => {
                const secondLevelSeries = chart.series.find(
                    series => series.options.className === 'drill-level-2'
                );

                assert.ok(
                    secondLevelSeries,
                    'Second-level series should be present before update.'
                );

                secondLevelSeries?.update({
                    opacity: 0.5
                }, true);

                secondLevelSeries?.points[0].doDrilldown();
            }, duration * 4);

            setTimeout(() => {
                chart.mapView.zoomBy(-1);
            }, duration * 10);

            setTimeout(() => {
                assert.strictEqual(
                    chart.series.length,
                    1,
                    'Only one series should remain after second drilldown.'
                );

                assert.deepEqual(
                    drilldownIds.slice(0, 2),
                    ['al-level-2', 'al-level-3'],
                    'Drilldown should proceed to the third level.'
                );

                assert.strictEqual(
                    chart.container.querySelectorAll('.drill-level-2').length,
                    0,
                    'Second-level series groups should be fully removed.'
                );

                assert.strictEqual(
                    chart.series[0].points.some(
                        point => point.drilldown === 'al-level-3'
                    ),
                    false,
                    'Third-level series should be the active one.'
                );
            }, duration * 14);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
