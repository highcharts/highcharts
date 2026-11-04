QUnit.test('Bubble with null(#4543)', function (assert) {
    var chart = $('#container')
        .highcharts({
            accessibility: {
                enabled: false
            },

            chart: {
                type: 'bubble'
            },

            title: {
                text: 'Highcharts with nulls'
            },

            series: [
                {
                    data: [
                        { y: 0, z: -1 },
                        [0, 1, null],
                        [0, 2, 0],
                        [0, 3, 1]
                    ]
                }
            ]
        })
        .highcharts();

    assert.strictEqual(
        chart.series[0].points[0].x,
        0,
        'When no x given, it should be inferred'
    );

    assert.strictEqual(
        chart.series[0].group.element.childNodes.length,
        3,
        'No element created for null point'
    );

    // Also when sizeByAbsoluteValue is true
    chart.series[0].update({ sizeByAbsoluteValue: true });

    assert.strictEqual(
        chart.series[0].group.element.childNodes.length,
        3,
        'No element created for null point'
    );
});
