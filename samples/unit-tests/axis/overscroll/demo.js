// Test both, ordinal and non-ordinal axes:
[true, false].forEach(ordinal => {
    // Highcharts Stock modifies "series" property, so use separate object
    // each time:
    function getOptions() {
        return {
            chart: {
                width: 600
            },
            rangeSelector: {
                buttons: [
                    {
                        type: 'millisecond',
                        count: 10,
                        text: '1s'
                    }
                ],
                selected: 0
            },
            xAxis: {
                overscroll: 5,
                ordinal: ordinal
            },
            series: [
                {
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        48.5,
                        16.4,
                        194.1,
                        95.6,
                        54.4,
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4,
                        54.4,
                        54.4,
                        154.4
                    ]
                }
            ]
        };
    }

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes from rangeSelector buttons' +
        ' + panning.',
        function (assert) {
            const options = getOptions();
            let xAxis;

            xAxis = Highcharts.stockChart('container', options).xAxis[0];

            assert.strictEqual(
                xAxis.max - xAxis.min,
                options.rangeSelector.buttons[0].count,
                'Correct range with preselected button (1s)'
            );
            options.rangeSelector.selected = null;

            const chart = Highcharts.stockChart('container', options),
                controller = new TestController(chart);

            xAxis = chart.xAxis[0];

            assert.strictEqual(
                xAxis.max - xAxis.min,
                xAxis.series[0].options.data.length -
                    1 +
                    xAxis.options.overscroll,
                'Correct range with ALL'
            );

            xAxis.setExtremes(10, null);
            controller.pan([100, 200], [300, 200]);
            assert.close(
                xAxis.min,
                9.5,
                0.5,
                'Panning should work with overscroll option, #21316'
            );
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes after addPoint()',
        function (assert) {
            var options = getOptions(),
                chart;

            chart = Highcharts.stockChart('container', options);

            chart.series[0].addPoint(15, false, false);
            chart.series[0].addPoint(15, false, false);
            chart.series[0].addPoint(12);

            assert.strictEqual(
                chart.xAxis[0].max,
                chart.xAxis[0].dataMax + chart.xAxis[0].options.overscroll,
                'Correct max'
            );

            assert.strictEqual(
                chart.xAxis[0].min,
                chart.xAxis[0].dataMax + chart.xAxis[0].options.overscroll - 10,
                'Correct min'
            );
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes after scrollbar button click',
        function (assert) {
            var done = assert.async(),
                options = getOptions(),
                event = {
                    trigger: 'scrollbar'
                },
                chart;

            chart = Highcharts.stockChart('container', options);

            chart.scrollbar.buttonToMinClick(event);
            chart.scrollbar.buttonToMinClick(event);
            chart.scrollbar.buttonToMinClick(event);

            // No lolex should be needed here
            setTimeout(function () {
                // Scrollbar button calls setExtremes with timeout(0):
                assert.strictEqual(
                    chart.xAxis[0].max !==
                        chart.xAxis[0].dataMax +
                            chart.xAxis[0].options.overscroll,
                    true,
                    'Button click does not go backto the max'
                );
                done();
            });
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes for uneven data',
        function (assert) {
            var options = getOptions(),
                xAxis;

            options.rangeSelector.selected = null;
            options.series[0].data = [
                [0, 5],
                [10, 5],
                [20, 5],
                [400, 5],
                [401, 5],
                [402, 5],
                [404, 5]
            ];

            xAxis = Highcharts.stockChart('container', options).xAxis[0];

            assert.strictEqual(
                xAxis.max - xAxis.min,
                xAxis.dataMax + xAxis.options.overscroll,
                'Correct range with ALL'
            );
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes for even data',
        function (assert) {
            var options = getOptions(),
                xAxis;

            options.rangeSelector.selected = null;
            options.xAxis.overscroll = 100;

            xAxis = Highcharts.stockChart('container', options).xAxis[0];

            assert.strictEqual(
                xAxis.tickPositions[1] - xAxis.tickPositions[0],
                20,
                'Correct ticks (#9160)'
            );
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes for overscroll in px (#20360)',
        function (assert) {
            const options = getOptions();

            let overscrollPixelValue = 300;

            options.rangeSelector.selected = null;
            options.xAxis.overscroll = overscrollPixelValue + 'px';

            options.series[0].data = [
                [0, 1],
                [10, 2],
                [20, 3],
                [400, 4],
                [401, 3],
                [402, 2],
                [404, 1]
            ];

            const xAxis = Highcharts.stockChart('container', options).xAxis[0],
                points = xAxis.series[0].points,
                lastPoint = points[points.length - 1];

            assert.close(
                lastPoint.plotX,
                xAxis.width - overscrollPixelValue,
                xAxis.width / 100,
                'Correct range with overscroll set in px'
            );

            overscrollPixelValue = 400;

            xAxis.update({
                overscroll: overscrollPixelValue + 'px'
            });

            assert.close(
                lastPoint.plotX,
                xAxis.width - overscrollPixelValue,
                xAxis.width / 100,
                'Correct range with updated overscroll set in px'
            );
        }
    );

    QUnit.test(
        'Ordinal: ' + ordinal + ' - Extremes for overscroll in % (#20360)',
        function (assert) {
            const options = getOptions();

            let overscrollPercentageValue = 50;

            options.rangeSelector.selected = null;
            options.xAxis.overscroll = overscrollPercentageValue + '%';

            options.series[0].data = [
                [0, 1],
                [10, 2],
                [20, 3],
                [400, 4],
                [401, 3],
                [402, 2],
                [404, 1]
            ];

            const xAxis = Highcharts.stockChart('container', options).xAxis[0],
                points = xAxis.series[0].points,
                lastPoint = points[points.length - 1];

            let percent = overscrollPercentageValue / 100;

            assert.close(
                lastPoint.plotX,
                xAxis.width / (1 + percent),
                xAxis.width / 100,
                'Correct range with overscroll set in %'
            );

            overscrollPercentageValue = 30;
            percent = overscrollPercentageValue / 100;

            xAxis.update({
                overscroll: overscrollPercentageValue + '%'
            });

            assert.close(
                lastPoint.plotX,
                xAxis.width / (1 + percent),
                xAxis.width / 100,
                'Correct range with updated overscroll set in %'
            );
        }
    );
});

QUnit.test('Overscroll with rangeSelector (#22334)', function (assert) {
    const overscrollPixelValue = 200,
        overscrollPercentageValue = 25;

    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 820 // Gives us axis.len of 800px
        },

        xAxis: {
            overscroll: overscrollPixelValue + 'px'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            pointStart: '2017-01-01',
            pointInterval: 1000 * 60 * 60 * 24, // 1 day
            data: (function () {
                const data = [];

                for (let i = 0; i <= 1000; i += 1) {
                    data.push(
                        Math.round(Math.random() * 100)
                    );
                }
                return data;
            }())
        }]
    });

    const points = chart.series[0].points,
        lastPoint = points[points.length - 1];

    assert.strictEqual(
        lastPoint.plotX,
        chart.xAxis[0].width - overscrollPixelValue,
        'Pixel overscroll correct range with rangeSelector enabled'
    );

    chart.xAxis[0].update({
        overscroll: overscrollPercentageValue + '%'
    });

    assert.strictEqual(
        lastPoint.plotX,
        chart.xAxis[0].width -
            (chart.xAxis[0].len * overscrollPercentageValue / 100),
        'Percent overscroll correct range with rangeSelector enabled'
    );
});