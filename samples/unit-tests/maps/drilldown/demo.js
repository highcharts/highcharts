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
    chart.series[0].points[0].doDrilldown();

    assert.ok(
        true,
        `There shouldn't be any error (maximum call stack) in the console,
        when drilldown animation is disabled (#19373).`
    );

    // Drill up to prevent default animation breaking lolex.
    chart.drillUp();
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
        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
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
