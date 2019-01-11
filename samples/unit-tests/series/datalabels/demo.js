

QUnit.test('Bottom -90', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            data: [100, 200],
            dataLabels: {
                enabled: true,
                defer: false,
                inside: true,
                verticalAlign: 'bottom',
                align: 'left',
                rotation: -90
            },
            animation: false
        }]
    });

    assert.ok(
        chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
        'Labels are visible'
    );
    assert.strictEqual(
        Math.round(chart.series[0].points[0].dataLabel.element.getBoundingClientRect().bottom),
        Math.round(chart.series[0].points[1].dataLabel.element.getBoundingClientRect().bottom),
        'Labels are equally bottom aligned'
    );

});

QUnit.test('Top -90', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            data: [100, 200],
            dataLabels: {
                enabled: true,
                defer: false,
                inside: true,
                verticalAlign: 'top',
                align: 'right',
                rotation: -90
            },
            animation: false
        }]
    });

    assert.ok(
        chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
        'Labels are visible'
    );
    assert.ok(
        Math.abs(
            chart.series[0].points[0].dataLabel.element.getBoundingClientRect().top -
            chart.series[0].points[0].graphic.element.getBoundingClientRect().top
        ) < 12,
        'Label is top aligned to element'
    );
    assert.ok(
        Math.abs(
            chart.series[0].points[1].dataLabel.element.getBoundingClientRect().top -
            chart.series[0].points[1].graphic.element.getBoundingClientRect().top
        ) < 12,
        'Label is top aligned to element'
    );

});

QUnit.test('Bottom 90', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            data: [100, 200],
            dataLabels: {
                enabled: true,
                defer: false,
                inside: true,
                verticalAlign: 'bottom',
                align: 'right',
                rotation: 90
            },
            animation: false
        }]
    });

    assert.ok(
        chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
        'Labels are visible'
    );
    assert.ok(
        Math.abs(
            chart.series[0].points[0].dataLabel.element.getBoundingClientRect().bottom -
            chart.series[0].points[1].dataLabel.element.getBoundingClientRect().bottom
        ) < 12,
        'Labels are equally bottom aligned'
    );

});

QUnit.test('Top 90', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            data: [100, 200],
            dataLabels: {
                enabled: true,
                defer: false,
                inside: true,
                verticalAlign: 'top',
                align: 'left',
                rotation: 90
            },
            animation: false
        }]
    });

    assert.ok(
        chart.series[0].points[0].dataLabel.element.getAttribute('y') > 0,
        'Labels are visible'
    );
    assert.ok(
        Math.abs(
            Math.round(chart.series[0].points[0].dataLabel.element.getBoundingClientRect().top) -
            Math.round(chart.series[0].points[0].graphic.element.getBoundingClientRect().top)
        ) < 12,
        'Label is top aligned to element'
    );
    assert.ok(
        Math.abs(
            Math.round(chart.series[0].points[1].dataLabel.element.getBoundingClientRect().top) -
            Math.round(chart.series[0].points[1].graphic.element.getBoundingClientRect().top)
        ) < 12,
        'Label is top aligned to element'
    );

});

QUnit.test(
    'Connect ends and data label still visible (#6465)',
    function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                polar: true,
                type: 'line'
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        allowOverlap: true,
                        enabled: true,
                        padding: 0,
                        defer: false
                    }
                }
            },
            yAxis: {
                max: 60000
            },

            series: [{
                name: 'Actual Spending',
                data: [45000, 39000, 42000, 31000, 26000, 14000],
                pointPlacement: 'on',
                animation: false
            }]

        });

        assert.strictEqual(
            chart.series[0].points[0].dataLabel.opacity,
            1,
            'First data label is visible'
        );
    }
);

// Highcharts 4.1.1, Issue #3866
// Data Labels are not rendering for column charts when series are shown/hidden
QUnit.test(
    'Datalabels overlap in hidden series (#3866)',
    function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                type: 'column'
            },
            title: {
                text: 'Test for data labels allowOverlap'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{y} km'
                    }
                }
            },
            series: [{
                data: [{
                    labelrank: 1000,
                    y: 1
                }, {
                    labelrank: 1000,
                    y: 2
                }, {
                    labelrank: 1000,
                    y: 3
                }, {
                    labelrank: 1000,
                    y: 4
                }, {
                    labelrank: 1000,
                    y: 5
                }, {
                    labelrank: 1000,
                    y: 6
                }],
                name: '1. Click me'
            }, {
                data: [1.1, 2.1, 3.1, 4.1, 5.1, 6.1],
                name: '2. My data labels should show'
            }]
        });

        assert.strictEqual(
            chart.series[1].dataLabelsGroup.element.querySelectorAll(
                'g.highcharts-label[visibility="hidden"]'
            ).length,
            6,
            'All six labels of the second series should be hidden.'
        );

        chart.series[0].hide();

        assert.strictEqual(
            chart.series[1].dataLabelsGroup.element.querySelectorAll(
                'g.highcharts-label[visibility="hidden"]'
            ).length,
            0,
            'All six labels of the second series should be visible.'
        );


    }
);

QUnit.test(
    'Data labels with missing values on arearange (#9247)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'arearange',
                width: 600,
                height: 400
            },
            series: [{
                data: [
                    [0, 1],
                    [2, 3],
                    [4, 5],
                    [0, 5]
                ],
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.y > 0.5 && this.y < 4.5) {
                            return this.y;
                        }
                        return null;
                    }
                }
            }]

        });

        assert.deepEqual(
            chart.series[0].points.map(function (p) {
                return p.dataLabels && p.dataLabels.length;
            }),
            [1, 2, 1, 0],
            'Data labels should only exist inside given range'
        );

        var dlPositions = [
            chart.series[0].points[1].dataLabel.translateX,
            chart.series[0].points[1].dataLabelUpper.translateX
        ];
        chart.setSize(500);
        assert.strictEqual(
            typeof dlPositions[0],
            'number',
            'Comparing real numbers...'
        );
        assert.strictEqual(
            typeof dlPositions[1],
            'number',
            'Comparing real numbers...'
        );
        assert.notEqual(
            chart.series[0].points[1].dataLabel.translateX,
            dlPositions[0],
            'Data label has moved (#9247)'
        );
        assert.notEqual(
            chart.series[0].points[1].dataLabelUpper.translateX,
            dlPositions[1],
            'Data label has moved (#9247)'
        );

        // We should be able to destroy without errors
        chart.destroy();
    }
);