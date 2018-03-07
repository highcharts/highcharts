QUnit.test(
    'Overlapping dataLabels should be hidden',
    function (assert) {
        var chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        rotation: 270
                    }
                }
            },
            series: [{
                data: [
                  [0, 1],
                  [1, 1],
                  [2, 0]
                ]
            }, {
                data: [
                  [0, 1],
                  [1, 2],
                  [2, 0.5]
                ]
            }]
        });


        assert.strictEqual(
            chart.series[0].points[0].dataLabel.opacity,
            1,
            'Rotated dataLabel visible (#7362).'
        );

        assert.strictEqual(
            chart.series[1].points[0].dataLabel.opacity,
            0,
            'Rotated dataLabel hidden (#7362).'
        );
    }
);
