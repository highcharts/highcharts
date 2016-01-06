
$(function () {
    QUnit.test('Legend checkbox position with title', function (assert) {
        var chart = $("#container").highcharts({
            series: [{
                data: [1, 2, 3]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series.length,
            1,
            'Chart is created'
        );
    });
});