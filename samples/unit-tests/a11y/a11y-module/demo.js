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

    chart.update({
        a11y: {
            enabled: true
        }
    });

    assert.ok(
        chart.a11y,
        'There is an accessibility module instance after update'
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
});
