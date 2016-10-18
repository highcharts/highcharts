QUnit.test('Chart destroy', function (assert) {
    var chart = $('#container').highcharts();

    assert.strictEqual(
        chart.container.innerHTML.indexOf('<svg'),
        0,
        'SVG created'
    );

    chart.destroy();

    assert.strictEqual(
        chart.container,
        undefined,
        'Chart.container nulled'
    );

    assert.strictEqual(
        $('#container').html(),
        '',
        'Container div emptied'
    );
});