QUnit.test('Axis.setBreaks', assert => {
    const {
        series: [{ points }],
        xAxis: [axis]
    } = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }]
    });
    const getXValuesOfNullPoints = points => points
        .filter(point => point.isNull)
        .map(point => point.x);

    axis.setBreaks([{
        from: 3,
        to: 6
    }]);

    assert.deepEqual(
        getXValuesOfNullPoints(points),
        [4, 5],
        'Should set points with x-values above 3 and below 6 as null points.'
    );

    axis.setBreaks([]);
    assert.deepEqual(
        getXValuesOfNullPoints(points),
        [],
        'Should have no null points after unsetting breaks. #11642'
    );
});