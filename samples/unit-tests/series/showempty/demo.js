QUnit.test('Testing showEmpty feature and hasData function - #10106', function (assert) {
    // eslint-disable-next-line prefer-const
    const { yAxis: [axis] } = Highcharts.chart('container', {
        yAxis: [{}],
        series: [{
            data: []
        }]
    });

    assert.strictEqual(
        axis.options.showEmpty,
        true,
        'should have options.showEmpty default to true'
    );

    axis.update({
        showEmpty: false
    });
    assert.strictEqual(
        axis.showAxis,
        false,
        'The yAxis should be invisible'
    );
    assert.strictEqual(
        axis.hasData(),
        false,
        'Series has no data, so hasData function should return false'
    );

    axis.update({
        showEmpty: true
    });
    assert.strictEqual(
        axis.showAxis,
        true,
        'The yAxis should be visible'
    );
    assert.strictEqual(
        axis.hasData(),
        false,
        'Data is empty and there is no min and max values, so hasData function should return false'
    );

    axis.update({
        showEmpty: true,
        min: 0,
        max: 10
    });
    assert.strictEqual(
        axis.showAxis,
        true,
        'The yAxis should be visible'
    );
    assert.strictEqual(
        axis.hasData(),
        true,
        'HasData function should return true'
    );

    axis.update({
        showEmpty: false
    });

    assert.strictEqual(
        axis.showAxis,
        false,
        'The yAxis should be invisible'
    );
    assert.strictEqual(
        axis.hasData(),
        false,
        'ShowEmpty feature is set to false, so hasData function should return false'
    );

});
