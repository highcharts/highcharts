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
        { container, series, chartWidth } = chart,
        { image: { element }, points } = series[0],
        { plotX, plotY } = points[0];

    assert.strictEqual(element.tagName, 'image', 'An image-tagname should exist');

    assert.ok(
        element.getAttribute('height') > (chartWidth / 2),
        'Image should have a larger height than half the chart-width when inverted.'
    );

    const controller = new TestController(chart);

    controller.moveTo(plotX, plotY);

    assert.ok(
        container.getElementsByClassName('highcharts-tooltip') !== undefined,
        'Should have tooltip when hovered'
    );
});