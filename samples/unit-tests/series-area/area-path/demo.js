QUnit.test(
    'Area path general tests.',
    assert => {
        // #3694
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

        assert.ok(
            areaPath[2][2] === thresholdValue &&
            areaPath[3][2] === thresholdValue,
            `The areaPath y bottom value should be same as the threshold, when
            low value is defined. #3694`
        );

        // #23815
        chart.update({
            yAxis: {
                type: 'logarithmic'
            },
            series: [
                {
                    data: [-1, 0, 1, 2, 3, 4, 5, 6]
                }
            ]
        });

        const areaBBox = chart.series[0].area.getBBox();

        assert.ok(
            areaBBox.width > 0 && areaBBox.height > 0,
            'Area series with negative values should have a valid area drawing.'
        );

        chart.series[0].setData([1, 0.1, 1], false);
        chart.addSeries({
            data: [2, 3, null, 3, 4]
        }, false);


        chart.update({
            plotOptions: {
                series: {
                    connectNulls: true,
                    stacking: 'normal'
                }
            }
        });

        const isValidArea = chart.series[1].areaPath.every(segment =>
            segment[0] === 'Z' || isFinite(segment[2])
        );

        assert.ok(
            isValidArea,
            `Stacked area with log axis and connectNulls should have a valid
            area path.`
        );
    }
);
