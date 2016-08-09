$(function () {

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
});