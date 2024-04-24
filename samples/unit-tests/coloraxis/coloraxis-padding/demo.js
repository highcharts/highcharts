QUnit.test('Color axis width, height and padding', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'heatmap'
            },
            colorAxis: {
                min: -1,
                max: 1
            },

            series: [
                {
                    data: [
                        [0, 0, -1],
                        [0, 1, 1]
                    ]
                }
            ]
        }),
        colorAxisWidth = 100,
        colorAxisHeight = 50;

    assert.strictEqual(
        chart.colorAxis[0].toPixels(-1),
        0,
        'No left padding (#3379).'
    );

    chart.colorAxis[0].update({
        width: colorAxisWidth,
        height: colorAxisHeight
    });

    let colorAxisBox = chart.colorAxis[0].gridGroup.getBBox();

    assert.close(
        colorAxisBox.width,
        colorAxisWidth,
        1.01,
        'Color axis width should be set (#17870).'
    );

    assert.close(
        colorAxisBox.height,
        colorAxisHeight,
        1.01,
        'Color axis height should be set (#17870).'
    );

    chart.legend.update({
        layout: 'vertical'
    });

    colorAxisBox = chart.colorAxis[0].gridGroup.getBBox();

    assert.close(
        colorAxisBox.width,
        colorAxisWidth,
        1.01,
        'Color axis width with vertical layout should be set (#17870).'
    );

    assert.close(
        colorAxisBox.height,
        colorAxisHeight,
        1.01,
        'Color axis height with vertical layout should be set (#17870).'
    );

    chart.legend.update({
        layout: 'horizontal'
    }, false);

    chart.colorAxis[0].update({
        width: '50%',
        height: '10%'
    });

    colorAxisBox = chart.colorAxis[0].gridGroup.getBBox();

    assert.close(
        colorAxisBox.width,
        chart.chartWidth * 0.5,
        2,
        'Color axis width in perctange should be set (#17870).'
    );

    assert.close(
        colorAxisBox.height,
        chart.chartHeight * 0.1,
        2.5,
        'Color axis height in percentage should be set (#17870).'
    );

    chart.update({
        chart: {
            width: 200
        }
    });

    colorAxisBox = chart.colorAxis[0].gridGroup.getBBox();

    assert.close(
        colorAxisBox.width,
        chart.chartWidth * 0.5,
        2,
        'Color axis width should be changed after changing chart size.'
    );

    const symbolHeight = 50,
        symbolWidth = 250;

    chart.colorAxis[0].update({
        width: void 0,
        height: void 0
    }, false);

    chart.update({
        legend: {
            symbolHeight: 50,
            symbolWidth: 250
        }
    });

    colorAxisBox = chart.colorAxis[0].gridGroup.getBBox();

    assert.close(
        colorAxisBox.width,
        symbolWidth,
        1.01,
        'Color axis width should be set based on legend.symbolWidth (#20451).'
    );

    assert.close(
        colorAxisBox.height,
        symbolHeight,
        1.01,
        'Color axis height should be set based on legend.symbolHeight (#20451).'
    );
});

QUnit.test('Color axis padding with long labels (#15551)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            min: -1,
            max: 1000000,
            labels: {
                format: '{value:.,.0f}'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right'
        },

        series: [
            {
                data: [
                    [0, 0, -1],
                    [0, 1, 1000000]
                ]
            }
        ]
    });

    const labelWidth = chart.series[0].colorAxis.legendItem.labelWidth,
        shortWidth = 50;

    assert.ok(
        labelWidth > shortWidth,
        'Long labels should get enough width (#15551).'
    );
});
