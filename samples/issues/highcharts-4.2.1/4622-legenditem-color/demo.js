$(function () {
    QUnit.test('Waterfall update color point and update color legend item.', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'pyramid',
                    marginRight: 100
                },
                series: [{
                    showInLegend: true,
                    data: [
                        ['Website visits', 15654],
                        ['Downloads', 4064],
                        ['Requested price list', 1987],
                        ['Invoice sent', 976],
                        ['Finalized', 846]
                    ]
                }]
            }).highcharts(),
            point = chart.series[0].data[0],
            color = "#ff00ff";

        point.update({
            y: 1000,
            color: color
        });

        assert.strictEqual(
            point.graphic.attr("fill"),
            color,
            'Proper color for legend'
        );
        assert.strictEqual(
            point.legendSymbol.attr("fill"),
            color,
            'Proper color for a point\'s shape'
        );
    });
});