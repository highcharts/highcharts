QUnit.test('stateMarkerGraphic', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [
                        {
                            y: 1,
                            color: 'red'
                        },
                        {
                            y: 2,
                            color: 'blue'
                        }
                    ],
                    marker: {
                        radius: 1
                    }
                }
            ],
            xAxis: {
                minRange: 15000000000
            }
        }),
        series = chart.series[0],
        point = series.points[0];
    point.setState('hover');
    assert.strictEqual(
        series.stateMarkerGraphic.element.getAttribute('fill'),
        'red',
        'stateMarkerGraphic should have fill: "red" when hovering first point.'
    );

    // Test with second point
    point = series.points[1];
    point.setState('hover');
    assert.strictEqual(
        series.stateMarkerGraphic.element.getAttribute('fill'),
        'blue',
        'stateMarkerGraphic should have fill: "blue" when hovering second point.'
    );
});

QUnit.test('Inactive state and legend', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    visible: false,
                    name: 'John',
                    data: [5, 3, 4, 7, 2]
                },
                {
                    name: 'Jane',
                    data: [2, -2, -3, 2, 1]
                }
            ]
        }),
        series = chart.series,
        legend = chart.legend,
        legendItemBox = legend.allItems[0].legendItem.label.getBBox(),
        controller = new TestController(chart),
        xPosition =
            legend.group.translateX + legendItemBox.x + legendItemBox.width / 2,
        yPosition =
            legend.group.translateY +
            legendItemBox.y +
            legendItemBox.height / 2;

    controller.mouseMove(xPosition, yPosition);

    assert.strictEqual(
        series[1].group.attr('opacity'),
        1,
        'Hovering hidden series should not inactive other series (#11301)'
    );

    controller.click(xPosition, yPosition);

    assert.strictEqual(
        series[1].group.attr('opacity'),
        0.2,
        'Showing hidden series should inactivate other series (#11301)'
    );

    controller.click(xPosition, yPosition);

    assert.strictEqual(
        series[1].group.attr('opacity'),
        1,
        'Disabling visible series should not inactivate other series (#11301)'
    );
});

QUnit.test('Keep state after the redraw call #13719', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            events: {
                render() {
                    const chart = this;

                    chart.series.forEach(function (s) {
                        s.setState('inactive');
                    });
                    chart.series[0].setState('hover');
                }
            }
        },
        series: [
            {
                data: [
                    43934,
                    52503,
                    57177,
                    69658,
                    97031,
                    119931,
                    137133,
                    154175
                ]
            },
            {
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            },
            {
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }
        ]
    });

    chart.reflow();

    var series = chart.series[1];

    assert.strictEqual(
        series.group.attr('opacity'),
        0.2,
        'The opacity should be set as default value for the inactive state #13719'
    );
});
