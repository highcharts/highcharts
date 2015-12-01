
$(function () {
    QUnit.test("tickInterval option should take precedence over data range", function (assert) {
        var chart = $("#container").highcharts({
            xAxis: {
                min: 0,
                max: 12,
                tickInterval: 1
            },
            series: [{
                type: 'column',
                //pointRange: 1,
                data: [
                    [7, 7],
                    [10, 8]
                ]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].tickInterval,
            1,
            'Actual tick interval is as option'
        );
    });
});