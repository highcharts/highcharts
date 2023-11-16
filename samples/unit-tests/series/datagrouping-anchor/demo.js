QUnit.test('Data grouping anchor for points in the middle of the data set.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            yAxis: [{
                height: '33.33%',
                offset: 0
            }, {
                height: '33.33%',
                top: '33.33%',
                offset: 0
            }, {
                height: '33.33%',
                top: '66.66%',
                offset: 0
            }],
            plotOptions: {
                series: {
                    data: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                    pointInterval: 3600 * 1000,
                    dataGrouping: {
                        approximation: 'average',
                        enabled: true,
                        forced: true,
                        units: [
                            ['hour', [2]]
                        ]
                    }
                }
            },
            series: [{
                yAxis: 0
            }, {
                yAxis: 1,
                dataGrouping: {
                    anchor: 'middle'
                }
            }, {
                yAxis: 2,
                dataGrouping: {
                    anchor: 'end'
                }
            }]
        }),
        hour = 3600 * 1000;

    assert.strictEqual(
        chart.series[0].points[1].x,
        2 * hour,
        `When the anchor set to start,
        the point should be placed at the beginning of the group.`
    );
    assert.strictEqual(
        chart.series[1].points[1].x,
        3 * hour,
        `When the anchor set to middle,
        the point should be placed at the center of the group.`
    );
    assert.strictEqual(
        chart.series[2].points[1].x,
        4 * hour,
        `When the anchor set to end,
        the point should be placed at the end of the group.`
    );
    assert.ok(
        chart.xAxis[0].max >=
        chart.series[2].points[chart.series[2].points.length - 1].x,
        `When the last anchor set, the extremes should be changed
        and the last point should be visible.`
    );
});

QUnit.test('Data grouping anchor for the first and last points in the data set.', function (assert) {
    const hour = 3600 * 1000,
        data = [
            [0.2 * hour, 1],
            [1 * hour, 2],
            [1.3 * hour, 2],
            [2 * hour, 3],
            [3 * hour, 4],
            [4 * hour, 1],
            [5 * hour, 2],
            [6 * hour, 3],
            [7 * hour, 4],
            [8 * hour, 1],
            [9 * hour, 2],
            [10.3 * hour, 3],
            [11 * hour, 2],
            [11.7 * hour, 4]
        ],
        chart = Highcharts.stockChart('container', {
            yAxis: [{
                height: '10%',
                offset: 0
            }, {
                height: '18%',
                top: '10%',
                offset: 0
            }, {
                height: '18%',
                top: '28%',
                offset: 0
            }, {
                height: '20%',
                top: '46%',
                offset: 0
            }, {
                height: '20%',
                top: '64%',
                offset: 0
            }, {
                height: '20%',
                top: '82%',
                offset: 0
            }],
            plotOptions: {
                series: {
                    data: data,
                    dataGrouping: {
                        approximation: 'average',
                        enabled: true,
                        forced: true,
                        units: [
                            ['hour', [2]]
                        ]
                    }
                }
            },
            series: [{
                yAxis: 0,
                dataGrouping: {
                    enabled: false
                }
            }, {
                yAxis: 1,
                dataGrouping: {
                    firstAnchor: 'start',
                    lastAnchor: 'start'
                }
            }, {
                yAxis: 2,
                dataGrouping: {
                    firstAnchor: 'middle',
                    lastAnchor: 'middle'
                }
            }, {
                yAxis: 3,
                dataGrouping: {
                    firstAnchor: 'end',
                    lastAnchor: 'end'
                }
            }, {
                yAxis: 4,
                dataGrouping: {
                    firstAnchor: 'firstPoint',
                    lastAnchor: 'firstPoint'
                }
            }, {
                yAxis: 5,
                dataGrouping: {
                    firstAnchor: 'lastPoint',
                    lastAnchor: 'lastPoint'
                }
            }]
        });


    assert.strictEqual(
        chart.series[1].points[0].x,
        0,
        `When the first point anchor is set to start,
        the point should be placed at the beginning of the group.`
    );
    assert.strictEqual(
        chart.series[2].points[0].x,
        hour,
        `When the first point anchor is set to middle,
        the point should be placed at the center of the group.`
    );
    assert.strictEqual(
        chart.series[3].points[0].x,
        2 * hour,
        `When the first point anchor is set to end,
        the point should be placed at the end of the group.`
    );
    assert.strictEqual(
        chart.series[4].points[0].x,
        chart.series[0].points[0].x,
        `When the first point anchor is set to firstPoint,
        the point should be placed where the first point in group is.`
    );
    assert.strictEqual(
        chart.series[5].points[0].x,
        chart.series[0].points[2].x,
        `When the first point anchor is set to lastPoint,
        the point should be placed where the last point in group is.`
    );

    assert.strictEqual(
        chart.series[1].points[chart.series[1].points.length - 1].x,
        10 * hour,
        `When the last point anchor is set to start,
        the point should be placed at the beginning of the group.`
    );
    assert.strictEqual(
        chart.series[2].points[chart.series[2].points.length - 1].x,
        11 * hour,
        `When the last point anchor is set to middle,
        the point should be placed at the center of the group.`
    );
    assert.strictEqual(
        chart.series[3].points[chart.series[3].points.length - 1].x,
        12 * hour,
        `When the last point anchor is set to end,
        the point should be placed at the end of the group.`
    );
    assert.strictEqual(
        chart.series[4].points[chart.series[4].points.length - 1].x,
        chart.series[0].points[11].x,
        `When the last point anchor is set to firstPoint,
        the point should be placed where the first point in group is.`
    );
    assert.strictEqual(
        chart.series[5].points[chart.series[5].points.length - 1].x,
        chart.series[0].points[13].x,
        `When the last point anchor is set to lastPoint,
        the point should be placed where the last point in group is.`
    );

});

