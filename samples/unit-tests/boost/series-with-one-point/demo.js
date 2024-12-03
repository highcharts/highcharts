QUnit.test('No points in series with single point (#21897)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        boost: {
            seriesThreshold: 1
        },
        series: [{
            data: [[1, 1]]
        }]
    });

    const plotBox = chart.renderer.plotBox;
    const seriesPoint = chart.series[0].points[0];
    const webGLContext = chart.boost.wgl.gl;
    const sampleWidth = 1;
    const sampleHeight = 1;

    const pixelBuffer = new Uint8Array(
        sampleWidth * sampleHeight * 4
    );

    webGLContext.readPixels(
        seriesPoint.plotX + plotBox.x,
        chart.renderer.height - (seriesPoint.plotY + plotBox.y),
        sampleWidth,
        sampleHeight,
        webGLContext.RGBA,
        webGLContext.UNSIGNED_BYTE,
        pixelBuffer
    );

    const pixelAlpha = pixelBuffer[3];

    assert.strictEqual(
        pixelAlpha,
        255,
        'Drawn image should have a visible point'
    );
});