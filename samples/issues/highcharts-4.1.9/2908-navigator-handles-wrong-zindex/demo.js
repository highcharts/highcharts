
$(function () {
    QUnit.test("Handles should not be overlapped by xAxis labels", function (assert) {
        var chart = $('#container').highcharts('StockChart',{
            navigator: {
                height: 20
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }).highcharts();


        assert.strictEqual(
            chart.scroller.handles[0].zIndex > chart.scroller.xAxis.labelGroup.zIndex,
            true,
            "Labels no overlap handles"
        );
    });
});