QUnit.test('Bubble legend ranges', function (assert) {
    let bubbleLegendFormatterCtx;

    const chart = Highcharts.chart('container', {
        legend: {
            align: 'right',
            layout: 'vertical',
            bubbleLegend: {
                enabled: true,
                labels: {
                    formatter: ctx => {
                        bubbleLegendFormatterCtx = ctx;
                        return 'some text';
                    }
                },
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

    assert.strictEqual(
        chart.legend.allItems[1].symbols.labels[1].textStr === 'some text',
        true,
        'Correct label text'
    );

    assert.strictEqual(
        chart.legend.bubbleLegend.ranges.indexOf(bubbleLegendFormatterCtx) > -1,
        true,
        'Bubble legend formatter got ctx'
    );

    const bubbleLegendItem = chart.legend.bubbleLegend.legendItem.group;
    const seriesItem = chart.legend.allItems[0].legendItem.group;

    assert.strictEqual(
        bubbleLegendItem.translateY > seriesItem.translateY &&
            bubbleLegendItem.translateX === seriesItem.translateX,
        true,
        'The legend layout is correct'
    );

    chart.legend.update({
        enabled: false
    });

    assert.strictEqual(
        !chart.legend.bubbleLegend.legendItem,
        true,
        'Bubble legend was properly disabled with the legend'
    );
});
