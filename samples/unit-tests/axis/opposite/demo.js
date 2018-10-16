QUnit.test('yAxis should be on the left side when opposite is false (#3802)', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [1, 20, 5, 1, 11]
        }]
    });

    // Regression during Gantt development
    assert.strictEqual(
        chart.plotLeft + chart.plotWidth + chart.spacing[1],
        chart.chartWidth,
        'Spacing should be preserved'
    );

    chart.update({
        yAxis: {
            opposite: false
        }
    });
    assert.strictEqual(
        chart.yAxis[0].options.opposite,
        false,
        'yAxis is on the left side'
    );

});