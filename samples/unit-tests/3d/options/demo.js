
QUnit.test('General options tests', function (assert) {
    Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true
            }
        },
        series: undefined
    });

    assert.ok(
        true,
        'No errors when created chart without "series" options in 3D (#8529)'
    );
});
