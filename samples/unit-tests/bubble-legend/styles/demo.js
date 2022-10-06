QUnit.test('Bubble legend ranges', function (assert) {
    var bubbleLegendItem,
        seriesItem,
        chart = Highcharts.chart('container', {
            legend: {
                align: 'right',
                layout: 'vertical',
                bubbleLegend: {
                    enabled: true,
                    labels: {
                        formatter: function () {
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

    bubbleLegendItem = chart.legend.bubbleLegend.legendItem.group;
    seriesItem = chart.legend.allItems[0].legendItem.group;

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
