QUnit.test('Standalone navigator height', function (assert) {
    const navigator = Highcharts.navigator('container', {
        height: 150,
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        150,
        'Standalone navigator container should have correct height, #21268.'
    );

    navigator.update({
        height: 200
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        200,
        `Standalone navigator container should have correct height after update,
        #21268.`
    );
});