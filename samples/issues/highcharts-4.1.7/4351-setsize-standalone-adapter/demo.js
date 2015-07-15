$(function () {
    QUnit.test("Chart has proper dimensions after resize using standalone adapter." , function (assert) {
        var width = 200,
            height = 300,
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: "container"
                },
                series: [{
                    data: [5, 10, -5, -10]
                }]
            }),
            container = $('#container .highcharts-container');

        chart.setSize(width, height, false);

        assert.strictEqual(
            container.width(),
            width,
            "Proper width"
        );

        assert.strictEqual(
            container.height(),
            height,
            "Proper height"
        );
    });
});