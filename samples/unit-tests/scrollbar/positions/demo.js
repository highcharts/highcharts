QUnit.test('Inverted chart: wrong position for chart.scrollbar without navigator.', function (assert) {
    var options = {
            chart: {
                inverted: true
            },
            xAxis: {
                min: 0,
                max: 3,
                scrollbar: {
                    enabled: true
                }
            },
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        },
        chart = Highcharts.chart('container', options),
        position = chart.xAxis[0].scrollbar.group.translateY;

    options.scrollbar = {
        enabled: true
    };
    options.xAxis.scrollbar = null;

    chart = Highcharts.chart('container', options);

    assert.strictEqual(
        chart.scrollbar.group.translateY,
        position,
        '#6262: The same y-position for xAxis.scrollbar and chart.scrollbar'
    );

    assert.strictEqual(
        chart.scrollbar.group.translateX + chart.scrollbar.group.getBBox().width < chart.chartWidth,
        true,
        '#6683: chart.scrollbar rendered within the container'
    );
});

QUnit.test('#6453 - multiple scrollbars for yAxes on the left side.', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: [{
            scrollbar: {
                enabled: true
            }
        }, {
            scrollbar: {
                enabled: true
            }
        }, {
            scrollbar: {
                enabled: true
            }
        }],
        series: [{
            data: [4, 20, 100, 5, 2, 33, 12, 23]
        }, {
            data: [4, 20, 100, 5, 2, 33, 12, 23],
            yAxis: 1
        }, {
            data: [4, 20, 100, 5, 2, 33, 12, 23],
            yAxis: 2
        }]
    });

    Highcharts.each(chart.yAxis, function (axis, index) {
        assert.strictEqual(
            axis.scrollbar.x > chart.plotLeft + chart.plotWidth,
            true,
            'Axis ' + index + ' outside the plotting area'
        );
    });

});

QUnit.test('#6576 - xAxis.title should be considered when positioning scrollbar.', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: [{
                scrollbar: {
                    enabled: true
                },
                title: {
                    text: 'Test<br>with<br>breaks.'
                }
            }],
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        }),
        axis = chart.xAxis[0],
        bbox = axis.axisTitle.getBBox(true);

    assert.strictEqual(
        axis.scrollbar.y > bbox.y + bbox.height,
        true,
        'Scrollbar rendered below xAxis.title.'
    );

});

QUnit.test('#6573 - chart.scrollbar mispositioned when chart is inverted.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                inverted: true
            },
            xAxis: [{
                opposite: true,
                scrollbar: {
                    enabled: true
                },
                title: {
                    text: 'Test title.'
                }
            }],
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        }),
        axis = chart.xAxis[0],
        bbox = axis.axisTitle.getBBox(true);

    assert.strictEqual(
        axis.scrollbar.x > bbox.x + bbox.width,
        true,
        'Scrollbar rendered on the left side of the chart.'
    );

});

QUnit.test(
    '#5686 - Scrollbar bar should always be between buttons, on the track.',
    function (assert) {
        var minWidth = 40,
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                yAxis: {
                    max: 5,
                    scrollbar: {
                        enabled: true,
                        minWidth: minWidth
                    }
                },
                series: [{
                    data: [0, 1000]
                }]
            }),
            scrollbar = chart.yAxis[0].scrollbar;

        assert.strictEqual(
            minWidth + scrollbar.scrollbarGroup.translateY <= scrollbar.scrollbarButtons[1].translateY,
            true,
            'Correct scrollbar bar position.'
        );
    }
);

QUnit.test(
    'Overlapping scrollbars',
    assert => {
        const chart = Highcharts.chart('container', {
                yAxis: [{
                    opposite: true,
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    opposite: true,
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    scrollbar: {
                        enabled: true
                    }
                }],
                xAxis: [{
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    opposite: true,
                    scrollbar: {
                        enabled: true
                    }
                }, {
                    opposite: true,
                    scrollbar: {
                        enabled: true
                    }
                }],
                series: [{
                    data: [1, 2, 3]
                }, {
                    data: [3, 2, 1],
                    yAxis: 1,
                    xAxis: 1
                }, {
                    data: [2, 1, 3],
                    yAxis: 2,
                    xAxis: 2
                }, {
                    data: [3, 1, 2],
                    yAxis: 3,
                    xAxis: 3
                }]
            }),
            yAxes = chart.yAxis,
            xAxes = chart.xAxis,
            yAxesLen = yAxes.length,
            xAxesLen = xAxes.length;

        let i;

        yAxes.forEach((yAxis, index) => {
            for (i = index + 1; i < yAxesLen; i++) {

                assert.strictEqual(
                    yAxis.scrollbar.x + yAxis.scrollbar.width < yAxes[i].scrollbar.x,
                    true,
                    'Vertical scrollbar: ' + index + ' should not overlap scrollbar: ' + i
                );
            }
        });

        xAxes.forEach((xAxis, index) => {
            for (i = index + 1; i < xAxesLen; i++) {

                assert.strictEqual(
                    xAxis.scrollbar.y + xAxis.scrollbar.height < xAxes[i].scrollbar.y,
                    true,
                    'Horizontal scrollbar: ' + index + ' should not overlap scrollbar: ' + i
                );
            }
        });
    }
);
