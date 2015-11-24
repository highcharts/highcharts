$(function () {

    QUnit.test('Size by threshold', function (assert) {
        var chart,
            $container = $('#container');

        $container.highcharts({

            chart: {
                type: 'bubble',
                animation: false
            },

            series: [{
                animation: false,
                data: [
                    [-5, 0, -5],
                    [-4, 0, -4],
                    [-3, 0, -3],
                    [-2, 0, -2],
                    [-1, 0, -1],
                    [0, 0, 0],
                    [1, 0, 1],
                    [2, 0, 2],
                    [3, 0, 3],
                    [4, 0, 4],
                    [5, 0, 5]
                ],
                sizeByAbsoluteValue: true
            }]

        });

        chart = $container.highcharts();

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('r'),
            chart.series[0].points[10].graphic.attr('r'),
            'Equal absolute values give equal bubble size'
        );

        chart.series[0].update({ sizeByAbsoluteValue: false });
        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('r'), 10) < parseInt(chart.series[0].points[10].graphic.attr('r'), 10),
            true,
            'Size by threshold: false give different sizes'
        );


        chart.series[0].update({ sizeByAbsoluteValue: true });
        chart.series[0].points[10].update({ z: 4 });
        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('r'), 10) > parseInt(chart.series[0].points[10].graphic.attr('r'), 10),
            true,
            'Negative absolute value gives greater bubble size'
        );

        chart.series[0].update({ zThreshold: 1 });
        assert.strictEqual(
            chart.series[0].points[5].graphic.attr('r'),
            chart.series[0].points[7].graphic.attr('r'),
            'Equal difference to zThreshold gives equal bubble size'
        );

    });
});