$(function () {
    QUnit.test('Tooltip does not work after updating from column series.', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5],
                type: 'column'
            }]
        }).highcharts();

        chart.series[0].update({
            type: "scatter"
        }, true, false);
        chart.series[0].update({
            type: "line"
        }, true, false);

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