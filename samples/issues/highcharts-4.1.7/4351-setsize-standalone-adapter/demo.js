$(function () {
    QUnit.test("Chart has proper dimensions after resize using standalone adapter.", function (assert) {
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

        assert.close(
            container.width(),
            width,
            0.0001,
            "Proper width"
        );

        assert.close(
            container.height(),
            height,
            0.0001,
            "Proper height"
        );
    });
});