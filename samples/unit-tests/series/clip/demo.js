QUnit.test('General series clip tests', assert => {
    var clock = TestUtilities.lolexInstall();

    try {
        const chart = Highcharts.chart('container', {
                series: [{
                    data: [10, 20]
                }, {
                    data: [1, 2, 3],
                    yAxis: 1
                }],
                yAxis: [{
                    labels: {
                        format: '{value}'
                    }
                }, {
                    opposite: true
                }],
                plotOptions: {
                    series: {
                        animation: false
                    }
                },
                responsive: {
                    rules: [{
                        chartOptions: {
                            title: {
                                text: null
                            }
                        },
                        condition: {
                            callback: () => true
                        }
                    }]
                }
            }),
            done = assert.async();

        assert.strictEqual(
            chart.series[0].clipBox.height,
            chart.yAxis[0].len,
            '#13858: clipBox should have been updated in compliance with responsive rule'
        );

        chart.update(
            {
                series: [
                    {
                        data: [10, 20]
                    },
                    {
                        data: [400000000, 600000000]
                    },
                    {
                        clip: false,
                        data: [1, 2, 3]
                    },
                    {}
                ]
            },
            true,
            true,
            {
                duration: 15
            }
        );

        assert.notOk(
            chart.series[2].clipBox,
            '#15128: Series with clip=false should not have stock clipping applied'
        );

        const widthBefore = chart.sharedClips[chart.series[3].sharedClipKey].attr('width');

        chart.update({
            yAxis: [{}, {
                visible: false
            }],
            series: [{}, {}, {}, {}]
        }, true, true);

        assert.ok(
            chart.sharedClips[chart.series[3].sharedClipKey].attr('width') > widthBefore,
            '#15435: Shared clip should have been updated'
        );

        chart.addSeries({
            data: [3, 3, 3],
            animation: true
        });

        assert.ok(
            chart.series[4].sharedClipKey.includes('temporary'),
            `Clippath should only exist until the animation is finished
            (#4406).`
        );

        assert.strictEqual(
            chart.sharedClips[chart.series[4].sharedClipKey].attr('width'),
            0,
            `Clippath's width immediately after addSeries should be 0
            (series hasn't started animation yet) (#4406).`
        );

        setTimeout(() => {
            assert.ok(
                chart.sharedClips[chart.series[4].sharedClipKey]
                    .attr('width') > 0,
                `Clippath's width after addSeries should increase
                (series is being animated) (#4406).`
            );
        }, 20);

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

QUnit.test('Each series should have their own clip-path, (#14549).', assert => {
    const chart = Highcharts.stockChart('container', {

    });

    chart.addAxis({
        id: 'line',
        height: '60%',
        min: 4,
        max: 6
    }, false, false);

    chart.addAxis({
        id: 'column',
        top: '65%',
        height: '35%',
        offset: 0
    }, false, false);

    chart.addSeries({
        type: 'line',
        data: [5, 7, 5, 2, 3, 7],
        yAxis: 'line'
    }, false, false);

    chart.addSeries({
        type: 'column',
        data: [23, 45, 37, 22, 39, 65],
        yAxis: 'column'
    }, false, false);

    chart.redraw(false);

    assert.ok(
        chart.series[0].clipBox.height + chart.series[1].clipBox.height <=
        chart.plotHeight,
        "The sum of the series clip-paths should not be bigger than the plot height."
    );
});
