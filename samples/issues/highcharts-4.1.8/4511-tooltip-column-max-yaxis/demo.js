$(function () {
    QUnit.test("Tooltip isn't displayed when on column, when yAxis.max is lower than column's value.", function (assert) {
        var UNDEFINED,
            chart = $('#container').highcharts({
                chart: {
                    type: "column"
                },
                yAxis: {
                    max: 5
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    data: [29.9, 71.5, 106.4]
                }]
            }).highcharts();


        chart.pointer.onContainerMouseMove({
            pageX: 150,
            pageY: 310,
            target: chart.series[0].group.element
        });

        assert.strictEqual(
            chart.tooltip.isHidden,
            false,
            'Tooltip displayed properly'
        );

    });

});