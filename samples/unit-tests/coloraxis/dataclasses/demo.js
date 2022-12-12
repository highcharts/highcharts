QUnit.test('Data classes and redundant text labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {
            dataClasses: [
                {
                    to: 3
                },
                {
                    from: 3,
                    to: 10
                },
                {
                    from: 10,
                    to: 30
                },
                {
                    from: 30,
                    to: 100
                },
                {
                    from: 100,
                    to: 300
                },
                {
                    from: 300,
                    to: 1000
                },
                {
                    from: 1000
                }
            ]
        },
        series: [
            {
                data: [
                    [0, 1, 0],
                    [1, 2, 1]
                ]
            },
            {
                data: [
                    [3, 1, 100],
                    [4, 2, 600]
                ]
            }
        ]
    });

    assert.strictEqual(
        Object.keys(chart.colorAxis[0].ticks).length,
        0,
        'Data class axis has no ticks (#6914)'
    );

    var initialChildLength = chart.container.querySelectorAll(
        '.highcharts-legend .highcharts-legend-item'
    ).length;

    chart.addSeries({
        type: 'pie',
        data: [1, 3, 2, 4]
    });

    assert.strictEqual(
        chart.container.querySelectorAll(
            '.highcharts-legend .highcharts-legend-item'
        ).length,
        initialChildLength,
        'The number of child nodes should not change after adding a pie (#8478)'
    );
});

QUnit.test('Data classes - interactions', function (assert) {
    var chart = Highcharts.chart('container', {
            colorAxis: {
                dataClasses: [
                    {
                        from: 0,
                        to: 1,
                        color: '#FF0000'
                    },
                    {
                        from: 1,
                        to: 2,
                        color: '#0000FF'
                    }
                ]
            },
            series: [
                {
                    type: 'scatter',
                    data: [
                        {
                            y: 0,
                            x: 0
                        },
                        {
                            y: 1,
                            x: 1
                        }
                    ]
                }
            ]
        }),
        test = TestController(chart),
        point = chart.series[0].points[0],
        pointPos = {
            x: chart.plotLeft + point.plotX,
            y: chart.plotTop + point.plotY
        },
        legend = chart.legend,
        legendItemBBox = legend.allItems[0].legendItem.group.getBBox(true),
        legendItemX =
            legend.group.translateX +
            legendItemBBox.x +
            legendItemBBox.width / 2,
        legendItemY =
            legend.group.translateY +
            legendItemBBox.y +
            legendItemBBox.height / 2;

    test.click(legendItemX, legendItemY);
    test.mouseMove(pointPos.x, pointPos.y);

    assert.strictEqual(
        chart.hoverPoint,
        chart.series[0].points[1],
        'The hidden point should not be hovered.'
    );

    test.click(legendItemX, legendItemY);
    test.mouseMove(pointPos.x, pointPos.y);

    assert.strictEqual(
        chart.hoverPoint,
        point,
        'The shown point should be hovered.'
    );
});
