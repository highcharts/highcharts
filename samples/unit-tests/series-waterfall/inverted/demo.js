QUnit.test('#5911 - inverted and reversed axes.', function (assert) {
    // Note: Test updates chart multiple times, to test all edge cases.
    var chart = Highcharts.chart('container', {
            chart: {
                inverted: true
            },
            yAxis: {
                reversed: true
            },
            xAxis: {
                reversed: true
            },
            series: [{
                type: 'waterfall',
                data: [10, 10, 10]
            }, {
                type: 'columnrange',
                pointPadding: 0.3,
                data: [[0, 10], [10, 20], [20, 30]]
            }]
        }),
        columnRange = chart.series[1],
        xAxisReversed = chart.xAxis[0].reversed,
        splittedPath = chart.series[0].graph.d.split(' '),
        lineLength = Math.abs(+splittedPath[4] - +splittedPath[1]),
        points = chart.series[0].points,
        boxP1 = points[0].graphic.getBBox(true),
        boxP2 = points[1].graphic.getBBox(true),
        distanceBetweenPoints = xAxisReversed ?
            Math.abs(boxP1.x - (boxP2.x + boxP2.width)) :
            Math.abs(boxP2.x - (boxP1.x + boxP1.width));

    function compareWithColumnRange(xAxisReversed, yAxisReversed) {
        Highcharts.each(chart.series[0].points, function (point, index) {
            Highcharts.each(
                [
                    ['plotX', 'plotX'],
                    ['plotY', 'plotHigh']
                ],
                function (prop) {
                    assert.close(
                        point[prop[0]],
                        // Columnrange can have switched plotHigh and plotLow..
                        Math.min(
                            columnRange.points[index][prop[0]],
                            columnRange.points[index][prop[1]]
                        ),
                        1,
                        'xAxis.reversed=' + xAxisReversed +
                            ' yAxis.reversed=' + yAxisReversed +
                            ' Property: ' + prop[0] +
                            ' for a point x=' + point.x +
                            ' for waterfall and columnrange are the same.'
                    );
                }
            );
        });
    }

    // Test: inverted and both axes reversed
    compareWithColumnRange(true, true);

    chart.update({
        xAxis: {
            reversed: false
        }
    });
    // Test: inverted and yAxis reversed
    compareWithColumnRange(false, true);

    chart.update({
        yAxis: {
            reversed: false
        }
    });
    // Test: inverted and none of axes reversed
    compareWithColumnRange(false, false);

    chart.update({
        xAxis: {
            reversed: true
        }
    });
    // Test: inverted and xAxis reversed
    compareWithColumnRange(true, false);

    // Test: connector line length
    assert.deepEqual(
        lineLength,
        distanceBetweenPoints,
        "Connector line is equal to distance between points (#4699)."
    );
});
