QUnit.test(
    'Drilldown animations',
    assert => {
        const clock = TestUtilities.lolexInstall();

        try {
            const done = assert.async();
            const chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    data: [{
                        y: 62.74,
                        drilldown: 'drilldown'
                    }, {
                        y: 10.57
                    }]
                }],
                drilldown: {
                    animation: {
                        duration: 100
                    },
                    series: [{
                        id: 'drilldown',
                        data: [15]
                    }]
                }
            });

            chart.series[0].points[0].doDrilldown();

            setTimeout(function () {
                assert.equal(
                    chart.series[0].dataLabelsGroup.attr('visibility'),
                    'hidden',
                    `Data Labels' group should be hidden
                    during the drilldown animation (#15133).`
                );
            }, 40);

            setTimeout(function () {
                const dataLabelsGroup = chart.series[0].dataLabelsGroup;

                assert.equal(
                    dataLabelsGroup.attr('visibility'),
                    'inherit',
                    `Data Labels' group should be visible
                    after the drilldown animation (#15133).`
                );

                assert.notEqual(
                    dataLabelsGroup.attr('opacity'),
                    1,
                    `Data Labels' group' opacity should be animating
                    after the drilldown animation (#15133).`
                );

                done();
            }, 140);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);