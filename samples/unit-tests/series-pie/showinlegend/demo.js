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