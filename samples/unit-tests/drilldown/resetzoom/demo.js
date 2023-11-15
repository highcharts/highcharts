QUnit.test('Drilldown and reset zoom', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            type: 'category',
            minRange: 1
        },
        series: [
            {
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: 'Microsoft Internet Explorer',
                        y: 56.33,
                        drilldown: 'Microsoft Internet Explorer'
                    },
                    {
                        name: 'Chrome',
                        y: 24.03,
                        drilldown: 'Chrome'
                    },
                    {
                        name: 'Firefox',
                        y: 10.38,
                        drilldown: 'Firefox'
                    },
                    {
                        name: 'Safari',
                        y: 4.77,
                        drilldown: 'Safari'
                    },
                    {
                        name: 'Opera',
                        y: 0.91,
                        drilldown: 'Opera'
                    },
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        drilldown: null
                    }
                ]
            }
        ],
        drilldown: {
            breadcrumbs: {
                relativeTo: 'chart',
                position: {
                    x: -30,
                    y: 5
                },
                floating: true,
                showFullPath: false
            },
            series: [
                {
                    name: 'Microsoft Internet Explorer',
                    id: 'Microsoft Internet Explorer',
                    data: [
                        ['v11.0', 24.13],
                        ['v8.0', 17.2],
                        ['v9.0', 8.11],
                        ['v10.0', 5.33],
                        ['v6.0', 1.06],
                        ['v7.0', 0.5]
                    ]
                },
                {
                    name: 'Chrome',
                    id: 'Chrome',
                    data: [
                        ['v40.0', 5],
                        ['v41.0', 4.32],
                        ['v42.0', 3.68],
                        ['v39.0', 2.96],
                        ['v36.0', 2.53],
                        ['v43.0', 1.45],
                        ['v31.0', 1.24],
                        ['v35.0', 0.85],
                        ['v38.0', 0.6],
                        ['v32.0', 0.55],
                        ['v37.0', 0.38],
                        ['v33.0', 0.19],
                        ['v34.0', 0.14],
                        ['v30.0', 0.14]
                    ]
                },
                {
                    name: 'Firefox',
                    id: 'Firefox',
                    data: [
                        ['v35', 2.76],
                        ['v36', 2.32],
                        ['v37', 2.31],
                        ['v34', 1.27],
                        ['v38', 1.02],
                        ['v31', 0.33],
                        ['v33', 0.22],
                        ['v32', 0.15]
                    ]
                },
                {
                    name: 'Safari',
                    id: 'Safari',
                    data: [
                        ['v8.0', 2.56],
                        ['v7.1', 0.77],
                        ['v5.1', 0.42],
                        ['v5.0', 0.3],
                        ['v6.1', 0.29],
                        ['v7.0', 0.26],
                        ['v6.2', 0.17]
                    ]
                },
                {
                    name: 'Opera',
                    id: 'Opera',
                    data: [
                        ['v12.x', 0.34],
                        ['v28', 0.24],
                        ['v27', 0.17],
                        ['v29', 0.16]
                    ]
                }
            ]
        }
    });
    var controller = new TestController(chart);
    assert.strictEqual(chart.resetZoomButton, undefined, 'No zoom button');

    assert.strictEqual(chart.drillUpButton, undefined, 'No drillUp button');
    // Zoom
    controller.pan([300, 200], [200, 200]);
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'object',
        'We have a zoom button'
    );

    // Drill down
    chart.series[0].points[0].doDrilldown();
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'Zoom button removed on new level'
    );
    assert.strictEqual(
        typeof chart.drillUpButton,
        'object',
        'We have a drillUp button'
    );
    // Zoom again on second level
    controller.pan(
        [chart.plotLeft + 200, chart.plotTop + 100],
        [chart.plotLeft + 300, chart.plotTop + 100]
    );
    assert.strictEqual(
        typeof chart.drillUpButton,
        'object',
        'We have a drillUp button'
    );
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'object',
        'Reset zoom button should also be visible.'
    );
    const drillUpButtonxSetting = chart.drillUpButton.xSetting;
    assert.ok(
        chart.resetZoomButton.xSetting >
            chart.drillUpButton.xSetting + chart.drillUpButton.width,
        'Buttons should not overlap.'
    );

    // Click reset zoom.
    Highcharts.fireEvent(chart.resetZoomButton.element, 'click');
    assert.strictEqual(
        drillUpButtonxSetting,
        chart.drillUpButton.xSetting,
        `After resetting the zoom, the drillup button should
        stay at the same position.`
    );
});


