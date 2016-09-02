$(function () {

    QUnit.test('NaN in graphs', function (assert) {
        var chart = Highcharts.chart('container', {

            series: [{
                data: [NaN, 71.5, 106.4, 129.2, 144.0, NaN, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]

        });

        assert.ok(
            chart.series[0].graph.attr('d').length > 100,
            'Path is ok'
        );
        assert.notEqual(
            chart.series[0].graph.attr('d'),
            'M 0 0',
            'Path is ok'
        );
    });

    QUnit.test('Zeroes on log axis', function (assert) {

        var chart = Highcharts.chart('container', {

            yAxis: {
                type: 'logarithmic'
            },

            series: [{
                data: [1, 2, 0, 8, 16, 32, 64, 128, 256, 512],
                pointStart: 1
            }]
        });

        assert.strictEqual(
            chart.series[0].graph.attr('d').split(' ')[6],
            'M',
            'Gap detected'
        );
    });
});