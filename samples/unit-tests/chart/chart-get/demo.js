/* eslint func-style:0 */


QUnit.test('Chart.get', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: [{
            id: 'primary-x'
        }, {
            id: 'secondary-x'
        }],
        yAxis: [{
            id: 'primary-y'
        }, {
            id: 'secondary-y'
        }],
        series: [{
            // no data
        }, {
            data: [1, 2, 3, 4]
        }, {
            data: [5, 4, null, { id: 'point-id', y: 7 }],
            xAxis: 'secondary-x',
            yAxis: 'secondary-y',
            id: 'second-series'
        }]
    });

    assert.strictEqual(
        chart.get('bogus'),
        undefined,
        'Item not found'
    );

    assert.strictEqual(
        chart.get('primary-x').options.id,
        'primary-x',
        'X axis found'
    );

    assert.strictEqual(
        chart.get('secondary-x').options.id,
        'secondary-x',
        'X axis found'
    );

    assert.strictEqual(
        chart.get('secondary-y').options.id,
        'secondary-y',
        'X axis found'
    );

    assert.strictEqual(
        chart.get('second-series').options.id,
        'second-series',
        'Series found'
    );

    assert.strictEqual(
        chart.get('point-id').options.id,
        'point-id',
        'Point found'
    );

    // Point id not in options
    chart.series[1].points[0].id = 'first';
    assert.strictEqual(
        chart.get('first').id,
        'first',
        'Point found'
    );


    // Chart.get between redraws (#6147)
    // Changing number of points
    chart.get('second-series').setData([1, 2, 3], false);
    assert.strictEqual(
        chart.get('third-series'),
        undefined,
        'No crash between redraws'
    );
    chart.redraw(false);
});

/*QUnit.test('Chart.get between redraws (#6147)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            name: 'test',
            id: 'test',
            data: [
                [0, 1],
                [1, 2]
            ]
        }]
    });

    assert.strictEqual(
        chart.get('test').id,
        'test',
        'Series found'
    );
});*/