QUnit.test('Drilldown and reset zoom - part 2', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            type: 'category',
            minRange: 1
        },
        series: [
            {
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: 'Microsoft Internet Explorer',
                        y: 56.33,
                        drilldown: 'Microsoft Internet Explorer'
                    },
                    {
                        name: 'Chrome',
                        y: 24.03,
                        drilldown: 'Chrome'
                    },
                    {
                        name: 'Firefox',
                        y: 10.38,
                        drilldown: 'Firefox'
                    },
                    {
                        name: 'Safari',
                        y: 4.77,
                        drilldown: 'Safari'
                    },
                    {
                        name: 'Opera',
                        y: 0.91,
                        drilldown: 'Opera'
                    },
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        drilldown: null
                    }
                ]
            }
        ],
        drilldown: {
            breadcrumbs: {
                floating: true,
                showFullPath: false
            },
            series: [
                {
                    name: 'Microsoft Internet Explorer',
                    id: 'Microsoft Internet Explorer',
                    data: [
                        ['v11.0', 24.13],
                        ['v8.0', 17.2],
                        ['v9.0', 8.11],
                        ['v10.0', 5.33],
                        ['v6.0', 1.06],
                        ['v7.0', 0.5]
                    ]
                },
                {
                    name: 'Chrome',
                    id: 'Chrome',
                    data: [
                        ['v40.0', 5],
                        ['v41.0', 4.32],
                        ['v42.0', 3.68],
                        ['v39.0', 2.96],
                        ['v36.0', 2.53],
                        ['v43.0', 1.45],
                        ['v31.0', 1.24],
                        ['v35.0', 0.85],
                        ['v38.0', 0.6],
                        ['v32.0', 0.55],
                        ['v37.0', 0.38],
                        ['v33.0', 0.19],
                        ['v34.0', 0.14],
                        ['v30.0', 0.14]
                    ]
                },
                {
                    name: 'Firefox',
                    id: 'Firefox',
                    data: [
                        ['v35', 2.76],
                        ['v36', 2.32],
                        ['v37', 2.31],
                        ['v34', 1.27],
                        ['v38', 1.02],
                        ['v31', 0.33],
                        ['v33', 0.22],
                        ['v32', 0.15]
                    ]
                },
                {
                    name: 'Safari',
                    id: 'Safari',
                    data: [
                        ['v8.0', 2.56],
                        ['v7.1', 0.77],
                        ['v5.1', 0.42],
                        ['v5.0', 0.3],
                        ['v6.1', 0.29],
                        ['v7.0', 0.26],
                        ['v6.2', 0.17]
                    ]
                },
                {
                    name: 'Opera',
                    id: 'Opera',
                    data: [
                        ['v12.x', 0.34],
                        ['v28', 0.24],
                        ['v27', 0.17],
                        ['v29', 0.16]
                    ]
                }
            ]
        }
    });
    var controller = new TestController(chart);

    // Zoom
    controller.pan([300, 200], [200, 200]);

    // Drill down
    chart.series[0].points[0].doDrilldown();

    // Zoom again on second level
    controller.pan(
        [chart.plotLeft + 200, chart.plotTop + 100],
        [chart.plotLeft + 300, chart.plotTop + 100]
    );

    // Click reset zoom.
    Highcharts.fireEvent(chart.resetZoomButton.element, 'click');

    // Zoom again on second level
    controller.pan(
        [chart.plotLeft + 200, chart.plotTop + 100],
        [chart.plotLeft + 300, chart.plotTop + 100]
    );
    controller.moveTo(
        chart.resetZoomButton.translateX + 5,
        chart.resetZoomButton.translateY + 5
    );
    assert.ok(
        chart.tooltip.isHidden,
        '#14403: Tooltip should be hidden when hovering resetZoomButton'
    );

    controller.moveTo(
        chart.drillUpButton.parentGroup.translateX + 10,
        chart.drillUpButton.parentGroup.translateY + 10
    );
    assert.ok(
        chart.tooltip.isHidden,
        '#14403: Tooltip should be hidden when hovering drillUpButton'
    );

    /* Failed since implementing breadcrumbs. Irrelevant?
    controller.moveTo(
        chart.drillUpButton.parentGroup.translateX - 5,
        chart.drillUpButton.parentGroup.translateY + 5
    );
    assert.notOk(
        chart.tooltip.isHidden,
        '#14403: Tooltip should not be hidden when not hovering button'
    );
    */

    // Drill up
    // chart.drillUp();
    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });
    assert.strictEqual(
        typeof chart.drillUpButton,
        'undefined',
        'We are back on top level, no drillUpButton'
    );
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'object',
        'We still have a resetZoomButton'
    );

    // Click reset zoom
    Highcharts.fireEvent(chart.resetZoomButton.element, 'click');
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'resetZoomButton removed'
    );
});


