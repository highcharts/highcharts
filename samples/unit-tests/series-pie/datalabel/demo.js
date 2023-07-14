QUnit.test('Pie data labels general tests', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            series: [
                {
                    animation: false,
                    type: 'pie',
                    states: {
                        inactive: {
                            opacity: 0
                        }
                    },
                    data: [
                        {
                            name: 'Firefox',
                            y: 44.2,
                            dataLabels: {
                                style: {
                                    fontSize: '40px'
                                }
                            }
                        },
                        ['IE7', 26.6],
                        ['IE6', 20]
                    ]
                }
            ]
        }),
        point = chart.series[0].points[0],
        dataLabelOldX = point.dataLabel.translateX,
        dataLabelOldY = point.dataLabel.translateY,
        offsetX = 20,
        offsetY = -30;

    chart.series[0].points[0].update({
        dataLabels: {
            style: {
                fontSize: '40px'
            },
            y: offsetY,
            x: offsetX
        }
    });

    assert.strictEqual(
        point.dataLabel.translateX - dataLabelOldX,
        offsetX,
        'A point dataLabel x option should be used in calculations (#12985).'
    );

    assert.strictEqual(
        point.dataLabel.translateY - dataLabelOldY,
        offsetY,
        'A point dataLabel y option should be used in calculations (#12985).'
    );

    chart.series[0].points[0].onMouseOver();

    assert.strictEqual(
        chart.series[0].points[1].dataLabel.opacity,
        0,
        '#15377: Inactive point should have 0 opacity'
    );
});

QUnit.test(
    'Pie data labels were not hidden on scaling down (#4905)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                width: 520,
                height: 300,
                animation: false
            },
            plotOptions: {
                pie: {
                    animation: false,
                    size: '70%' // Removing size option will fix labels reflow issue
                }
            },
            series: [
                {
                    data: [
                        {
                            y: 20541,
                            name: 'David Cameron'
                        },
                        {
                            y: 6462,
                            name: 'Barack Obama'
                        },
                        {
                            y: 3954,
                            name: 'Jeremy Corbyn'
                        },
                        {
                            y: 3826,
                            name: 'Donald Trump'
                        },
                        {
                            y: 3395,
                            name: 'David'
                        },
                        {
                            y: 3046,
                            name: 'David Price'
                        },
                        {
                            y: 2853,
                            name: 'Obama'
                        },
                        {
                            y: 2693,
                            name: 'David Warner'
                        },
                        {
                            y: 2626,
                            name: 'Hillary Clinton'
                        },
                        {
                            y: 2565,
                            name: 'Francois Hollande'
                        },
                        {
                            y: 2421,
                            name: 'David Beckham'
                        },
                        {
                            y: 2410,
                            name: 'Vladimir Putin'
                        },
                        {
                            y: 2007,
                            name: 'Angela Merkel'
                        },
                        {
                            y: 1879,
                            name: 'Malcolm Turnbull'
                        },
                        {
                            y: 1745,
                            name: 'Xi Jinping'
                        },
                        {
                            y: 1717,
                            name: 'Francis'
                        },
                        {
                            y: 1686,
                            name: 'David Wright'
                        },
                        {
                            y: 1502,
                            name: 'Andy Murray'
                        },
                        {
                            y: 1483,
                            name: 'Bernie Sanders'
                        },
                        {
                            y: 1476,
                            name: 'Usman Khawaja'
                        },
                        {
                            y: 1428,
                            name: 'Bashar al-Assad'
                        },
                        {
                            y: 1413,
                            name: 'Michael Cheika'
                        },
                        {
                            y: 1393,
                            name: 'Louis van Gaal'
                        },
                        {
                            y: 1375,
                            name: 'Jeb Bush'
                        },
                        {
                            y: 1338,
                            name: 'Tashfeen Malik'
                        },
                        {
                            y: 1068,
                            name: 'David Moyes'
                        },
                        {
                            y: 1000,
                            name: 'Michael'
                        },
                        {
                            y: 999,
                            name: 'Louis'
                        },
                        {
                            y: 998,
                            name: 'Jeb'
                        },
                        {
                            y: 996,
                            name: 'Tashfeen'
                        },
                        {
                            y: 995,
                            name: 'Alex'
                        }
                    ],
                    name: 'Test'
                }
            ]
        });

        function getVisibleLabelCount() {
            return chart.series[0].points.filter(function (point) {
                return point.dataLabel.attr('visibility') !== 'hidden';
            }).length;
        }

        var initialLabelCount = getVisibleLabelCount();

        assert.strictEqual(
            typeof initialLabelCount,
            'number',
            'Initial label count'
        );

        chart.setSize(900, 600);
        assert.ok(
            getVisibleLabelCount() > initialLabelCount,
            'More labels visible'
        );

        chart.setSize(520, 300);
        assert.strictEqual(
            getVisibleLabelCount(),
            initialLabelCount,
            'Back to start'
        );
    }
);

