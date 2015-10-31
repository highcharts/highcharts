
$(function () {
    QUnit.test("Null points should not have data labels", function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                boostThreshold: 100,
                data: (function () {
                    var d = [],
                        n = 5000;
                    while (n--) {
                        d.push(Math.random());
                    }
                    return d;
                }())
            }]
        }).highcharts();

        chart.xAxis[0].setExtremes(0, 10);
        chart.xAxis[0].setExtremes();

        assert.strictEqual(
            chart.series[0].tracker,
            null
        );
    });
});