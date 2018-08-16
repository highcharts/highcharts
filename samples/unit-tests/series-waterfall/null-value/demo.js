QUnit.test('The connector line in waterfall in case of a null value (#8024)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'waterfall',
                data: [120000, null, 231000, -342000, -233000]
            }]
        }),
        splittedPath = chart.series[0].graph.d.split(' '),
        startPoint = [splittedPath[4], splittedPath[5]],
        endPoint = [splittedPath[7], splittedPath[8]];

    // Test: the eqality of path's x coordinate of points next to each other
    assert.strictEqual(
        startPoint[0],
        endPoint[0],
        'The x coordinates are equal.'
    );

    // Test: the eqality of path's y coordinate of points next to each other
    assert.strictEqual(
        startPoint[1],
        endPoint[1],
        'The y coordinates are equal.'
    );
});
