QUnit.test("#6895 - clipping rectangle after set extremes.", function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            boostThreshold: 1,
            data: [
                [0, 0],
                [0, 1],
                [0, 2],
                [0, 3],
                [0, 4]
            ]
        }]
    });

    chart.yAxis[0].setExtremes(1, 2);

    assert.strictEqual(
        chart.series[0].boostClipRect.attr('height'),
        chart.plotHeight,
        'Correct height of the clipping box.'
    );
});
