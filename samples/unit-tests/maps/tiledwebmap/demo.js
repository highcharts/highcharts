QUnit.test('Tiled Web Map on the chart', assert => {
    // Adding fake-provider only for testing purposes
    (function (H) {
        class TestProviderDefinition {
            constructor() {
                this.subdomains = [''];
                this.themes = {
                    Standard: {
                        url: 'testimage.png',
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