QUnit.test('Null points should not have data labels(#4641)', function (assert) {
    var chart = $('#container')
        .highcharts({
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f} %'
                    }
                }
            },
            series: [
                {
                    name: 'Brands',
                    data: [
                        {
                            name: 'Microsoft Internet Explorer',
                            // y: 56.33,
                            y: null
                        },
                        {
                            name: 'Chrome',
                            y: 24.03
                        },
                        {
                            name: 'Firefox',
                            y: 10.38
                        },
                        {
                            name: 'Safari',
                            y: 4.77
                        },
                        {
                            name: 'Opera',
                            y: 0.91
                        },
                        {
                            name: 'Proprietary or Undetectable',
                            y: 0.2
                        }
                    ]
                }
            ]
        })
        .highcharts();

    assert.strictEqual(
        typeof chart.series[0].points[0].dataLabel,
        'undefined',
        'No Data label for null point'
    );
    assert.strictEqual(
        typeof chart.series[0].points[1].dataLabel,
        'object',
        'Second point has data label'
    );
});

QUnit.test('Pie Point dataLabel distance (#1174)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        plotOptions: {
            series: {
                animation: false,
                dataLabels: {
                    distance: 20
                },
                size: '100%'
            }
        },

        series: [
            {
                data: [
                    {
                        y: 3,
                        dataLabels: {
                            distance: -30
                        }
                    }
                ]
            },
            {
                dataLabels: {
                    distance: -30
                },
                data: [
                    {
                        y: 3
                    }
                ]
            }
        ]
    });
    var dataLabel1 = chart.series[0].data[0].dataLabel,
        dataLabel2 = chart.series[1].data[0].dataLabel;

    assert.equal(dataLabel1.x, dataLabel2.x, 'x value of dataLabels');

    assert.equal(dataLabel1.y, dataLabel2.y, 'y value of dataLabels');
});

QUnit.test('Small pie and labels (#6992)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'pie',
                size: 10,
                data: [1, 2, 3, 4, 5, 6, 7]
            }
        ],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    rotation: -45
                }
            }
        }
    });
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'All numbers valid'
    );
});

// Highcharts v4.0.1, Issue #3163
// Pie chart data labels drawn outside plot area
QUnit.test('Pie labels outside plot (#3163)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                height: 243,
                type: 'pie',
                plotBackgroundColor: '#EFEFFF'
            },
            title: {
                text: null
            },
            series: [
                {
                    name: 'Value',
                    showInLegend: true,
                    dataLabels: {
                        format: '{y:,f}'
                    },
                    minSize: 150,
                    data: [
                        {
                            name: '641397 (Description 641397)',
                            y: 46115816.0
                        },
                        {
                            name: '641402 (Description 641402)',
                            y: 23509037.0
                        },
                        {
                            name: '641396 (Description 641396)',
                            y: 18884796.0
                        },
                        {
                            name: '641403 (Description 641403)',
                            y: 11970798.0
                        }
                    ]
                }
            ]
        }),
        plotSizeY = chart.plotSizeY,
        seriesData = chart.series[0].data,
        labelYPos = [];

    for (var i = 0; i < seriesData.length; i++) {
        labelYPos.push(seriesData[i].labelPosition.computed.y);
    }

    function isLabelInsidePlot() {
        for (var i = 0; i < labelYPos.length; i++) {
            if (labelYPos[i] < 0) {
                return false;
            }
            if (labelYPos[i] > plotSizeY) {
                return false;
            }
        }
        return true;
    }

    assert.ok(isLabelInsidePlot(), 'Pie label is outside of plot');
});