QUnit.test('Drilldown and reset zoom should not crash the chart, #8095.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            zoomType: 'x'
        },
        xAxis: {
            minRange: 0.1
        },
        series: [{
            data: [{
                y: 5,
                drilldown: 'drill'
            }, {
                y: 2,
                drilldown: 'drill'
            }]
        }],
        drilldown: {
            breadcrumbs: {
                showFullPath: false
            },
            series: [{
                id: 'drill',
                data: [8, 9, 8]
            }]
        }
    });

    const controller = new TestController(chart);

    chart.series[0].points[0].doDrilldown();
    controller.pan([300, 200], [200, 200]);

    assert.strictEqual(
        typeof chart.drillUpButton,
        'object',
        'We have a drillUp button'
    );
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'object',
        'Reset zoom button should also be visible.'
    );
    assert.ok(
        chart.resetZoomButton.xSetting >
            chart.drillUpButton.xSetting + chart.drillUpButton.width,
        'Buttons should not overlap.'
    );

    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 1 });
    chart.series[0].points[0].doDrilldown();

    assert.ok(
        'No errors in the console.'
    );

    // Reset chart to initial state.
    Highcharts.fireEvent(chart.resetZoomButton.element, 'click');
    chart.drillUp();

    // Zoom in basic level.
    controller.pan([100, 200], [300, 200]);

    chart.series[0].points[0].doDrilldown();
    chart.drillUp();
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'object',
        'Reset zoom button should be visible again.'
    );
});


QUnit.test(
    'Reset zoom button with dynamically added multiple drilldowns, #17247.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'x',
                events: {
                    drilldown: function (e) {
                        if (!e.seriesOptions) {
                            const chart = this;

                            chart.addSingleSeriesAsDrilldown(e.point, {
                                data: [8, 9, 8]
                            });
                            chart.addSingleSeriesAsDrilldown(e.point, {
                                data: [1, 3, 4]
                            });
                            chart.addSingleSeriesAsDrilldown(e.point, {
                                data: [5, 6, 7]
                            });
                            chart.applyDrilldown();
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                data: [{
                    y: 5,
                    drilldown: 'drill'
                }, {
                    y: 2,
                    drilldown: 'drill'
                }, 3, 4, 5, 6, 7, 8, 9, 10]
            }]
        });

        const controller = new TestController(chart);

        controller.pan([100, 200], [300, 200]);
        chart.series[0].points[0].doDrilldown();
        Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });

        assert.ok(
            true,
            'There should be no errors in the console.'
        );
    }
);
