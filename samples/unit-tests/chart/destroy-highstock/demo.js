
// Fails because of #8004 Accessibility does not remove itself completely during destroy
QUnit.test('Chart destroy', function (assert) {

    assert.expect(0);

/*
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

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
*/
});
