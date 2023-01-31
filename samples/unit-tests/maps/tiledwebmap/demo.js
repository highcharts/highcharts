QUnit.test('Tiled Web Map on the chart', assert => {
    // Adding fake-provider only for testing purposes
    (function (H) {
        const { error } = H;
        class TestProviderDefinition {
            constructor() {
                this.subdomains = [''];
                this.themes = {
                    standard: 'testimage.png',
                    favidon: 'favicon.ico'
                };
                this.initialProjectionName = 'WebMercator';
                this.credits = {
                    standard: 'Test Provider'
                };
                this.minZoom = 0;
                this.maxZoom = 19;
            }

            getCredits() {
                return this.credits.standard;
            }

            getURL(subdomain, theme) {
                const { themes, subdomains } = this;
                let chosenTheme,
                    chosenSubdomain;

                // Check for themes
                if (
                    (
                        theme &&
                        !Object.prototype.hasOwnProperty.call(themes, theme)
                    ) ||
                    !theme
                ) {
                    if (theme) {
                        error(
                            'Missing option: Tiles provider theme cannot be reached, ' +
                            'using standard provider theme.',
                            false
                        );
                    }
                    chosenTheme = 'standard';
                } else {
                    chosenTheme = theme;
                }

                // Check for subdomains
                if ((subdomain && subdomains.indexOf(subdomain) === -1) ||
                    !subdomain
                ) {
                    if (subdomain) {
                        error(
                            'Missing option: Tiles provider subdomain cannot be ' +
                            'reached, using default provider subdomain.',
                            false
                        );
                    }
                    chosenSubdomain = subdomains[0];
                } else {
                    chosenSubdomain = subdomain;
                }

                const url = themes[chosenTheme]
                    .replace('{s}', chosenSubdomain);

                return url;
            }
        }

        H.seriesTypes.tiledwebmap.TilesProvidersRegistry.TestProvider =
            TestProviderDefinition;
    }(Highcharts));

    const chart = Highcharts.mapChart('container', {
            mapView: {
                zoom: 2
            },
            series: [{
                type: 'tiledwebmap',
                provider: {
                    type: 'TestProvider'
                }
            }]
        }),
        series = chart.series[0];

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
        new Highcharts.Series.types.tiledwebmap
            .TilesProvidersRegistry.TestProvider().initialProjectionName;

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