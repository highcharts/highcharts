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
        columnRange = chart.series[1];

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
});
