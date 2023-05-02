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
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].area.element.getAttribute('fill').replace(/ /g, ''),
        'rgba(44,175,254,0)',
        'Fill opacity should be set'
    );
});
