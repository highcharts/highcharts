QUnit.test('Empty data config', function (assert) {

    var chart = Highcharts.chart('container', {
        data: {}
    });

    assert.strictEqual(
        chart.series.length,
        0,
        'Series array should exist'
    );
});
