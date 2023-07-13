QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        bubble = options.plotOptions.bubble;
    // stickyTracking is true to avoid hiding the tooltip when follow pointer is true.
    assert.strictEqual(
        bubble.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});

QUnit.test('Axis extremes', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },
        xAxis: {
            min: 2
        },
        series: [
            {
                data: [
                    {
                        x: 1,
                        y: 1,
                        z: 1
                    }
                ]
            },
            {
                data: [
                    {
                        x: 3,
                        y: 3,
                        z: 3
                    }
                ]
            }
        ]
    });
    assert.strictEqual(chart.xAxis[0].min, 2, 'Axis min should be exactly 2.');
    assert.ok(
        chart.xAxis[0].max > 3,
        'Axis max should be more than max data (#8902)'
    );

    chart.series[0].data[0].update({ z: 0 });

    assert.strictEqual(
        chart.bubbleZExtremes.zMin,
        0,
        'zMin is calculated correctly when there is a point with Z = 0 (#17280)'
    );

    chart.series[1].data[0].update({ z: -3 });

    assert.strictEqual(
        chart.bubbleZExtremes.zMax,
        0,
        'zMax is calculated correctly when there is a point with Z = 0 (#17280)'
    );
});

QUnit.test('Negative values', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },

        series: [
            {
                data: [
                    [9, -10, -10],
                    [58, 15, -5],
                    [98, 5, 0],
                    [68, -10, 5],
                    [51, 50, 10]
                ],
                displayNegative: true,
                zThreshold: -7.5
            }
        ]
    });

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.negative;
        }),
        [true, false, false, false, false],
        'Only points below zThreshold should have point.negative'
    );

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.graphic.hasClass('highcharts-negative');
        }),
        [true, false, false, false, false],
        'Only points below zThreshold should have negative class name'
    );
});

QUnit.test('Align dataLabel', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },
        yAxis: {
            min: 0,
            max: 5
        },
        plotOptions: {
            series: {
                clip: false,
                dataLabels: {
                    overflow: 'allow',
                    crop: false,
                    enabled: true
                }
            }
        },
        series: [
            {
                data: [{
                    x: 2,
                    y: 3,
                    z: 5
                }]
            }, {
                data: [{
                    x: 1,
                    y: 2,
                    z: 8
                }]
            }, {
                data: [{
                    x: 1,
                    y: 0,
                    z: 10
                }]
            }
        ]
    });

    const point = chart.series[2].points[0], // Access the point data
        dataLabel = point.dataLabel,
        dataLabelBBox = dataLabel.element.getBBox();

    // Calculate the position of the dataLabel, considering possible displacements
    const dataLabelPosX = dataLabelBBox.x + dataLabel.options.x,
        dataLabelPosY = dataLabelBBox.y + dataLabel.options.y;

    // Check if the dataLabel is outside the plotArea
    const isOutsidePlotArea =
        dataLabelPosX < chart.plotLeft ||
        dataLabelPosY < chart.plotTop ||
        dataLabelPosX + dataLabelBBox.width >
        chart.plotLeft + chart.plotWidth ||
        dataLabelPosY + dataLabelBBox.height >
        chart.plotTop + chart.plotHeight;

    // Assert if the dataLabel exists
    assert.ok(
        dataLabel,
        'Data label exists'
    );

    // Assert if the dataLabel is outside the plotArea
    assert.ok(
        isOutsidePlotArea,
        'Data label is outside the plotArea'
    );
});
