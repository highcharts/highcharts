QUnit.test('Stacking should not take effect', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'polygon',
                // stacking: 'normal',
                data: [
                    [1, 4],
                    [1, 5],
                    [4, 5],
                    [4, 4]
                ]
            }
        ]
    });

    var nonStackedExtremes = chart.yAxis[0].getExtremes();

    // The polygon fill honors fillOpacity, opaque by default
    assert.strictEqual(
        Number(chart.series[0].area.attr('fill-opacity')),
        1,
        'Polygon fill is opaque by default'
    );

    chart.series[0].update({ fillOpacity: 0.3 });
    assert.strictEqual(
        Number(chart.series[0].area.attr('fill-opacity')),
        0.3,
        'fillOpacity controls the area fill opacity'
    );

    chart = Highcharts.chart('container', {
        series: [
            {
                type: 'polygon',
                stacking: 'normal',
                data: [
                    [1, 4],
                    [1, 5],
                    [4, 5],
                    [4, 4]
                ]
            }
        ]
    });

    var stackedExtremes = chart.yAxis[0].getExtremes();

    assert.deepEqual(
        nonStackedExtremes,
        stackedExtremes,
        'Stacking doesn\'t affect Y axis'
    );
});
