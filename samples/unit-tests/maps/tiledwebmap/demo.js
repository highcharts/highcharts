QUnit.test('Tiled Web Map on the chart', assert => {
    // Adding fake-provider only for testing purposes
    (function (H) {
        const testimage =
            location.host.substr(0, 12) === 'localhost:98' ?
                'base/test/testimage.png' : // karma
                'testimage.png'; // utils
        class TestProviderDefinition {
            constructor() {
                this.subdomains = [''];
                this.themes = {
                    Standard: {
                        url: testimage,
                        minZoom: 0,
                        maxZoom: 19
                    },
                    Favicon: {
                        url: 'favicon.ico',
                        minZoom: 0,
                        maxZoom: 19
                    }
                };
                this.initialProjectionName = 'WebMercator';
                this.defaultCredits = 'Test Provider';
            }
        }

        H.TilesProviderRegistry.TestProvider = TestProviderDefinition;
    }(Highcharts));

    const chart = Highcharts.mapChart('container', {
            mapView: {
                zoom: 2
            },
            series: [{
                type: 'tiledwebmap',
                provider: {
                    type: 'BadProvider'
                }
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        Object.keys(series.tiles).length,
        0,
        `If the provider is defined, but it is not supported there should not be
        any tiles.`
    );

    series.update({
        provider: {
            type: 'TestProvider'
        }
    });

    assert.ok(
        Object.keys(series.tiles).length > 0,
        'If the provider is defined there should be tiles shown.'
    );

    series.update({
        provider: void 0
    });

    assert.strictEqual(
        Object.keys(series.tiles).length,
        0,
        'If the provider is not defined there should not be any tiles.'
    );

    series.update({
        provider: {}
    });

    assert.strictEqual(
        Object.keys(series.tiles).length,
        0,
        `If the provider object is defined but provider type is not defined
        there should not be any tiles.`
    );

    series.update({
        provider: {
            type: 'BadProvider'
        }
    });

    assert.strictEqual(
        Object.keys(series.tiles).length,
        0,
        `If the provider is defined, but it is not supported there should not be
        any tiles.`
    );

    series.update({
        provider: {
            type: 'TestProvider',
            theme: 'BadTheme'
        }
    });

    assert.ok(
        Object.keys(series.tiles).length > 0,
        `If the provider theme is defined, but not supported there should be
        standard tiles shown.`
    );

    series.update({
        provider: {
            theme: void 0,
            subdomain: 'XXX'
        }
    });

    assert.ok(
        Object.keys(series.tiles).length > 0,
        `If the provider subdomain is defined, but not supported there should be
        standard tiles shown.`
    );

    const initialProjectionName =
        new Highcharts.TilesProviderRegistry
            .TestProvider().initialProjectionName;

    assert.strictEqual(
        chart.mapView.projection.options.name,
        initialProjectionName,
        `If projection is not set it should be forced to initial projection of
        the provider.`
    );

    let drawPointsCount = 0;
    const drawPoints = series.drawPoints;
    series.drawPoints = function () {
        drawPointsCount++;
        return drawPoints.apply(this, arguments);
    };

    chart.mapView.update({
        center: [10.73028454146517, 59.91261204279989],
        zoom: 13
    });

    assert.ok(
        drawPointsCount > 0,
        'Tiles should reload after updating the map view with center and ' +
        'zoom, #24441.'
    );

    drawPointsCount = 0;

    chart.mapView.update({
        fitToGeometry: {
            type: 'MultiPoint',
            coordinates: [
                [0, 0],
                [1, 1]
            ]
        }
    });

    assert.ok(
        drawPointsCount > 0,
        'Tiles should reload after updating the map view with ' +
        'fitToGeometry, #24441.'
    );

    chart.series[0].update({
        provider: {
            type: void 0,
            url: 'https://a.tile.thunderforest.com/cycle/{zoom}/{x}/{y}.png'
        }
    });

    assert.ok(
        Object.keys(series.tiles).length > 0,
        'Map should be loaded from custom URL entered by user.'
    );
});

QUnit.test('Tiled Web Map should stop tile animations on pan', assert => {
    const clock = TestUtilities.lolexInstall();

    try {
        const chart = Highcharts.mapChart('container', {
                chart: {
                    animation: {
                        duration: 500
                    },
                    width: 400,
                    height: 300
                },
                mapNavigation: {
                    enabled: true
                },
                mapView: {
                    center: [0, 20],
                    zoom: 2
                },
                series: [{
                    type: 'tiledwebmap',
                    provider: {
                        type: 'TestProvider'
                    }
                }, {
                    type: 'mappoint',
                    data: [{
                        lon: -0.1275,
                        lat: 51.507222
                    }]
                }]
            }),
            controller = new TestController(chart),
            series = chart.series[0],
            point = chart.series[1].points[0];

        chart.mapZoom(2);
        clock.tick(50);

        controller.pan(
            [chart.plotLeft + 200, chart.plotTop + 120],
            [chart.plotLeft + 140, chart.plotTop + 120]
        );

        clock.tick(1000);

        const zoomKey = Object.keys(series.tiles).find(key =>
                series.tiles[key].isActive
            ) || Object.keys(series.tiles)[0],
            firstTile = series.tiles[zoomKey].tiles[
                Object.keys(series.tiles[zoomKey].tiles)[0]
            ],
            tile = series.tiles[zoomKey].tiles[
                Object.keys(series.tiles[zoomKey].tiles)[1]
            ] || firstTile,
            zoomFloor = parseFloat(zoomKey),
            scaledTileSize = Math.pow(2, chart.mapView.zoom - zoomFloor) * 256,
            firstTileLonLat = series.tileToLonLat(
                firstTile.posX,
                firstTile.posY,
                zoomFloor
            ),
            units = chart.mapView.projection.def.forward([
                firstTileLonLat.lon,
                firstTileLonLat.lat
            ]),
            firstTilePx = chart.mapView.projectedUnitsToPixels({
                x: units[0],
                y: units[1]
            }),
            tilesOffsetX = firstTile.posX * scaledTileSize - firstTilePx.x,
            tilesOffsetY = firstTile.posY * scaledTileSize - firstTilePx.y,
            expectedX = tile.posX * scaledTileSize - tilesOffsetX,
            expectedY = tile.posY * scaledTileSize - tilesOffsetY,
            expectedPoint = chart.mapView.lonLatToPixels({
                lon: point.options.lon,
                lat: point.options.lat
            });

        assert.close(
            Number(tile.attr('x')),
            expectedX,
            1,
            'Tile x should match the final map view after interrupted zoom.'
        );

        assert.close(
            Number(tile.attr('y')),
            expectedY,
            1,
            'Tile y should match the final map view after interrupted zoom.'
        );

        assert.close(
            point.plotX,
            expectedPoint.x,
            1,
            'Map point x should match lon/lat projection after ' +
            'interrupted zoom.'
        );

        assert.close(
            point.plotY,
            expectedPoint.y,
            1,
            'Map point y should match lon/lat projection after ' +
            'interrupted zoom.'
        );
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
