QUnit.test('A11y is enabled', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2]
        }]
    });

    assert.ok(
        chart.a11y,
        'There is an accessibility module instance'
    );

    assert.strictEqual(
        chart.container.getAttribute('role'),
        'presentation',
        'The chart container has role="presentation"'
    );
});

QUnit.test('A11y enabled updating', function (assert) {
    const chart = Highcharts.chart('container', {
        a11y: {
            enabled: false
        },
        series: [{
            data: [1, 2]
        }]
    });

    assert.notOk(
        chart.a11y,
        'There is no accessibility module instance when starting'
    );

    assert.strictEqual(
        chart.renderer.box.getAttribute('role'),
        'img',
        'The SVG has role="img" when there is no a11y'
    );

    chart.update({
        a11y: {
            enabled: true
        }
    });

    assert.ok(
        chart.a11y,
        'There is an accessibility module instance after update'
    );

    assert.notOk(
        chart.renderer.box.getAttribute('role'),
        'The SVG has no role after enabling a11y'
    );

    assert.strictEqual(
        chart.container.getAttribute('role'),
        'presentation',
        'The container has role="presentation" after enabling a11y'
    );

    chart.update({
        a11y: {
            enabled: false
        }
    });

    assert.notOk(
        chart.a11y,
        'There is no accessibility module instance after disabling'
    );

    assert.strictEqual(
        chart.renderer.box.getAttribute('role'),
        'img',
        'The SVG is back to role="img" after disabling a11y'
    );

    assert.notOk(
        chart.container.getAttribute('role'),
        'The container has no role after disabling a11y'
    );
});