QUnit.test(
    'Mouse events on dataLabels with useHTML set to true.',
    function (assert) {
        var clicked = false,
            chart = new Highcharts.Chart({
                chart: {
                    type: 'pie',
                    renderTo: 'container'
                },
                series: [
                    {
                        dataLabels: {
                            useHTML: true
                        },
                        point: {
                            events: {
                                click: function () {
                                    clicked = true;
                                }
                            }
                        },
                        data: [
                            ['Firefox', 44.2],
                            ['IE7', 26.6],
                            { name: 'IE6', y: 20, visible: false },
                            ['Chrome', 3.1],
                            ['Other', 5.4]
                        ]
                    }
                ]
            }),
            points = chart.series[0].points,
            offset = Highcharts.offset(chart.container);

        assert.ok(
            true,
            '#15909: Hidden point with useHTML dataLabels should not throw'
        );

        Highcharts.fireEvent(points[0].dataLabel.div, 'mouseover', {
            which: 1,
            pageX: offset.left + points[0].labelPosition.natural.x,
            pageY: offset.top + points[0].labelPosition.natural.y
        });

        assert.strictEqual(
            points[0] === chart.hoverPoint,
            true,
            'First point hovered.'
        );

        Highcharts.fireEvent(points[4].dataLabel.div, 'mouseover', {
            which: 1,
            pageX: offset.left + points[4].labelPosition.natural.x,
            pageY: offset.top + points[4].labelPosition.natural.y
        });

        assert.strictEqual(
            points[4] === chart.hoverPoint,
            true,
            'Last point hovered.'
        );

        chart.pointer.onContainerClick({
            pageX: offset.left + points[4].labelPosition.natural.x,
            pageY: offset.top + points[4].labelPosition.y,
            target: points[4].dataLabel.div
        });

        assert.strictEqual(clicked, true, 'Click event on dataLabel works.');
    }
);

QUnit.test('Wide data labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [
            {
                type: 'pie',
                data: [
                    ['The quick brown fox jumps over the lazy dog', 1],
                    ['The quick brown fox jumps over the lazy dog', 1],
                    ['The quick brown fox jumps over the lazy dog', 1],
                    ['The quick brown fox jumps over the lazy dog', 1],
                    ['The quick brown fox jumps over the lazy dog', 1],
                    ['The quick brown fox jumps over the lazy dog', 1]
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].group.getBBox().width > 200,
        'The pie should not be shrinked too much'
    );

    assert.strictEqual(
        chart.series[0].points[0].dataLabel.element.textContent.indexOf('…'),
        -1,
        'There should be no ellipsis in the data label'
    );
});

QUnit.test(
    'Pie with long dataLabels with useHTML: true wrongly rendered',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 100
            },
            series: [
                {
                    type: 'pie',
                    dataLabels: {
                        useHTML: true
                    },
                    data: [
                        {
                            name: '<div>Test</div>',
                            y: 550
                        },
                        {
                            name: '<div>Testing two test test test test</div>',
                            y: 432
                        },
                        {
                            name: '<div>Testing s three</div>',
                            y: 320
                        },
                        {
                            name: '<div>Testing four test test</div>',
                            y: 210.009
                        }
                    ]
                }
            ]
        });

        assert.ok(
            // eslint-disable-next-line no-underscore-dangle
            chart.series[0].points[2].dataLabels[0]._attr.width >= 0,
            'Data label width cannot be negative'
        );
    }
);

QUnit.test('Connector color of individual point (#8864).', function (assert) {
    var chart = Highcharts.chart('container', {
        plotOptions: {
            pie: {
                dataLabels: {
                    connectorColor: '#000',
                    enabled: true
                }
            }
        },
        series: [
            {
                type: 'pie',
                data: [
                    {
                        y: 61.41,
                        dataLabels: {
                            connectorColor: '#bada55'
                        }
                    },
                    {
                        y: 11.84
                    }
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[0].connector.attr('stroke') === '#bada55',
        'Color applied to indiviudal connector.'
    );
});
