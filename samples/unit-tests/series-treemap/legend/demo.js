QUnit.test('Legend Item colors', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: "treemap",
                showInLegend: true,
                legendType: 'point',
                data: [{
                    name: 'A',
                    value: 1
                }]
            }]
        }),
        legend = chart.legend,
        series = chart.series[0],
        point  = series.points[0],
        legendItem = series.points[0].legendItem,
        legendSymbol = legendItem.parentGroup.element.lastChild;
    assert.strictEqual(
        legendSymbol.getAttribute('fill'),
        series.color,
        'Legend Item color should equal the series color'
    );
    point.setVisible(false);
    assert.strictEqual(
        legendSymbol.getAttribute('fill'),
        legend.itemHiddenStyle.color,
		'When point is hidden legend item color should equal the legend hidden color'
    );
    point.setVisible(true);
    assert.strictEqual(
        legendSymbol.getAttribute('fill'),
        series.color,
		'When point is visible again, legend item color should equal the series color'
    );
});