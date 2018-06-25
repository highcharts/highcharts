// Highcharts 4.1.1, Issue 3844
// treemap - colorByPoint is not working
QUnit.test('Treemap colorByPoint (#3844)', function (assert) {

    var chart = Highcharts.chart('container', {
        series: [{
            type: "treemap",
            data: [1, 2, 3],
            colorByPoint: true
        }]
    });

    assert.notEqual(
        chart.series[0].data[0].graphic.element.getAttribute('fill'),
        chart.series[0].data[1].graphic.element.getAttribute('fill'),
        'Point 0 should not be colored like point 1.'
    );

    assert.notEqual(
        chart.series[0].data[1].graphic.element.getAttribute('fill'),
        chart.series[0].data[2].graphic.element.getAttribute('fill'),
        'Point 1 should not be colored like point 2.'
    );

    assert.notEqual(
        chart.series[0].data[0].graphic.element.getAttribute('fill'),
        chart.series[0].data[2].graphic.element.getAttribute('fill'),
        'Point 0 should not be colored like point 2.'
    );

});