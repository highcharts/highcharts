QUnit.test('Adapt height', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400,
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [
            {
                data: [1, 3, 2, 5]
            }
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        }
                    }
                },
                {
                    condition: {
                        maxWidth: 300
                    },
                    chartOptions: {
                        chart: {
                            height: '100%'
                        }
                    }
                }
            ]
        }
    });

    chart.setSize(400);

    assert.strictEqual(chart.chartWidth, 400, 'Width updated');
    assert.strictEqual(chart.chartHeight, 300, 'Height updated');

    chart.setSize(600);

    assert.strictEqual(chart.chartWidth, 600, 'Width reset');
    assert.strictEqual(chart.chartHeight, 400, 'Height reset');

    chart.setSize(200);

    assert.strictEqual(chart.chartWidth, 200, 'Width updated');
    assert.strictEqual(chart.chartHeight, 200, 'Percentage height updated');
});

QUnit.test('Callback', function (assert) {
    var condition = true;

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400,
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [
            {
                data: [1, 3, 2, 5]
            }
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        callback: function () {
                            return condition;
                        }
                    },
                    chartOptions: {
                        chart: {
                            width: 300
                        }
                    }
                }
            ]
        }
    });

    assert.strictEqual(chart.chartWidth, 300, 'Width updated');
});

QUnit.test('Responsive on chart.update', function (assert) {
    var chart = Highcharts.chart('container', {
        credits: {
            text: 'Initial',
            href: 'http://www.example.com'
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
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        callback: function () {
                            return (
                                this.options.credits.position.verticalAlign ===
                                'top'
                            );
                        }
                    },
                    chartOptions: {
                        credits: {
                            text: 'Updated'
                        }
                    }
                }
            ]
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Initial',
        'Initial credits'
    );

    // Trigger a redraw and make the responsive condition true
    chart.update({
        credits: {
            position: {
                verticalAlign: 'top'
            }
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Updated',
        'Updated credits'
    );

    // Trigger a redraw and make the responsive condition false
    chart.update({
        credits: {
            position: {
                verticalAlign: 'bottom'
            }
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-credits').textContent,
        'Initial',
        'Back to initial credits'
    );
});

QUnit.test(
    'Nested property names like series, xAxis or annotations (#6208, #8680)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },

            annotations: [
                {
                    labels: [
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: 1,
                                y: 3
                            },
                            text: 'Label'
                        }
                    ]
                }
            ],

            series: [
                {
                    data: [1, 4, 3],
                    animation: false,
                    yAxis: 0
                }
            ],

            yAxis: [
                {
                    min: 0,
                    max: 10
                },
                {
                    opposite: true,
                    min: -10,
                    max: 10
                }
            ],

            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    color: 'red'
                                }
                            },
                            series: [
                                {
                                    yAxis: 1
                                }
                            ],
                            annotations: [
                                {
                                    visible: false
                                },
                                {
                                    labels: [
                                        {
                                            point: {
                                                xAxis: 0,
                                                yAxis: 0,
                                                x: 1,
                                                y: 1
                                            },
                                            text: 'Label v2'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });

        assert.notEqual(
            chart.series[0].graph.attr('stroke'),
            'red',
            'Initial color'
        );
        assert.strictEqual(
            chart.series[0].yAxis,
            chart.yAxis[0],
            'Initial axis'
        );
        assert.strictEqual(
            chart.annotations[0].graphic.visibility,
            'inherit',
            'Initial annotation visible'
        );

        chart.setSize(400);

        assert.strictEqual(
            chart.series[0].graph.attr('stroke'),
            'red',
            'Responsive color'
        );
        assert.strictEqual(
            chart.series[0].yAxis,
            chart.yAxis[1],
            'Responsive axis'
        );
        assert.strictEqual(
            chart.annotations[0].graphic.visibility,
            'hidden',
            'Initial annotation hidden'
        );
        assert.strictEqual(
            chart.annotations.length,
            2,
            'New annotation added (#10713)'
        );

        chart.setSize(600);

        assert.strictEqual(
            chart.annotations.length,
            1,
            'Old annotation removed (#10713)'
        );
    }
);

