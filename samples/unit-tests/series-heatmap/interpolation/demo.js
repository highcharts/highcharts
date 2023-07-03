QUnit.test('Interpolated image test', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            inverted: true
        },

        colorAxis: {
            stops: [
                [0, 'rgba(61, 0, 255, 1)'],
                [0.2, 'rgba(0, 255, 188, 1)'],
                [0.6, 'rgba(194, 255, 0, 1)'],
                [0.9, 'rgba(255, 0, 67, 1)']
            ]
        },

        series: [
            {
                data: [
                    [0, 0, 2],
                    [0, 1, 2.1],
                    [0, 2, 2.2],
                    [1, 0, 3],
                    [1, 1, 3.1],
                    [1, 2, 3.2],
                    [2, 0, 4],
                    [2, 1, 4.1],
                    [2, 2, 4.2],
                    [3, 0, 5],
                    [3, 1, 5.1],
                    [3, 2, 5.2],
                    [4, 0, 2],
                    [4, 1, 2.1],
                    [4, 2, 2.2],
                    [5, 0, 3],
                    [5, 1, 3.1],
                    [5, 2, 3.2],
                    [6, 0, 4],
                    [6, 1, 4.1],
                    [6, 2, 4.2],
                    [7, 0, 5],
                    [7, 1, 5.1],
                    [7, 2, 5.2]
                ],
                interpolation: true
            }
        ]
    });


    const
        {
            container,
            series,
            plotLeft,
            plotTop
        } = chart,
        {
            canvas,
            canvas: { width, height },
            image: { element }
        } = series[0];

    assert.strictEqual(element.tagName, 'image', 'An image-tagname should exist');

    const ctx = canvas.getContext('2d');

    ctx.drawImage(element, 0, 0);

    const firstPixelComponent = ctx.getImageData(0, 0, width, height).data[4];

    assert.strictEqual(
        firstPixelComponent,
        235,
        'First pixel-component should be this when chart is inverted'
    );

    const controller = new TestController(chart);

    controller.moveTo(plotLeft, plotTop);

    assert.ok(
        container.getElementsByClassName('highcharts-tooltip') !== undefined,
        'Should have tooltip when hovered'
    );
});