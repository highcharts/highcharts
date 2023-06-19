QUnit.test('Fill opacity zero (#4888)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        plotOptions: {
            series: {
                fillOpacity: 0
            }
        },
        series: [
            {
                data: [1, 3, 2, 4],
                color: '#A1A1A1'
            },
            {
                data: [3, 2, 5, 2],
                color: 'blue',
                fillOpacity: 0.25
            }
        ]
    });

    // Testing HEX colors
    assert.strictEqual(
        chart.series[0].area.element.getAttribute('fill').replace(/ /g, ''),
        '#A1A1A1',
        'Fill color should be set'
    );

    assert.strictEqual(
        chart.series[0].area.element.getAttribute('fill-opacity'),
        '0',
        'Fill opacity should be set'
    );

    // Testing HTML colors
    assert.strictEqual(
        chart.series[1].area.element.getAttribute('fill').replace(/ /g, ''),
        'blue',
        'HTML color names should be supported'
    );

    assert.strictEqual(
        chart.series[1].area.element.getAttribute('fill-opacity'),
        '0.25',
        'Fill opacity should be set when no fillColor defined'
    );
});