QUnit.test('Annotations applied on init', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },

        series: [
            {
                data: [1, 4, 3],
                animation: false,
                yAxis: 0
            }
        ],

        yAxis: [
            {
                min: 0,
                max: 10
            },
            {
                opposite: true,
                min: -10,
                max: 10
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        minWidth: 100
                    },
                    chartOptions: {
                        plotOptions: {
                            series: {
                                color: 'red'
                            }
                        },
                        series: [
                            {
                                yAxis: 1
                            }
                        ],
                        annotations: [
                            {
                                labels: [
                                    {
                                        point: {
                                            xAxis: 0,
                                            yAxis: 0,
                                            x: 1,
                                            y: 1
                                        },
                                        text: 'Label v2'
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    });

    assert.strictEqual(
        chart.annotations.length,
        1,
        'Annotations should be applied to chart from responsive rule'
    );
    assert.strictEqual(
        chart.options.annotations[0].labels[0].text,
        'Label v2',
        'Annotation options should be set'
    );

});

QUnit.test('Revert axis properties', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },

        xAxis: {
            categories: ['January', 'February']
        },

        series: [
            {
                name: 'Sales',
                data: [434, 523]
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        xAxis: {
                            labels: {
                                format: 'sample'
                            }
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -2
                            }
                        }
                    }
                }
            ]
        }
    });

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.textStr,
        'January',
        'Initial label'
    );

    chart.setSize(400);

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.textStr,
        'sample',
        'Responsive label'
    );

    chart.setSize(600);

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.textStr,
        'January',
        'Initial label'
    );
});

QUnit.test('Multiple rules order (#6291)', function (assert) {
    var container = document.getElementById('container');

    container.style.position = '';

    var chart = Highcharts.chart(container, {
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        title: {
                            text: 'Max width 400'
                        }
                    }
                },
                {
                    condition: {
                        maxWidth: 300
                    },
                    chartOptions: {
                        title: {
                            text: 'Max width 300'
                        }
                    }
                },
                {
                    condition: {
                        maxWidth: 200
                    },
                    chartOptions: {
                        title: {
                            text: 'Max width 200'
                        }
                    }
                }
            ]
        },
        chart: {
            width: 450,
            animation: false
        },
        title: {
            text: 'No restrictions'
        },
        series: [
            {
                name: 'USD to EUR',
                data: [1, 2, 3],
                animation: false
            }
        ]
    });

    assert.strictEqual(
        chart.title.textStr,
        'No restrictions',
        'No restrictions (initial)'
    );

    chart.setSize(350);
    assert.strictEqual(chart.title.textStr, 'Max width 400', 'Max width 400');

    chart.setSize(250);
    assert.strictEqual(chart.title.textStr, 'Max width 300', 'Max width 300');

    chart.setSize(150);
    assert.strictEqual(chart.title.textStr, 'Max width 200', 'Max width 200');

    chart.setSize(250);
    assert.strictEqual(chart.title.textStr, 'Max width 300', 'Max width 300');

    chart.setSize(null);
    assert.strictEqual(
        chart.title.textStr,
        'No restrictions',
        'No restrictions (final)'
    );
});

