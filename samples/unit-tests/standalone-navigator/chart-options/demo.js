QUnit.test('Chart options in Standalone Navigator', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chart: {
            credits: {
                enabled: false
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    const creditsElement = document.querySelector('.highcharts-credits');

    assert.notOk(
        creditsElement,
        'Credits element should not exist.'
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