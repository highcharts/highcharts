QUnit.test('Set width', function (assert) {

    var chart = Highcharts.charts[0],
        width = chart.chartWidth,
        done = assert.async();


    assert.strictEqual(
        typeof width,
        'number',
        'Width is set'
    );

    // Change the container size and trigger window resize to make the chart resize
    $('#container').width(300);
    Highcharts.fireEvent(window, 'resize');

    setTimeout(function () {
        assert.strictEqual(
            chart.chartWidth === width,
            false,
            'Width has changed'
        );
        done();
    }, 200);

});