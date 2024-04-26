QUnit.test('Stock: general tests for the Cumulative Sum', function (assert) {
    const chart = Highcharts.chart('container', {

            plotOptions: {
                series: {
                    cumulative: true
                }
            },

            series: [{
                data: [0]
            }]

        }),
        dataArr1 = [1, 4, 5, 6],
        dataArr2 = [4, 5, 1, -3];

    assert.deepEqual(
        chart.series[0].dataModify.constructor
            .getCumulativeExtremes([1, 2, 3, 4, 5, 0]),
        [1, 15],
        'Data min and max should be calculated correctly.'
    );

    assert.deepEqual(
        chart.yAxis[0].tickPositions,
        [0],
        'The Y axis should have one tick at 0.'
    );

    chart.series[0].setData(dataArr1, false);

    chart.addSeries({
        data: dataArr2
    });

    assert.strictEqual(
        chart.yAxis[0].dataMax,
        Math.max(
            dataArr1.reduce((a, b) => a + b),
            dataArr2.reduce((a, b) => a + b)
        ),
        `The yAxis dataMax should be equal to the highest sum
        of each series' summed points.`
    );

    chart.update({
        plotOptions: {
            series: {
                cumulative: false
            }
        }
    });

    assert.notEqual(
        chart.series[0].points[2].plotY,
        chart.series[1].points[2].plotY,
        'The points should not overlap when cumulative is disabled.'
    );

    chart.yAxis[0].setCumulative(true);

    assert.strictEqual(
        chart.series[0].points[2].plotY,
        chart.series[1].points[2].plotY,
        'The points should have the same sum value and overlap (sum to 10).'
    );

    assert.strictEqual(
        chart.series[0].points[1].cumulativeSum,
        5,
        'Cumulative enabled - point.cumulativeSum should exist.'
    );

    chart.yAxis[0].setCumulative(false);

    assert.notOk(
        chart.series[0].points[1].cumulativeSum,
        'Cumulative disabled - point.cumulativeSum should be deleted.'
    );

    assert.strictEqual(
        chart.plotTop + chart.series[0].points[1].plotY,
        chart.yAxis[0].toPixels(chart.series[0].points[1].y),
        'Cumulative disabled - point should not be summed.'
    );

    chart.series[0].setCumulative(true);

    assert.strictEqual(
        chart.series[0].points[1].plotY,
        chart.series[1].points[1].plotY,
        `The two first points should be summed only in the first series.
        1 + 4 should be equal to 5 (second point of the second series).`
    );

    assert.strictEqual(
        chart.series[0].getDGApproximation(),
        'sum',
        `Default approximation when dataGrouping
        is enabled should be equal to sum, #18974.`
    );
});

QUnit.test('cumulative start option', function (assert) {
    const data = [1, 1, 1, 1, 1];
    const chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                cumulative: true
            }
        },
        xAxis: {
            tickInterval: 1,
            labels: {
                format: '{value}'
            },

            min: 1.1
        },
        series: [
            {
                cumulativeStart: true,
                data
            },
            {
                data
            }
        ]
    });

    const series = chart.series,
        point1 = series[0].points[1],
        point2 = series[1].points[1];

    assert.notEqual(
        point1.plotY,
        point2.plotY,
        'Points should have different position'
    );

    chart.xAxis[0].setExtremes(2.1, null);

    assert.notEqual(
        series[0].points[2].plotY,
        series[1].points[2].plotY,
        'Points should have different position'
    );

    chart.xAxis[0].setExtremes(1.1, null);

    assert.notEqual(
        point1,
        chart.yAxis[0].toPixels(0),
        'Frist Point should start at 0'
    );
});
