QUnit.test('Chart destroy', function (assert) {

    var chart = Highcharts.charts[0];

    chart.destroy();

    assert.strictEqual(
        chart.series,
        undefined,
        'Properties deleted'
    );

    assert.strictEqual(
        document.getElementById('container').innerHTML,
        '',
        'Container emptied'
    );
});