QUnit.test('Deprecated smoothed option.', function (assert) {
    const hour = 3600 * 1000,
        data = [
            [0.2 * hour, 1],
            [1 * hour, 2],
            [1.3 * hour, 2],
            [2 * hour, 3],
            [3 * hour, 4],
            [4 * hour, 1],
            [5 * hour, 2],
            [6 * hour, 3],
            [7 * hour, 4],
            [8 * hour, 1],
            [9 * hour, 2],
            [10.3 * hour, 3],
            [11 * hour, 2],
            [11.7 * hour, 4]
        ],
        chart = Highcharts.stockChart('container', {
            series: [{
                data: data,
                dataGrouping: {
                    smoothed: true,
                    forced: true,
                    units: [
                        ['hour', [2]]
                    ]
                },
                navigatorOptions: {
                    dataGrouping: {
                        units: [
                            ['hour', [2]]
                        ]
                    }
                }
            }]
        });

    assert.strictEqual(
        chart.series[0].points[0].x,
        0.2 * hour,
        `When the smoothed enabled, the first point 
        should be placed where the first group point is.`
    );
    assert.strictEqual(
        chart.series[0].points[0].x,
        chart.series[1].points[0].x,
        `When navigator anchors options are not declared,
        the point from the main series should match the navigator series.`
    );
    assert.strictEqual(
        chart.series[0].points[1].x,
        3 * hour,
        `When the smoothed enabled, the next point ,
        should be placed at the center of the group.`
    );
    assert.strictEqual(
        chart.series[0].points[1].x,
        chart.series[1].points[1].x,
        `When navigator anchors options are not declared,
        the point from the main series should match the navigator series.`
    );
    assert.strictEqual(
        chart.series[0].points[chart.series[0].points.length - 1].x,
        11.7 * hour,
        `When the smoothed enabled, the last point
        should be placed where the last group point is.`
    );
    assert.strictEqual(
        chart.series[0].points[chart.series[0].points.length - 1].x,
        chart.series[1].points[chart.series[0].points.length - 1].x,
        `When navigator anchors options are not declared,
        the point from the main series should match the navigator series.`
    );
});
QUnit.test('Data grouping anchor for single point in the dataset', function (assert) {
    const data = [
        1,
        2
    ];
    const chart = Highcharts.stockChart('container', {
            chart: {
                height: 800,
                type: 'column'
            },
            yAxis: [{
                height: '33.33%',
                offset: 0,
                title: {
                    text: 'Anchor start- default'
                }
            }, {
                height: '33.33%',
                top: '33.33%',
                offset: 0,
                title: {
                    text: 'Anchor middle'
                }
            }, {
                height: '33.33%',
                top: '66.66%',
                offset: 0,
                title: {
                    text: 'Anchor end'
                }
            }],
            tooltip: {
                split: false
            },
            plotOptions: {
                series: {
                    pointInterval: 3600 * 1000,
                    dataGrouping: {
                        approximation: 'average',
                        enabled: true,
                        forced: true,
                        units: [
                            ['hour', [2]]
                        ]
                    }
                }
            },
            series: [{
                data,
                yAxis: 0

            }, {
                data,
                yAxis: 1,
                dataGrouping: {
                    anchor: 'middle'
                }
            }, {
                data,
                yAxis: 2,
                dataGrouping: {
                    anchor: 'end'
                }
            }]
        }),
        hour = 3600 * 1000;
    assert.strictEqual(
        chart.series[0].points[0].x,
        0,
        'anchor: `start` -> beginning of the group'
    );
    assert.strictEqual(
        chart.series[1].points[0].x,
        hour,
        'anchor: `middle` -> middle of the group'
    );
    assert.strictEqual(
        chart.series[2].points[0].x,
        hour * 2,
        'anchor: `end` -> end of the group'
    );
});

