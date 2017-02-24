QUnit.test('Label positions for first axis in a pane (#6071)', function (assert) {

    var chart = Highcharts.stockChart('container', {
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
        correctPosition = chart.yAxis[0].ticks[0].label.element.getBBox().x;

    chart.yAxis[0].update({});

    assert.strictEqual(
        chart.yAxis[0].ticks[0].label.element.getBBox().x,
        correctPosition,
        'After update labels should remain in the same position.'
    );
});
