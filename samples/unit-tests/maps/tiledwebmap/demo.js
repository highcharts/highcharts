QUnit.test('Tiled Web Map', assert => {
    const replaceVariables = (url, x, y, zoom) => url
        .replace('{x}', x.toString())
        .replace('{y}', y.toString())
        .replace('{zoom}', zoom.toString());

    const renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        400,
        400
    );

    const providers = ['OpenStreetMap', 'Google', 'Carto', 'Gaode'];
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