QUnit.test('yAxis should be on the left side when opposite is false (#3802)', function (assert) {

    var chart = $('#container').highcharts('StockChart', {
        series: [{
            data: [1, 20, 5, 1, 11]
        }],
        yAxis: {
            opposite: false
        }
    }).highcharts();

    assert.strictEqual(
        chart.yAxis[0].options.opposite,
        false,
        'yAxis is on the left side'
    );

});