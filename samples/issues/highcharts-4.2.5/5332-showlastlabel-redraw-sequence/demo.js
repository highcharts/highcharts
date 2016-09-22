QUnit.test('Show last label hiding interrupted by animation', function (assert) {

    var done = assert.async();

    var chart = Highcharts.chart('container', {
        chart: {
            animation: {
                duration: 1
            },
            width: 300,
            height: 300
        },
        series: [{
            data: [25, 125]
        }],
        yAxis: {
            showLastLabel: false
        }
    });

    assert.ok(
        chart.yAxis[0].ticks[50].label.attr('y') > 0,
        '50 label is placed'
    );

    chart.xAxis[0].update({
        minTickInterval: 1
    });
    chart.series[0].setData([14, 40]);

    setTimeout(function () {
        assert.ok(
            chart.yAxis[0].ticks[50].label.attr('y') < 0,
            '50 label is hidden'
        );

        done();
    }, 50);
});