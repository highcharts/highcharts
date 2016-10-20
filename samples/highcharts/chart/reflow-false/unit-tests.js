QUnit.test('Set width', function (assert) {

    var chart = Highcharts.charts[0],
        chartWidth = chart.chartWidth,
        containerWidth = $('#container').width(),
        done = assert.async();


    assert.strictEqual(
        typeof chartWidth,
        'number',
        'Width is set'
    );

    // Change the container size and trigger window resize to make the chart resize
    $('#container').width(300);
    $(window).resize();

    setTimeout(function () {
        assert.notEqual(
            containerWidth,
            $('#container').width(),
            'Container width has changed'
        );
        assert.strictEqual(
            chart.chartWidth,
            chartWidth,
            'Chart width has not changed'
        );
        done();
    }, 200);

});