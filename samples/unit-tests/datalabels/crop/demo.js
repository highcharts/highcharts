QUnit.test(
    'Cropped datalabels are visible when small columns.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        crop: false,
                        enabled: true,
                        inside: true
                    }
                }
            },
            series: [{
                data: [1121, 523, 5, 256, 2, 843, 726, 590, 1, 434, 312, 432]
            }]
        });

        assert.strictEqual(
            chart.series[0].points[4].dataLabel.options.y !== null,
            true,
            'Cropped datalabel is show (#10245).'
        );
    }
);
