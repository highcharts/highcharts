
$(function () {
    QUnit.test("CropThreshold should not interfere with getExtremesFromAll.", function (assert) {
        var chart = $('#container').highcharts({
            xAxis: {
                max: 3
            },
            series: [{
                getExtremesFromAll: true,
                type: "column",
                cropThreshold: 4,
                data: [10, 20, 11, 12, 15, 100]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.yAxis[0].max >= 100,
            true,
            "Proper extremes on yAxis."
        );
    });
});