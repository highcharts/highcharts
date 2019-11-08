QUnit.test('#12248 - Correct visible range for points.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                stacking: 'overlap'
            }
        },
        series: [{
            stack: 'a',
            data: [-10],
            zIndex: 1
        }, {
            stack: 'a',
            data: [30]
        }, {
            stack: 'b',
            data: [-10],
            zIndex: 1
        }, {
            stack: 'b',
            data: [20]
        }]
    });

    var firstSeries = chart.series[0],
        yAxis = chart.yAxis[0],
        yMax = yAxis.max,
        stackState = [0, 30, 20];

    firstSeries.setVisible(false);
    firstSeries.setVisible(true);

    assert.strictEqual(
        yMax,
        yAxis.max,
        'The initial yAxis.max should be unchanged.'
    );

    assert.strictEqual(
        stackState.length,
        yAxis.waterfallStacks[firstSeries.stackKey][0].stackState.length,
        'The number of the first stack\'s states should be unchanged.'
    );
});
