QUnit.test('Testing showEmpty feature and hasData function - #10106', function (assert) {
    // eslint-disable-next-line prefer-const
    let chart = Highcharts.chart('container', {

        yAxis: [{
            showEmpty: false
        }],
        series: [{
            data: []
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].showAxis,
        false,
        'The yAxis should be invisible'
    );
    assert.strictEqual(
        chart.yAxis[0].hasData(),
        false,
        'Series has no data, so hasData function should return false'
    );

    chart.yAxis[0].update({
        showEmpty: true
    });
    assert.strictEqual(
        chart.yAxis[0].showAxis,
        true,
        'The yAxis should be visible'
    );
    assert.strictEqual(
        chart.yAxis[0].hasData(),
        false,
        'Data is empty and there is no min and max values, so hasData function should return false'
    );

    chart.yAxis[0].update({
        showEmpty: true,
        min: 0,
        max: 10
    });
    assert.strictEqual(
        chart.yAxis[0].showAxis,
        true,
        'The yAxis should be visible'
    );
    assert.strictEqual(
        chart.yAxis[0].hasData(),
        true,
        'HasData function should return true'
    );

    chart.yAxis[0].update({
        showEmpty: false
    });

    assert.strictEqual(
        chart.yAxis[0].showAxis,
        false,
        'The yAxis should be invisible'
    );
    assert.strictEqual(
        chart.yAxis[0].hasData(),
        false,
        'ShowEmpty feature is set to false, so hasData function should return false'
    );

});
