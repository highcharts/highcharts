QUnit.test('RangeSelector enabled', function (assert) {

    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        rangeSelector: {
            enabled: false
        },

        series: [{
            data: [1, 2, 10, 10]
        }]
    });

    chart.update({
        rangeSelector: {
            enabled: true
        }
    });

    assert.strictEqual(
        chart.rangeSelector !== undefined,
        true,
        'enabled'
    );
});

