QUnit.test('Interpolated image test', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
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
                    [1, 2, 3.2]
                ],
                interpolation: true
            }
        ]
    });


    const heatmap = chart.series[0];

    assert.strictEqual(heatmap.image.element.tagName, 'image', 'An image-tagname should exist');

    const
        controller = new TestController(chart),
        { plotX, plotY } = heatmap.points[0],
        { container, plotLeft, plotTop } = chart;

    controller.moveTo(
        plotLeft + plotX,
        plotTop + plotY
    );

    assert.ok(
        container.getElementsByClassName('highcharts-tooltip') !== undefined,
        'Should have tooltip when hovered'
    );
});