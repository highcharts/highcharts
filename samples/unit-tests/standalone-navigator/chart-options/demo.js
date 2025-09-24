QUnit.test('Chart options in Standalone Navigator', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chartOptions: {
            credits: {
                enabled: false
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.notOk(
        navigator.navigator.chart.credits,
        'Credits should not exist.'
    );

    navigator.navigator.chart.update({
        chart: {
            inverted: true
        }
    });

    assert.ok(
        navigator.navigator.chart.inverted,
        'Standalone navigator chart should be inverted after chart update.'
    );
});