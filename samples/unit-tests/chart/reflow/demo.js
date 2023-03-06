QUnit.test('Reflow tests (sync, #6968)', function (assert) {
    var clock,
        chart,
        originalChartWidth,
        container = document.getElementById('container'),
        originalContainerWidth = container.offsetWidth;

    try {
        clock = TestUtilities.lolexInstall();

        var done = assert.async();

        // Set reflow to false
        setTimeout(function () {
            assert.ok(true, 'Test set reflow to false');

            chart = Highcharts.chart('container', {
                chart: {
                    reflow: false
                },
                title: {
                    text: 'Chart reflow is set to false'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
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
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4
                        ]
                    }
                ]
            });

            originalChartWidth = chart.chartWidth;

            assert.strictEqual(
                typeof originalChartWidth,
                'number',
                'Width should be set'
            );

            // Change the container size and trigger window resize to make the chart resize
            container.style.width = '300px';

            if (navigator.userAgent.indexOf('Edge') === -1) {
                // triggers page reload on BrowserStack
                Highcharts.fireEvent(window, 'resize');
            }
        }, 0);

        setTimeout(function () {
            assert.notEqual(
                container.offsetWidth,
                originalContainerWidth,
                'Container width should change'
            );

            assert.strictEqual(
                chart.chartWidth,
                originalChartWidth,
                'Chart width should not change'
            );

            container.style.width = '';
            container.style.height = '';
        }, 100);

        // Set reflow to true
        setTimeout(function () {
            assert.ok(true, 'Test set reflow to true');

            chart = Highcharts.chart('container', {
                chart: {
                    reflow: true
                },
                title: {
                    text: 'Chart reflow is set to false'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
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
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4
                        ]
                    }
                ]
            });

            originalChartWidth = chart.chartWidth;

            assert.strictEqual(
                typeof originalChartWidth,
                'number',
                'Chart width should be set'
            );

            // Change the container size and trigger window resize to make the chart resize
            container.style.width = '300px';
            chart.reflow();
        }, 200);

        setTimeout(function () {
            assert.strictEqual(
                chart.chartWidth !== originalChartWidth,
                true,
                'Chart width should change'
            );

            container.style.width = '';
            container.style.height = '';
        }, 300);

        // Reflow height only (#6968)
        setTimeout(function () {
            assert.ok(true, 'Test reflow height only (#6968)');

            chart = Highcharts.chart('container', {
                chart: {
                    animation: false,
                    width: 500
                },
                series: [
                    {
                        type: 'column',
                        data: [1, 3, 2, 4]
                    }
                ]
            });

            assert.strictEqual(chart.chartHeight, 400, 'Default height');

            container.style.height = '500px';
            chart.reflow();

            assert.strictEqual(chart.chartHeight, 500, 'Reflowed height');

            container.style.width = '';
            container.style.height = '';

            done();
        }, 400);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('#13220, #12788, #12489, 11975: Pointer position after setting size or scale on a parent', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
        tooltip: {
            hideDelay: 0
        }
    });

    const point = chart.series[0].points[0];

    const controller = new TestController(chart);
    controller.moveTo(0, 0);

    chart.renderTo.style.width = '300px';
    chart.reflow();

    controller.mouseMove(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY
    );

    assert.ok(
        !chart.tooltip.isHidden &&
        Math.round(point.plotX + chart.plotLeft) ===
        chart.tooltip.now.anchorX &&
        Math.round(point.plotY + chart.plotTop) ===
        chart.tooltip.now.anchorY,
        'Tooltip should be visible and in the correct position'
    );

    chart.renderTo.style.width = '600px';
    chart.renderTo.style.transform = 'scale(0.5)';
    chart.reflow();

    controller.mouseMove(
        0.5 * (chart.plotLeft + point.plotX),
        0.5 * (chart.plotTop + point.plotY)
    );

    assert.ok(
        !chart.tooltip.isHidden &&
        Math.round(point.plotX + chart.plotLeft) ===
        chart.tooltip.now.anchorX &&
        Math.round(point.plotY + chart.plotTop) ===
        chart.tooltip.now.anchorY,
        'Tooltip should be visible and in the correct position'
    );

    chart.renderTo.style.transform = '';
});


QUnit.test('Chart reflow using ResizeObserver, #17951.', assert => {
    if (window.requestAnimationFrame) {
        const chart = Highcharts.chart('container', {
            series: [{
                data: [3, 5, 1, 3]
            }]
        });

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Initially chart width should equal 600px.'
        );
        assert.strictEqual(
            chart.chartHeight,
            400,
            'Initially chart height should equal 400px.'
        );

        document.getElementById('container').style.width = '500px';
        document.getElementById('container').style.height = '800px';
        const done = assert.async();
        setTimeout(() => {
            assert.strictEqual(
                chart.chartWidth,
                500,
                'After updating container width, the chart should adjust its.'
            );
            assert.strictEqual(
                chart.chartHeight,
                800,
                'After updating container width, the chart should adjust its.'
            );
            done();
        }, 100);
    } else {
        assert.ok(
            true,
            `The requestAnimationFrame does not work in karma environment thus
            ResizeObserver will not work.`
        );
    }
});