QUnit.test('Mismatch of collection length (#6347)', function (assert) {
    var chart = Highcharts.chart('container', {
        responsive: {
            rules: [
                {
                    condition: {
                        maxHeight: 180
                    },
                    chartOptions: {
                        yAxis: [
                            {
                                labels: {
                                    style: {
                                        color: 'lightgreen',
                                        fontSize: '12px'
                                    }
                                }
                            },
                            {
                                labels: {
                                    style: {
                                        color: 'lightgreen',
                                        fontSize: '12px'
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        chart: {
            height: 250
        },
        series: [
            {
                name: 'Sales',
                data: [
                    434,
                    523,
                    345,
                    785,
                    565,
                    843,
                    726,
                    590,
                    665,
                    434,
                    312,
                    432
                ]
            }
        ],
        yAxis: [
            {
                labels: {
                    style: {
                        fontSize: '22px'
                    }
                }
            }
        ]
    });

    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]].label.styles
            .fontSize,
        '22px',
        'Initial font size'
    );

    chart.setSize(500, 170, false);
    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]].label.styles
            .fontSize,
        '12px',
        'Responsive font size'
    );
});

QUnit.test('Responsive rules and chart.update', function (assert) {
    var options = {
        chart: {
            type: 'column',
            width: 400
        },

        legend: {
            enabled: true
        },

        series: [
            {
                name: 'Sales',
                data: [
                    434,
                    523,
                    345,
                    785,
                    565,
                    843,
                    726,
                    590,
                    665,
                    434,
                    312,
                    432
                ]
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    // Make the labels less space demanding on mobile
                    chartOptions: {
                        legend: {
                            enabled: false
                        }
                    }
                }
            ]
        }
    };

    var chart = Highcharts.chart('container', options);

    var plotHeight = chart.plotHeight;

    assert.strictEqual(
        Boolean(chart.legend.group),
        false,
        'There should be no visible legend'
    );

    chart.update(options);

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'The height should not change'
    );

    assert.strictEqual(
        Boolean(chart.legend.group),
        false,
        'There should still be no visible legend (#9617)'
    );

    chart.setSize(600);

    assert.strictEqual(
        chart.legend.group.element.nodeName,
        'g',
        'The legend should reappear'
    );
});

QUnit.test('Falsy default', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            width: 300,
            borderWidth: 1
        },

        series: [
            {
                name: 'Christmas Eve',
                data: [1, 4, 3]
            }
        ],

        plotOptions: {
            pie: {
                showInLegend: false
            }
        },

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        plotOptions: {
                            pie: {
                                showInLegend: true,
                                dataLabels: {
                                    format: '{point.percentage}',
                                    distance: -20
                                }
                            }
                        }
                    }
                }
            ]
        }
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-legend-item').length,
        3,
        'There should be legend items for all points'
    );

    chart.setSize(500);

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-legend-item').length,
        0,
        'Legend items should be removed as per default showInLegend'
    );
});

QUnit.test('Responsive spacing options', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            borderWidth: 1,
            plotBorderWidth: 1,
            width: 600
        },
        series: [
            {
                data: [
                    ['Apples', 40],
                    ['Oranges', 60]
                ]
            }
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        minWidth: 321
                    },
                    chartOptions: {
                        chart: {
                            spacing: [10, 10, 25, 10]
                        }
                    }
                },
                {
                    condition: {
                        maxWidth: 320
                    },
                    chartOptions: {
                        chart: {
                            spacing: [18, 0, 0, 0]
                        }
                    }
                }
            ]
        }
    });

    assert.deepEqual(
        chart.spacing,
        [10, 10, 25, 10],
        'The initial spacing should correpond to responsive option'
    );

    chart.setSize(300);

    assert.deepEqual(
        chart.spacing,
        [18, 0, 0, 0],
        'The updated spacing should correpond to responsive option'
    );
});

QUnit.test('Restoring to undefined settings (#10286)', assert => {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 600,
            height: 300
        },

        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
        },

        xAxis: {
            categories: ['Apples', 'Oranges', 'Bananas'],
            labels: {
                x: -10
            }
        },

        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Amount'
            }
        },

        series: [
            {
                name: 'Christmas Eve',
                data: [1, 4, 3]
            },
            {
                name: 'Christmas Day before dinner',
                data: [6, 4, 2]
            },
            {
                name: 'Christmas Day after dinner',
                data: [8, 4, 3]
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -5
                            },
                            title: {
                                text: null
                            }
                        },
                        subtitle: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        }
                    }
                }
            ]
        }
    });

    const textY = chart.container
        .querySelector('.highcharts-yaxis-labels text')
        .getAttribute('y');

    chart.setSize(400);
    assert.notEqual(
        chart.container
            .querySelector('.highcharts-yaxis-labels text')
            .getAttribute('y'),
        textY,
        'Y axis label position should be changed'
    );

    chart.setSize(600);
    assert.strictEqual(
        chart.container
            .querySelector('.highcharts-yaxis-labels text')
            .getAttribute('y'),
        textY,
        'Y axis label position should be restored'
    );
});

