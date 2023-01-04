QUnit.test(
    'Area doesn\'t respect the threshold, when low value is defined #3694',
    assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            series: [
                {
                    data: [
                        {
                            y: 5,
                            low: 3
                        },
                        {
                            y: 10,
                            low: 3.5
                        }
                    ]
                }
            ]
        });

        const areaPath = chart.series[0].areaPath,
            thresholdValue = chart.yAxis[0].getThreshold(
                chart.series[0].options.threshold
            );

        assert.strictEqual(
            areaPath[2][2],
            thresholdValue,
            'The areaPath y bottom value should be same as the threshold'
        );

        assert.strictEqual(
            areaPath[3][2],
            thresholdValue,
            'The areaPath y bottom value should be same as the threshold'
        );
    }
);
