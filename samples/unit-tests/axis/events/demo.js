QUnit.test('Events got lost after Axis.update (#5773)', function (assert) {

    var tick = 0;

    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        xAxis: {
            events: {
                afterSetExtremes: function () {
                    tick++;
                },
                setExtremes: function () {
                    tick++;
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0],
            animation: false
        }]
    });

    assert.strictEqual(
        tick,
        0,
        'Nothing yet'
    );

    chart.xAxis[0].setExtremes(2, 8);
    assert.strictEqual(
        tick,
        2,
        'Two events called'
    );

    chart.xAxis[0].update({
        minRange: 1
    });


    chart.xAxis[0].setExtremes(3, 7);
    assert.strictEqual(
        tick,
        4,
        'Four events called'
    );
});
