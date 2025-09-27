QUnit.test('Standalone navigator height', function (assert) {
    const standaloneNavigator = Highcharts.navigator('container', {
        height: 150,
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        standaloneNavigator.navigator.chart.container.offsetHeight,
        150,
        'Standalone navigator container should have correct height, #21268.'
    );

    standaloneNavigator.update({
        height: 200
    });

    assert.strictEqual(
        standaloneNavigator.navigator.chart.container.offsetHeight,
        200,
        `Standalone navigator container should have correct height after update,
        #21268.`
    );

    standaloneNavigator.update({
        chartOptions: {
            chart: {
                height: 400,
                inverted: true
            }
        }
    });

    assert.strictEqual(
        standaloneNavigator.navigator.height,
        200,
        'Inverted navigator height should not be affected by chart height.'
    );
});