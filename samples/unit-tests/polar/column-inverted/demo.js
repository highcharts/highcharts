QUnit.test('Positions of the points.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                polar: true,
                inverted: true
            },
            pane: {
                size: '100%'
            },
            xAxis: {
                tickInterval: 1
            },
            plotOptions: {
                series: {
                    borderWidth: 0
                }
            },
            series: [
                {
                    data: [3, 2, 2, 5, 8, 9, 10, 7]
                }
            ]
        }),
        series = chart.series[0],
        yAxis = series.yAxis,
        customSum = 0;

    assert.strictEqual(
        yAxis.startAngleRad,
        series.points[0].shapeArgs.start,
        'The first point\'s start is in a correct place.'
    );

    yAxis.update({
        min: 0,
        max: 5
    });

    assert.close(
        yAxis.endAngleRad,
        series.points[7].shapeArgs.end,
        0.00000001,
        'The last point\'s end is in a correct place.'
    );

    chart.update({
        plotOptions: {
            column: {
                threshold: -10
            }
        }
    });

    assert.strictEqual(
        yAxis.startAngleRad,
        series.points[0].shapeArgs.start,
        'The first point\'s start is in a correct place (threshold: -10).'
    );

    yAxis.update({
        min: 5,
        max: 0
    });

    series.points.forEach(function (point) {
        if (point.shapeArgs.start !== point.shapeArgs.end) {
            customSum++;
        }
    });

    assert.strictEqual(0, customSum, 'Points are outside the visible range.');

    customSum = 0;
    yAxis.update({
        min: -10,
        max: 0
    });

    series.points.forEach(function (point) {
        if (
            Highcharts.correctFloat(point.shapeArgs.end) ===
            Highcharts.correctFloat(yAxis.endAngleRad)
        ) {
            customSum++;
        }
    });

    assert.strictEqual(
        customSum,
        series.points.length,
        'All points are in the visible range.'
    );

    customSum = 0;
    chart.update({
        plotOptions: {
            column: {
                threshold: 0
            }
        }
    });

    series.points.forEach(function (point) {
        if (
            Highcharts.correctFloat(point.shapeArgs.end) !==
            Highcharts.correctFloat(yAxis.endAngleRad)
        ) {
            customSum++;
        }
    });

    assert.strictEqual(0, customSum, 'Points are outside the visible range.');
});

QUnit.test('Positions of the stacked points.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                polar: true,
                inverted: true
            },
            pane: {
                size: '100%'
            },
            xAxis: {
                tickInterval: 1
            },
            plotOptions: {
                series: {
                    borderWidth: 0
                }
            },
            series: [
                {
                    data: [3, 2, 2, 5, 8, 9, 10, 7]
                }
            ]
        }),
        firstSeries = chart.series[0],
        yAxis = firstSeries.yAxis,
        customSum = 0,
        secondSeries,
        i;

    chart.addSeries({
        data: [3, 2, 2, 5, 8, 9, 10, 7]
    });

    secondSeries = chart.series[1];
    for (i = 0; i < firstSeries.points.length; i++) {
        if (
            firstSeries.points[i].start === secondSeries.points[i].start &&
            firstSeries.points[i].end === secondSeries.points[i].end
        ) {
            customSum++;
        }
    }

    assert.strictEqual(
        customSum,
        firstSeries.points.length,
        'Series added correctly.'
    );

    chart.update({
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        }
    });

    assert.strictEqual(
        yAxis.max,
        firstSeries.stackedYData[6],
        'The Y axis\' range is correctly set.'
    );

    chart.pane[0].update({
        endAngle: 270
    });

    assert.strictEqual(
        yAxis.endAngleRad - yAxis.startAngleRad,
        yAxis.translate(firstSeries.stackedYData[6]),
        'The point[0] of both series are correctly stacked.'
    );

    chart.update({
        yAxis: {
            min: 0
        },
        plotOptions: {
            column: {
                threshold: -21
            }
        }
    });

    customSum = 0;
    chart.series.forEach(function (series) {
        series.points.forEach(function (point) {
            if (point.shapeArgs.start !== point.shapeArgs.end) {
                customSum++;
            }
        });
    });

    assert.strictEqual(
        0,
        customSum,
        'Points of all series are outside the visible range.'
    );
});
