QUnit.test('Pie update color point and update color legend item (#4622)', function (assert) {
    var chart = $('#container').highcharts({
            chart: {
                type: 'pie',
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
        'Proper color for point shape'
    );
    assert.strictEqual(
        point.legendSymbol.attr("fill"),
        color,
        'Proper color for legend item'
    );
});

// Highcharts 3.0.10, Issue 2900
// Legend Resize
QUnit.test('Pie legend resize (#2900)', function (assert) {

    var chart = Highcharts.chart('container', {
            series: [{
                type: 'pie',
                data: [{
                    y: 1,
                    name: 'A'
                }],
                showInLegend: true,
                dataLabels: {
                    enabled: false
                }
            }],
            legend: {
                backgroundColor: '#a4edba'
            }
        }),
        originalLegendWidth = chart.legend.legendWidth;

    chart.series[0].setData([{
        y: 1,
        name: 'A with a longer series name'
    }]);

    assert.ok(
        chart.legend.legendWidth > (originalLegendWidth * 2),
        'The legend should be more then doubled in width.'
    );

});