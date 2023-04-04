QUnit.test('Bubble legend ranges', function (assert) {
    var bubbleLegendItem,
        seriesItem,
        chart = Highcharts.chart('container', {
            legend: {
                align: 'right',
                layout: 'vertical',
                bubbleLegend: {
                    enabled: true,
                    legendIndex: 0
                }
            },

            series: [
                {
                    type: 'bubble',
                    data: [
                        [1, 1, 1],
                        [2, 2, 2]
                    ]
                }
            ]
        });

    // Check if there is only one bubble-legend
    assert.strictEqual(
        chart.legend.allItems.length === 2,
        true,
        'Bubble legend correctly added with map module (#10101)'
    );

    chart.legend.update({
        bubbleLegend: {
            legendIndex: 1
        }
    });

    assert.strictEqual(
        chart.legend.allItems[1].ranges.length === 3,
        true,
        'Bubble legend was properly positioned'
    );

    bubbleLegendItem = chart.legend.bubbleLegend.legendItem.group;
    seriesItem = chart.legend.allItems[0].legendItem.group;

    assert.strictEqual(
        bubbleLegendItem.translateY > seriesItem.translateY &&
            bubbleLegendItem.translateX === seriesItem.translateX,
        true,
        'The legend layout is correct'
    );

    chart.setSize(400, 500);

    assert.close(
        chart.legend.allItems[1].ranges[0].radius,
        chart.series[0].points[1].marker.radius,
        1,
        'Correct bubble legend sizes after changing chart size'
    );

    chart.legend.update({
        floating: true
    });

    assert.close(
        chart.legend.allItems[1].ranges[0].radius,
        chart.series[0].points[1].marker.radius,
        1,
        'Correct bubble legend sizes with floating legend'
    );

    chart.legend.update({
        enabled: false
    });

    assert.strictEqual(
        !chart.legend.bubbleLegend.legendItem,
        true,
        'Bubble legend was properly disabled with the legend'
    );

    chart.addSeries({
        type: 'bubble',
        data: [
            [1, 4, 4],
            [2, 5, 5]
        ],
        events: {
            legendItemClick(e) {
                e.preventDefault();
            }
        }
    }, false);

    chart.legend.update({
        enabled: true,
        floating: false
    });

    chart.series[1].legendItem.group.element.dispatchEvent(new Event('click'));
    chart.series[0].legendItem.group.element.dispatchEvent(new Event('click'));

    assert.ok(
        true,
        `There shouldn't be any error in the console, when one series
        legendItemClick has prevented the event and we click both legend
        items (#14080).`
    );

    assert.notOk(
        isNaN(chart.legend.bubbleLegend.legendItem.labelHeight),
        `Bubble legend should work correctly, when one series
        legendItemClick has prevented the event and we click both legend
        items (#14080).`
    );

    assert.notOk(
        isNaN(chart.legend.bubbleLegend.legendItem.labelWidth),
        `Bubble legend should work correctly, when one series
        legendItemClick has prevented the event and we click both legend
        items (#14080).`
    );
});

QUnit.test('Negative values (#9678)', function (assert) {
    assert.expect(0); // Only expect it not to fail
    Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },

        legend: {
            bubbleLegend: {
                enabled: true
            }
        },

        series: [
            {
                data: [
                    { x: 1, y: 1, z: -1 },
                    { x: 2, y: 2, z: -2 }
                ]
            }
        ]
    });
});

QUnit.test('Bubble legend with maps', function (assert) {
    var chart = Highcharts.mapChart('container', {
        legend: {
            bubbleLegend: {
                enabled: true
            }
        },
        series: [
            {
                mapData: Highcharts.maps['countries/bn/bn-all']
            },
            {
                joinBy: ['code', 'iso-a2'],
                type: 'mapbubble',
                data: [
                    ['tu', 10],
                    ['be', 20]
                ]
            }
        ]
    });

    assert.strictEqual(
        Object.keys(chart.yAxis[0].ticks).length,
        0,
        'Grid lines and ticks should not be rendered (#11448).'
    );
});
