QUnit.test('Chart options in Standalone Navigator', function (assert) {
    const standaloneNavigator = Highcharts.navigator('container', {
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
        standaloneNavigator.navigator.chart.credits,
        'Credits should not exist.'
    );

    standaloneNavigator.update({
        chartOptions: {
            scrollbar: {
                enabled: false
            }
        }
    });

    assert.notOk(
        standaloneNavigator.navigator.chart.scrollbar.enabled,
        'Scrollbar should be disabled via chartOptions config.'
    );

    standaloneNavigator.update({
        chartOptions: {
            chart: {
                inverted: true
            }
        }
    });

    assert.ok(
        standaloneNavigator.navigator.chart.inverted,
        'Standalone navigator chart should be inverted after chart update.'
    );
});