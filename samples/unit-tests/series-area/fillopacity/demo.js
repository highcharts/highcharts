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
                data: [1, 3, 2, 4]
            },
            {
                data: [3, 2, 5, 2],
                color: 'blue',
                fillOpacity: 0.25
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].area.element.getAttribute('fill').replace(/ /g, ''),
        'rgba(44,175,254,0)',
        'Fill opacity should be set'
    );

    const areaFill = chart.series[1].area.element.getAttribute('fill').replace(/ /g, '');
    assert.ok(
        areaFill === 'blue' || areaFill === 'rgba(0,0,255,0.25)',
        'There should be support for HTML color names'
    );

    if (areaFill === 'blue') {
        assert.strictEqual(
            chart.series[1].area.element.getAttribute('fill-opacity'),
            '0.25',
            'There should be opacity set for the HTML color names'
        );
    }
});
