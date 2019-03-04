

QUnit.test('Floor and ceiling', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            ceiling: 5,
            minPadding: 0,
            maxPadding: 0
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    var axis = chart.xAxis[0];
    assert.deepEqual(
        [axis.min, axis.max],
        [0, 2],
        'Lower data should be preserved'
    );

    chart.series[0].setData([1, 2, 3, 4, 5, 6, 7, 8]);

    assert.deepEqual(
        [axis.min, axis.max],
        [0, 5],
        'Axis should be capped'
    );

    axis.setExtremes(3, 8);
    assert.deepEqual(
        [axis.min, axis.max],
        [3, 8],
        'setExtremes trumps ceiling (#9618)'
    );
});
