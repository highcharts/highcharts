/* eslint func-style:0 */


QUnit.test('Paddings and extremes', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            polar: true
        },
        xAxis: {
            maxPadding: 0,
            minPadding: 0
        },
        series: [{
            data: [67, 29, 70, 91, 59, 53, 17, 63, 20, 31, 31]
        }]

    });

    // Axis setExtremes caused padded axis (#5662)
    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Axis initially padded as per autoConnect (#5662).'
    );


    chart.xAxis[0].setExtremes(4, 10);

    assert.strictEqual(
        chart.xAxis[0].max,
        10,
        'Data max same as before, but padding is now gone because we have hard extremes (#5662).'
    );

    // #7996
    chart.series[0].setData([2, 1, 2, 1, 2, 2], false);
    chart.xAxis[0].setExtremes(null, null);

    Highcharts.each([15, 120, 135, 225, 285, 300], function (startAngle) {
        chart.update({
            pane: {
                startAngle: startAngle
            }
        });
        assert.strictEqual(
            chart.xAxis[0].autoConnect,
            true,
            'Extra space added when startAngle=' + startAngle + ' (#7996).'
        );
    });
});
