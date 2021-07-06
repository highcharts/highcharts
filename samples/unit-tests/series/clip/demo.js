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
                chart.container
                    .querySelectorAll(
                        chart.series[0].group
                            .attr('clip-path')
                            .slice(4)
                            .slice(0, -1) + ' rect'
                    )[0]
                    .getAttribute('width'),
                chart.clipRect.element.getAttribute('width'),
                `Correct clippath's width after updating chart (#13751).`
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
        chart: {
            height: 300,
            events: {
                load() {
                    this.setSize(null, 400, false);
                }
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.series[0].clipBox.height,
        chart.clipBox.height,
        '#15400: clipBox should have been updated by setSize in load event'
    );

    chart.series[0].remove();

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

QUnit.test('Stock: the added series were not animating, (#4406).', assert => {
    var clock = TestUtilities.lolexInstall();

    try {
        const chart = Highcharts.stockChart('container', {

                plotOptions: {
                    series: {
                        animation: {
                            duration: 40
                        }
                    }
                },

                series: []

            }),
            done = assert.async();

        setTimeout(() => {
            chart.update(
                {
                    series: [{
                        data: [10, 10, 10, 10]
                    }]
                },
                true,
                true,
                {
                    duration: 40
                }
            );
        }, 20);

        let clipKey;

        setTimeout(() => {
            chart.addSeries({
                data: [1, 1, 1, 1]
            });
            clipKey = chart.series[1].sharedClipKey;
        }, 75);

        let clipWidth,
            clipWidthAfterSomeTime;

        setTimeout(() => {
            clipWidth = chart.sharedClips[clipKey].attr('width');
        }, 90);

        setTimeout(() => {
            clipWidthAfterSomeTime = chart.sharedClips[clipKey].attr('width');
        }, 100);

        setTimeout(() => {
            assert.ok(
                clipWidth !== clipWidthAfterSomeTime,
                '#4406: The added series should animate.'
            );

            done();
        }, 110);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }

});
