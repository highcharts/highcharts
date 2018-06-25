
QUnit.test('Legend vertical align top with no title', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 300
        },
        title: null,
        legend: {
            verticalAlign: 'top'
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.ok(
        chart.legend.group.translateY < 100,
        'Legend is aligned top'
    );
});
