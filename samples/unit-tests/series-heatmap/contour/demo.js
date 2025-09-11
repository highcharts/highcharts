QUnit.test('Contour plot tests', function (assert) {
    const c = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        series: [{
            data: [
                [1, 2, 3],
                [2, 3, 4],
                [5, 6, 7]
            ]
        }]
    });

    assert.strictEqual(
        c.series[0].d(),
        true,
        'Delaunay triangulation works'
    );
});
