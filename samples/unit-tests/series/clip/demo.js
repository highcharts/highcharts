QUnit.test('General series clip tests', assert => {
    var clock = TestUtilities.lolexInstall();

    try {
        const chart = Highcharts.chart('container', {
                yAxis: {
                    labels: {
                        format: '{value}'
                    }
                },
                plotOptions: {
                    series: {
                        animation: false
                    }
                }
            }),
            done = assert.async();

        chart.update(
            {
                series: [
                    {
                        data: [10, 20]
                    },
                    {
                        data: [400000000, 600000000]
                    }
                ]
            },
            true,
            true,
            {
                duration: 15
            }
        );

        setTimeout(() => {
            chart.update(
                {
                    series: [
                        {
                            data: [1, 2]
                        }
                    ]
                },
                true,
                true,
                {
                    duration: 25
                }
            );
        }, 20);

        setTimeout(() => {
            assert.strictEqual(
                parseFloat(
                    chart.container
                        .querySelectorAll(
                            chart.series[0].group
                                .attr('clip-path')
                                .slice(4)
                                .slice(0, -1) + ' rect'
                        )[0]
                        .getAttribute('width')
                ),
                chart.clipBox.width,
                "Correct clippath's width after updating chart (#13751)."
            );

            done();
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
