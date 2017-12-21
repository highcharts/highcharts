

QUnit.test('Soft threshold', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'area',
            threshold: null,
            data: [-50, -100]
        }]
    });

    assert.strictEqual(
        Math.round(chart.series[0].area.getBBox().y + chart.series[0].area.getBBox().height),
        Math.round(chart.plotHeight),
        'Area goes all the way down'
    );
});

QUnit.test(
    'Threshold should be applied when setSize / reflow is triggered (#6033)',
    function (assert) {
        var chart = new Highcharts.Chart({
            series: [{
                data: [80, 100, 60]
            }],
            chart: {
                type: "bar",
                renderTo: 'container',
                height: 175
            },
            yAxis: {
                min: 0
            },
            plotOptions: {
                series: {
                    stacking: "normal",
                    threshold: 10
                }
            }
        });

        assert.strictEqual(
            chart.yAxis[0].stacks.bar[0].cumulative,
            90,
            'Threshold is applied'
        );
    }
);