QUnit.test('Bubble legend ranges', function (assert) {
    var chart = Highcharts.chart('container', {
        legend: {
            bubbleLegend: {
                enabled: true
            }
        },

        series: [
            {
                type: 'bubble',
                data: [
                    [1, 1, 1],
                    [2, 2, 2]
                ]
            },
            {
                type: 'line',
                data: [2, 2, 2]
            }
        ]
    });

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges.length === 3,
        true,
        'Correct number of ranges has been calculated'
    );

    assert.close(
        chart.legend.bubbleLegend.ranges[0].radius,
        chart.series[0].points[1].marker.radius,
        1,
        'Correct ranges sizes'
    );

    chart.series[0].points[0].remove();

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges.length === 1,
        true,
        'Correct number of ranges after data change'
    );

    chart.legend.update({
        bubbleLegend: {
            ranges: [
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4, color: 'red' }
            ]
        }
    });

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges.length === 4 &&
            chart.legend.bubbleLegend.ranges[0].bubbleAttribs.fill === 'red',
        true,
        'Correct options and number of ranges after legend update'
    );

    chart.legend.update({
        bubbleLegend: {
            ranges: []
        }
    });

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges.length === 1,
        true,
        'Correct number of ranges after changing the way of calculating'
    );
});

QUnit.test('Bubble legend ranges sizes', function (assert) {
    var chart = Highcharts.chart('container', {
        legend: {
            bubbleLegend: {
                enabled: true
            }
        },
        chart: {
            type: 'bubble',
            styledMode: true
        },
        series: [
            {
                data: [
                    [1, 1, 1],
                    [1, 2, 2]
                ]
            },
            {
                data: [[2, 1, 3]]
            },
            {
                data: [
                    [3, 1, 6],
                    [3, 2, 4]
                ]
            }
        ]
    });

    assert.close(
        chart.legend.bubbleLegend.ranges[0].radius,
        chart.series[2].points[0].marker.radius,
        1,
        'Correct ranges sizes with multiple bubble series'
    );

    chart.series[2].points[0].remove();

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges[0].value === 4 &&
            chart.legend.bubbleLegend.ranges[2].value === 1,
        true,
        'Correct bubble legend values'
    );

    chart.series[0].setData([[1, 1, 100]]);

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges[0].value === 100 &&
            chart.legend.bubbleLegend.ranges[2].value === 3,
        true,
        'Correct bubble legend values after setData'
    );

    assert.close(
        chart.legend.bubbleLegend.ranges[2].radius,
        chart.series[1].points[0].marker.radius,
        1,
        'Correct ranges sizes after setData'
    );

    chart.series[1].setData([[1, 1, -100]]);

    assert.strictEqual(
        chart.legend.bubbleLegend.symbols.bubbleItems.length === 2,
        true,
        'Correct bubble legend ranges with negative values'
    );

    chart.legend.update({
        bubbleLegend: {
            zThreshold: -100
        }
    });

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges[2].value === -100,
        true,
        'Correct bubble legend ranges with zThreshold'
    );

    // #15359
    chart.series[0].update({
        colorIndex: 2
    });

    var bubbleLegendClass = chart.legend.bubbleLegend.symbols.bubbleItems[0]
        .element.classList[0];

    assert.strictEqual(
        bubbleLegendClass,
        'highcharts-color-2',
        'The colorIndex should be set. (#15359)'
    );
});