QUnit.test('Pane with responsive margin', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'gauge',
            width: 400,
            height: 400,
            plotBorderWidth: 1
        },
        yAxis: {
            min: 0,
            max: 3
        },
        series: [
            {
                data: [1]
            }
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 800
                    },
                    chartOptions: {
                        chart: {
                            marginLeft: 100
                        }
                    }
                }
            ]
        }
    });

    assert.close(
        chart.plotBorder.attr('x'),
        100,
        1,
        'The plot border should respect the responsive left margin'
    );

    assert.ok(
        chart.container.querySelector('.highcharts-pane').getBBox().x > 100,
        'The rendered pane should be within the responsive left margin (#10671)'
    );
});

QUnit.test('Responsive amount of axes', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 800
        },

        yAxis: [
            {
                title: {
                    text: 'First'
                }
            },
            {
                title: {
                    text: 'Second'
                }
            }
        ],

        series: [
            {
                yAxis: 0,
                name: 'First',
                data: [
                    434,
                    523,
                    345,
                    785,
                    565,
                    843,
                    726,
                    590,
                    665,
                    434,
                    312,
                    432
                ]
            },
            {
                yAxis: 1,
                name: 'Second',
                data: [
                    4304,
                    5230,
                    3450,
                    7850,
                    5650,
                    8403,
                    3260,
                    2900,
                    6650,
                    4340,
                    3102,
                    4320
                ]
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    // Make the labels less space demanding on mobile
                    chartOptions: {
                        yAxis: [
                            {
                                title: {
                                    text: 'First'
                                }
                            }
                        ],
                        series: [
                            {
                                yAxis: 0,
                                name: 'First',
                                data: [
                                    1,
                                    2,
                                    345,
                                    785,
                                    565,
                                    843,
                                    726,
                                    590,
                                    665,
                                    434,
                                    312,
                                    432
                                ]
                            },
                            {
                                yAxis: 0,
                                name: 'Second',
                                data: [
                                    4304,
                                    5230,
                                    3450,
                                    7850,
                                    5650,
                                    8403,
                                    3260,
                                    2900,
                                    6650,
                                    4340,
                                    3102,
                                    4320
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    });

    assert.deepEqual(
        chart.yAxis.map(a => a.axisTitle.textStr),
        ['First', 'Second'],
        'Initial axis layout'
    );
    assert.strictEqual(
        chart.series[1].yAxis.options.title.text,
        'Second',
        'Initial axis binding'
    );

    chart.setSize(400);
    assert.deepEqual(
        chart.yAxis.map(a => a.axisTitle.textStr),
        ['First'],
        'Responsive rule kicks in, only the first axis should apply'
    );
    assert.strictEqual(
        chart.series[1].yAxis.options.title.text,
        'First',
        'Second series should now be bound to first Y axis'
    );

    chart.setSize(800);

    assert.deepEqual(
        chart.yAxis.map(a => a.axisTitle.textStr),
        ['First', 'Second'],
        'After resetting, initial axis layout should be restored'
    );
    assert.strictEqual(
        chart.series[1].yAxis.options.title.text,
        'Second',
        'After resetting, initial axis binding should be restored'
    );
});

QUnit.test('Initially responsive, skip update animation', assert => {

    const clock = TestUtilities.lolexInstall();
    const chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 600,
            animation: {
                duration: 100
            }
        },

        xAxis: {
            categories: ['January', 'February']
        },

        series: [
            {
                name: 'Sales',
                data: [434, 523]
            }
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 400
                        }
                    }
                }
            ]
        }
    });

    const initialDefinition = chart.series[0].graph.element.getAttribute('d');

    setTimeout(() => {
        assert.strictEqual(
            chart.series[0].graph.element.getAttribute('d'),
            initialDefinition,
            'The chart should not animate initially to responsive settings'
        );
    }, 50);

    TestUtilities.lolexRunAndUninstall(clock);

});
