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
});

QUnit.test('Bubble legend styled mode', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble',
            styledMode: true
        },

        legend: {
            enabled: true,
            bubbleLegend: {
                enabled: true
            }
        },

        series: [{
            colorIndex: 2,
            showInLegend: false,
            data: [
                { x: 95, y: 95, z: 20 }
            ]
        }]

    });

    var bubbleLegendClass = chart.legend.bubbleLegend.symbols.bubbleItems[0]
        .element.classList[0];

    assert.strictEqual(
        bubbleLegendClass,
        'highcharts-color-2',
        'The colorIndex should be set. (#15359)'
    );
});
