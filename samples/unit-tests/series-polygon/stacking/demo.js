

QUnit.test('Stacking should not take effect', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'polygon',
            //stacking: 'normal',
            data: [
                [1, 4],
                [1, 5],
                [4, 5],
                [4, 4]
            ]
        }]
    });

    var nonStackedExtremes = chart.yAxis[0].getExtremes();

    chart = Highcharts.chart('container', {
        series: [{
            type: 'polygon',
            stacking: 'normal',
            data: [
                [1, 4],
                [1, 5],
                [4, 5],
                [4, 4]
            ]
        }]
    });

    var stackedExtremes = chart.yAxis[0].getExtremes();

    assert.deepEqual(
        nonStackedExtremes,
        stackedExtremes,
        'Stacking doesn\'t affect Y axis'
    );
});