QUnit.test('DataGrouping unequal series length', function (assert) {
    const data = [
        1,
        2,
        3,
        4,
        1,
        2,
        3,
        4,
        1,
        2,
        3,
        {
            y: 4,
            // To make lastAnchor: lastPoint visible
            x: 3600 * 1000 * 10 + 4250000
        }
    ];

    const chart = Highcharts.stockChart('container', {
        chart: {
            height: 500
        },
        xAxis: {
            tickInterval: 3600 * 1000,
            ordinal: false
        },
        yAxis: [{
            height: '50%',
            offset: 0
        }, {
            height: '50%',
            top: '50%',
            offset: 0

        }],
        plotOptions: {
            series: {

                pointInterval: 3600 * 1000,
                dataGrouping: {
                    approximation: 'average',
                    enabled: true,
                    forced: true,
                    units: [
                        ['hour', [2]]
                    ]
                }
            }
        },
        series: [{
            yAxis: 0,
            data: data,
            dataGrouping: {
                anchor: 'middle'
            }
        }, {
            yAxis: 1,
            data: data.slice(0, -2),
            dataGrouping: {
                anchor: 'middle'
            }
        }]
    });
    assert.equal(
        chart.series[0].points.at(-2).x,
        chart.series[1].points.at(-1).x,
        `last point of series 1 and second to last point in series 2 should be
            in the same position`
    );

    chart.tooltip.refresh(chart.series[0].points.at(0));
    let content = chart.tooltip.tt.text.element.childNodes[0].innerHTML;
    assert.equal(
        content,
        'Thursday,  1 Jan, 00:00-01:59',
        `Tooltip\'s content should show correct group range for the point with
        anchor: middle`
    );

    chart.series[0].update({
        dataGrouping: {
            lastAnchor: 'lastPoint',
            firstAnchor: 'firstPoint'
        }
    });

    chart.tooltip.refresh(chart.series[0].points.at(-1));
    content = chart.tooltip.tt.text.element.childNodes[0].innerHTML;
    assert.equal(
        content,
        'Thursday,  1 Jan, 10:00-11:59',
        `Tooltip's content should show correct group range of the last point
        when lastAnchor is set to 'lastPoint'`
    );

});
