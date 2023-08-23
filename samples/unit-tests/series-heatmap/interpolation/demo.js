QUnit.test('Interpolated image test', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            inverted: true
        },

        colorAxis: {
            stops: [
                [0, 'rgba(64, 16, 104, 1)'],
                [0.99, 'rgba(160, 255, 48, 1)']
            ]
        },

        series: [
            {
                data: [
                    [0, 0, 2],
                    [0, 1, 3.1],
                    [0, 2, 4.2],
                    [1, 0, 5],
                    [1, 1, 6.1],
                    [1, 2, 7.2],
                    [2, 0, 8],
                    [2, 1, 9.1],
                    [2, 2, 10.2],
                    [3, 0, 11],
                    [3, 1, 12.1],
                    [3, 2, 13.2],
                    [4, 0, 14],
                    [4, 1, 15.1],
                    [4, 2, 16.2],
                    [5, 0, 17],
                    [5, 1, 18.1],
                    [5, 2, 19.2],
                    [6, 0, 20],
                    [6, 1, 21.1],
                    [6, 2, 22.2],
                    [7, 0, 23],
                    [7, 1, 24.1],
                    [7, 2, 25.2]
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