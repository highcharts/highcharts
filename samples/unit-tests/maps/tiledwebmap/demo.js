QUnit.test('Tiled Web Map Providers', assert => {
    const replaceVariables = (url, x, y, zoom) => url
        .replace('{x}', x.toString())
        .replace('{y}', y.toString())
        .replace('{zoom}', zoom.toString());

    const renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        400,
        400
    );

    const providers = ['OpenStreetMap', 'Google', 'Gaode'];
    const done = assert.async(providers.length);

    providers.forEach(provider => {
        const twm = Highcharts.Series.types.tiledwebmap,
            newProvider = new twm.TilesProvidersRegistry[provider](),
            url = newProvider.getURL(),
            newUrl = replaceVariables(url, 7, 7, 4);

        const tile = renderer.image(newUrl, 0, 0)
            .add()
            .on('load', () => {
                assert.strictEqual(
                    tile.getBBox().width,
                    256,
                    `Tiles should be loaded from ${provider} provider.`
                );
                done();
            });
    });
});

QUnit.test('Tiled Web Map on the chart', assert => {
    const chart = Highcharts.mapChart('container', {
            mapView: {
                zoom: 2
            },
            series: [{
                type: 'tiledwebmap'
            }]
        }),
        series = chart.series[0];

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
            type: 'OpenStreetMap'
        }
    });

    assert.ok(
        Object.keys(series.tiles).length > 0,
        'If the provider is defined there should be tiles shown.'
    );

    series.update({
        provider: {
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
            .TilesProvidersRegistry.OpenStreetMap().getProjectionName();

    assert.strictEqual(
        chart.mapView.projection.options.name,
        initialProjectionName,
        `If projection is not set it should be forced to initial projection of
        the provider.`
    );
});