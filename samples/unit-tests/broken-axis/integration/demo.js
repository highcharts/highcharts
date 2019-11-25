QUnit.test('Axis.setBreaks', assert => {
    const {
        series: [series],
        series: [{ points }],
        xAxis: [axis]
    } = Highcharts.chart('container', {
        series: [{
            connectNulls: true,
            data: [1, 2, 3, 4, null, 6, 7, 8, 9, 10]
        }]
    });
    const getXValuesOfInvisiblePoints = points => points
        .filter(point => !point.visible)
        .map(point => point.x);

    axis.setBreaks([{
        from: 3,
        to: 6
    }]);

    assert.deepEqual(
        getXValuesOfInvisiblePoints(points),
        [4, 5],
        'Should set point.visible to false for points with x-values above 3 and below 6.'
    );

    series.update({
        connectNulls: false
    });
    assert.deepEqual(
        getXValuesOfInvisiblePoints(points),
        [5],
        'Should set point.visible to false for points with x-values above 3 and below 6, except for null points when series connectNulls is false.'
    );

    axis.setBreaks([]);
    assert.deepEqual(
        getXValuesOfInvisiblePoints(points),
        [],
        'Should all points should have point.visible equals true after unsetting breaks. #11642'
    );
});