(function () {

    function assertNonBoosted(assert, s) {
        assert.ok(
            !(s.boost && s.boost.target) ||
            (
                s.boost.target.attr('href') ===
                // Blank pixel
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            ),
            'No painted image'
        );

        assert.strictEqual(s.directTouch, true, 'Non-boosted directTouch');

        assert.strictEqual(
            s.stickyTracking,
            false,
            'Non-boosted stickyTracking'
        );

        assert.strictEqual(s.allowDG, undefined, 'Allow data grouping');
    }

    function assertBoosted(assert, s) {
        assert.strictEqual(
            s.boost &&
            s.boost.target.attr('href').indexOf('data:image/png;base64,'),
            0,
            'Painted image for the series'
        );

        assert.strictEqual(s.directTouch, false, 'Boosted directTouch');

        assert.strictEqual(s.stickyTracking, true, 'Boosted stickyTracking');

        assert.strictEqual(s.allowDG, false, 'No data grouping');
    }

    QUnit.test('Enter/exit boost mode by setting data', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },

            plotOptions: {
                series: {
                    boostThreshold: 10
                }
            },
            series: [
                {
                    data: [1, 3, 2, 4],
                    type: 'column'
                }
            ]
        });

        var s = chart.series[0];

        assertNonBoosted(assert, s);

        s.setData([1, 3, 2, 4, 3, 5, 4, 7, 5, 8, 6, 4]);

        assertBoosted(assert, s);

        s.setData([1, 3, 2, 4]);

        assertNonBoosted(assert, s);
    });

    QUnit.test('Enter/exit boost mode by zooming', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },

            plotOptions: {
                series: {
                    boostThreshold: 10
                }
            },
            series: [
                {
                    data: [1, 3, 2, 4, 3, 5, 4, 7, 5, 8, 6, 4],
                    type: 'column',
                    cropThreshold: 1
                }
            ],

            xAxis: {
                minRange: 1
            }
        });

        var s = chart.series[0];

        assertBoosted(assert, s);

        chart.xAxis[0].setExtremes(1, 2);

        assertNonBoosted(assert, s);

        chart.xAxis[0].setExtremes();

        assertBoosted(assert, s);
    });

    QUnit.test(
        'Boost module should remove tracker after zoom',
        function (assert) {
            var chart = $('#container')
                .highcharts({
                    series: [
                        {
                            boostThreshold: 100,
                            data: (function () {
                                var d = [],
                                    n = 5000;
                                while (n--) {
                                    d.push(Math.random());
                                }
                                return d;
                            }())
                        }
                    ]
                })
                .highcharts();

            chart.xAxis[0].setExtremes(0, 10);
            chart.xAxis[0].setExtremes();

            assert.strictEqual(
                chart.series[0].tracker,
                undefined,
                'Boost module should remove tracker after zoom'
            );
        }
    );

    QUnit.test(
        'Boost module should zoom scatter without min/max',
        function (assert) {
            var chart = Highcharts.chart('container', {
                    chart: {
                        height: 450,
                        width: 450,
                        zoomType: 'xy'
                    },
                    boost: {
                        useGPUTranslations: true,
                        usePreAllocated: true
                    },
                    xAxis: {
                        min: 0,
                        max: 5,
                        gridLineWidth: 1
                    },
                    yAxis: {
                        minPadding: 0,
                        maxPadding: 0,
                        title: {
                            text: null
                        }
                    },
                    title: {
                        text: 'Scatter chart with 16 points'
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        type: 'scatter',
                        boostThreshold: 16,
                        color: 'rgb(152, 0, 67)',
                        fillOpacity: 0.1,
                        data: [
                            [4, 4], [4, 3], [4, 1], [4, 2],
                            [3, 4], [3, 3], [3, 1], [3, 2],
                            [1, 4], [1, 3], [1, 1], [1, 2],
                            [2, 4], [2, 3], [2, 1], [2, 2]
                        ],
                        marker: {
                            radius: 1
                        },
                        tooltip: {
                            followPointer: false,
                            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
                        }
                    }]
                }),
                controller = new TestController(chart),
                series = chart.series[0];

            assert.deepEqual(
                [
                    series.yAxis.min,
                    series.yAxis.max
                ],
                [1, 4],
                'Scatter yAxis should have min/max. (#20433)'
            );

            assert.deepEqual(
                [
                    series.processedXData.length,
                    series.processedYData.length
                ],
                [16, 16],
                'Scatter should have 16 boosted points. (#20433)'
            );

            controller.pan([150, 150], [300, 300]);

            assert.deepEqual(
                [
                    series.yAxis.min,
                    series.yAxis.max
                ],
                [1.75, 3.25],
                'Scatter yAxis should have zoomed min/max.'
            );

        }
    );

    QUnit.test(
        '#21106, Chart should not clip series on increasing size after boost',
        function (assert) {
            let boostEnabled = false;

            function getOptions() {
                const options = {
                    series: [{
                        boostThreshold: boostEnabled ? 1 : 0,
                        data: [1, 4, 3, 5],
                        type: 'column'
                    }]
                };

                return options;
            }

            const chart = Highcharts.chart('container', getOptions()),
                series = chart.series[0];

            function toggleBoost() {
                boostEnabled = !boostEnabled;
                chart.update(getOptions());
            }

            chart.setSize(200, 200);
            toggleBoost(); // Enable boost
            toggleBoost(); // Disable boost
            // Columns should be visible and not clipped
            chart.setSize(400, 400);


            const chartSeriesGroup = chart.seriesGroup.element
                .getAttribute('clip-path');
            assert.ok(
                chartSeriesGroup === 'none' || chartSeriesGroup === null,
                'chart.seriesGroup should not have clip-path'
            );

            const seriesGroup = series.group.element.getAttribute('clip-path');
            assert.ok(
                seriesGroup !== null || seriesGroup !== 'none',
                'series.group should have clippath'
            );

            const clipPath = chart.renderer.defs.element
                .querySelector(
                    // Get id from clip-path attribute from series group
                    series.group.element
                        .getAttribute('clip-path')
                        .replace(chart.renderer.url, '')
                        .replace('url(', '')
                        .replace(')', '')
                ).firstElementChild; // Get the rect

            const seriesClipPathX = clipPath.getAttribute('x');
            const seriesClipPathY = clipPath.getAttribute('y');
            const seriesClipPathWidth = clipPath.getAttribute('width');
            const seriesClipPathHeight = clipPath.getAttribute('height');

            for (const point of series.points) {
                assert.ok(
                    point.graphic && point.graphic.element,
                    `Column ${point.index} should be visible`
                );

                const bbox = point.graphic.getBBox();
                assert.notOk(
                    // Is ouside to the left
                    bbox.x + point.plotX < seriesClipPathX + chart.plotLeft ||
                    // Is outside to the top
                    bbox.y + point.plotY < seriesClipPathY + chart.plotTop ||
                    // Is outside to the right
                    bbox.x + bbox.width + point.plotX >
                    seriesClipPathX + seriesClipPathWidth + chart.plotLeft ||
                    bbox.y + bbox.height + point.plotY >
                    // Is outside to the bottom
                    seriesClipPathY + seriesClipPathHeight + chart.plotTop,
                    'Column ' + point.index +
                        ' should not be clipped by series.group'
                );
            }
        }
    );

}());
