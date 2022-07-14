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

    bubbleLegendItem = chart.legend.bubbleLegend.legendGroup;
    seriesItem = chart.legend.allItems[0].legendGroup;

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
        !chart.legend.bubbleLegend.legendGroup,
        true,
        'Bubble legend was properly disabled with the legend'
    );

    const initialBubbleZExtremes = chart.bubbleZExtremes;
    chart.series[0].addPoint([1, 15, 100]);
    chart.series[0].remove();
    chart.addSeries({
        type: 'bubble',
        data: [
            [1, 1, 1],
            [2, 2, 2]
        ]
    });

    assert.deepEqual(
        initialBubbleZExtremes,
        chart.bubbleZExtremes,
        `Newly added series and the chart bubbleZExtremes should not be polluted
        by the previous series that has been removed, #17486.`
    );
});
