QUnit.test('Stack labels on non-data axis', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 100,
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [
            {
                data: [-10, -10, -15]
            }
        ]
    });

    assert.notStrictEqual(
        chart.container
            .querySelector('.highcharts-stack-labels text')
            .getAttribute('y'),
        null,
        'Y attribute should be set (#8834)'
    );

    assert.strictEqual(
        chart.container
            .querySelector('.highcharts-label.highcharts-stack-labels')
            .getAttribute('visibility'),
        'hidden',
        'Stack label should be hidden (#8834)'
    );
});

QUnit.test('Stack labels crop and overflow features #8912', function (assert) {
    let firstStackLabel;
    let lastStackLabel;

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 250,
            height: 260
        },

        xAxis: {
            allowDecimals: true
        },

        yAxis: {
            stackLabels: {
                enabled: true,
                allowOverlap: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [
            {
                data: [29.9123464, -71.5123464, 106.4123464, 129.2123464]
            },
            {
                data: [144.0123464, -176.0123464, 135.6123464, 148.5123464]
            },
            {
                data: [
                    144.0123464,
                    -176.0123464,
                    135.6123464,
                    148.5123464
                ].reverse()
            }
        ]
    });

    const getFirstAndLast = () => {
        const stacks = chart.yAxis[0].stacking.stacks,
            stackKey = Object.keys(stacks)[0];

        return [stacks[stackKey][0].label, stacks[stackKey][3].label];
    };

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x + firstStackLabel.padding,
        0,
        'Stack label should be inside plot area left'
    );

    assert.close(
        lastStackLabel.alignAttr.x +
            lastStackLabel.width -
            lastStackLabel.padding,
        chart.plotWidth,
        0.5,
        'Stack label should be inside plot area right'
        // 0.5 is a difference taken from the stackLabel.width which value is
        // not rounded
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'allow'
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    assert.strictEqual(
        lastStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: false
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x + firstStackLabel.padding >= 0,
        false,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
            lastStackLabel.width -
            lastStackLabel.padding <=
            chart.plotWidth,
        false,
        'Stack label should be outside plot area'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x + firstStackLabel.padding >= 0,
        true,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
            lastStackLabel.width -
            lastStackLabel.padding <=
            chart.plotWidth,
        false,
        'Stack label should be outside plot area'
    );
    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: true
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    assert.strictEqual(
        lastStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'justify',
                crop: true
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x + firstStackLabel.padding >= 0,
        true,
        'Stack label should be inside plot area left'
    );
    assert.strictEqual(
        lastStackLabel.alignAttr.x +
            lastStackLabel.width -
            lastStackLabel.padding <=
            chart.plotWidth,
        true,
        'Stack label should be inside plot area right'
    );
});

QUnit.test('Stack labels overlapping issue #11982', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 200
        },

        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        series: [
            {
                stacking: 'normal',
                data: [25.2, 24, 25, 26, 25, 25, 23, 27, 25, 25, 25, 25, 25, 25]
            }
        ]
    });

    assert.strictEqual(
        chart.yAxis[0].stacking.stacks['column,,,'][2].label.opacity,
        0,
        'This stack-label should be hidden because of overlapping #11982'
    );
});

QUnit.test(
    'StackLabels outside xAxis min & max range are displayed #12294',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                height: 400
            },
            xAxis: {
                min: 2,
                max: 8
            },
            yAxis: {
                stackLabels: {
                    enabled: true,
                    padding: 5
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointPadding: 0,
                    groupPadding: 0
                }
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
                },
                {
                    data: [
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4,
                        29.9,
                        71.5,
                        106.4,
                        129.2
                    ]
                }
            ]
        });

        var testValue =
            chart.yAxis[0].stacking.stacks['column,,,'][4].label.alignAttr;

        // StackedLabel has incorrect position after resize chart container
        // #12337
        chart.update({
            chart: {
                height: 150
            }
        });

        chart.update({
            chart: {
                height: 400
            }
        });

        var column = chart.yAxis[0].stacking.stacks['column,,,'],
            padding = chart.yAxis[0].options.stackLabels.padding;

        assert.strictEqual(
            column[0].label.visibility,
            'hidden',
            'This stack-label should be hidden because of x min #12294'
        );

        assert.strictEqual(
            column[10].label.visibility,
            'hidden',
            'This stack-label should be hidden because of x max #12294'
        );

        assert.strictEqual(
            column[4].label.alignAttr.x,
            testValue.x,
            'This stack-label alignAttr should be ' +
                'the same after chart resize #12337'
        );

        assert.strictEqual(
            column[4].label.alignAttr.y,
            testValue.y,
            'This stack-label alignAttr should be ' +
                'the same after chart resize #12337'
        );

        chart.update({
            chart: {
                inverted: true
            }
        });

        column = chart.yAxis[0].stacking.stacks['column,,,'];

        assert.strictEqual(
            column[4].label.text.x,
            padding,
            'This stack-label text x attribute should be ' +
                'equal to set padding #12308'
        );
    }
);

QUnit.test(
    'Stack labels align issue when yAxis/xAxis is moved #11500',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },

            yAxis: {
                stackLabels: {
                    enabled: true
                }
            },
            xAxis: {
                left: '50%',
                width: '50%'
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            series: [
                {
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2],
                    dataLabels: {
                        enabled: true
                    }
                },
                {
                    name: 'Year 1900',
                    data: [133, 156, 947, 408, 6]
                }
            ]
        });

        const getStack = () => {
            const stacks = chart.yAxis[0].stacking.stacks,
                stackKey = Object.keys(stacks)[0];

            return stacks[stackKey][0].label;
        };

        let dataLabel = chart.series[0].points[0].dataLabel,
            stackLabel = getStack();

        assert.strictEqual(
            stackLabel.parentGroup.translateX + stackLabel.translateX,
            dataLabel.parentGroup.translateX + dataLabel.x,
            'This stack-label should moved to the same ' +
                'position as dataLabel #11500'
        );

        chart.update({
            chart: {
                type: 'bar'
            },
            yAxis: {
                left: '50%'
            }
        });

        dataLabel = chart.series[0].points[0].dataLabel;
        stackLabel = getStack();

        assert.ok(
            stackLabel.parentGroup.translateY + stackLabel.translateY,
            dataLabel.parentGroup.translateY + dataLabel.y,
            'This stack-label should moved to the same ' +
                'position as dataLabel #11500'
        );
    }
);

QUnit.test('Stack labels various', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        yAxis: {
            stackLabels: {
                enabled: true,
                backgroundColor: 'black',
                borderWidth: 2,
                borderColor: 'red',
                borderRadius: 4,
                style: {
                    color: 'red'
                }
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [
            {
                name: 'A',
                data: [5, 3]
            },
            {
                name: 'B',
                data: [15, 12]
            }
        ]
    });

    // Styles options (#13330)
    const stackLabel = chart.yAxis[0].stacking.stacks['column,,,'][0];

    assert.strictEqual(
        stackLabel.label.fill,
        stackLabel.options.backgroundColor,
        'This stack-label fill atribute should be same as ' +
            'set in options #13330'
    );

    assert.strictEqual(
        stackLabel.label.attr('stroke'),
        stackLabel.options.borderColor,
        'This stack-label stroke atribute should be same as ' +
            'set in options #13330'
    );

    assert.strictEqual(
        stackLabel.label['stroke-width'],
        stackLabel.options.borderWidth,
        'This stack-label stroke-width atribute should be same as ' +
            'set in options #13330'
    );

    assert.strictEqual(
        stackLabel.label.box.r,
        stackLabel.options.borderRadius,
        'This stack-label box r atribute should be same as ' +
            'set in options #13330'
    );

    // Verify labels are not orphaned or duplicated (#2336)
    assert.strictEqual(
        chart.container.querySelectorAll(
            '.highcharts-stack-labels .highcharts-label'
        ).length,
        2,
        'There should be two labels initially'
    );

    chart.setSize(300, undefined, false);

    assert.strictEqual(
        chart.container.querySelectorAll(
            '.highcharts-stack-labels .highcharts-label'
        ).length,
        2,
        'There should still be two labels after redraw'
    );

});

QUnit.test(
    'StackLabels Initial animation - defer test #12901',
    function (assert) {
        var clock = null;

        try {
            clock = TestUtilities.lolexInstall();

            var chart = Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },

                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            animation: {
                                defer: 400,
                                duration: 100
                            }
                        }
                    },

                    yAxis: {
                        stackLabels: {
                            enabled: true
                        }
                    },

                    series: [
                        {
                            data: [
                                43934,
                                52503,
                                57177,
                                69658,
                                97031,
                                119931,
                                137133,
                                154175
                            ]
                        },
                        {
                            data: [
                                43934,
                                52503,
                                57177,
                                69658,
                                97031,
                                119931,
                                137133,
                                154175
                            ].reverse()
                        }
                    ]
                }),
                done = assert.async(),
                labelOpacity;

            setTimeout(function () {
                // Animation started
                labelOpacity = chart.yAxis[0].stacking.stackTotalGroup.opacity;
                assert.strictEqual(
                    labelOpacity,
                    0,
                    'Animate should not be started - ' +
                        'stackLabels should be invisible'
                );

                setTimeout(function () {
                    labelOpacity =
                        chart.yAxis[0].stacking.stackTotalGroup.opacity;
                    // Animation started but not finished
                    assert.strictEqual(
                        labelOpacity > 0 && labelOpacity < 1,
                        true,
                        'Animation should be started but not finished'
                    );
                }, 250);

                setTimeout(function () {
                    labelOpacity =
                        chart.yAxis[0].stacking.stackTotalGroup.opacity;
                    // Animation finished
                    assert.strictEqual(
                        labelOpacity,
                        1,
                        'Animate should be finished - ' +
                            'stackLabels should be visible'
                    );
                    // All tests are done
                    done();
                }, 400);
            }, 200);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);

QUnit.test('#8742: Some stackLabels did not render with dataLabels enabled', assert => {
    [
        'column',
        'bar'
    ].forEach(type => {
        const chart = Highcharts.chart('container', {
            chart: {
                type
            },
            yAxis: {
                stackLabels: {
                    enabled: true
                }
            },
            plotOptions: {
                [type]: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        inside: false
                    }
                }
            },
            series: [{
                data: [0, 99, 454, 297, 409]
            }, {
                data: [51, 150, 155, 106, 97]
            }, {
                data: [19, 107, 184, 138, 150]
            }]
        });

        const stack = chart.yAxis[0].stacking.stacks[`${type},,,`];
        assert.ok(
            Object.values(stack).every(item => item.label.visibility !== 'hidden'),
            `${type}: All stackLabels should be visible`
        );
    });
});

QUnit.test('Stack labels - scrollable plot Area #12133.', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            scrollablePlotArea: {
                minHeight: 600
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                },
                stacking: 'normal'
            }
        },
        series: [{
            data: [6, 11, 3, 4, 2, 9, 7, 7, 5, 5, 4, 2, 2, 1]
        }, {
            data: [29, 8, 11, 8, 6, 0, 0, 0, 0, 0, 1, 1, 0, 0]
        }]
    });
    const getStack = chart => {
        const stacks = chart.yAxis[0].stacking.stacks,
            stackKey = Object.keys(stacks)[0];

        return stacks[stackKey][0].label;
    };
    const stack = getStack(chart),
        dataLabel = chart.series[0].points[0].dataLabel;

    assert.close(
        stack.alignAttr.y,
        dataLabel.alignAttr.y,
        1,
        'the `y` position should be the same for dataLabel and stackLabel'
    );
});

QUnit.test('Stack labels - Axis left set', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        xAxis: [
            { width: '50%' },
            {
                left: '50%',
                width: '50%',
                offset: 0
            }
        ],
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                data: [133, 156, 947, 408],
                xAxis: 1
            },
            {
                data: [973, 914, 1054, 732],
                xAxis: 1
            }
        ]
    });

    const getStack = chart => {
        const stacks = chart.yAxis[0].stacking.stacks,
            stackKey = Object.keys(stacks)[0];

        return stacks[stackKey][0].label;
    };

    const stack = getStack(chart),
        dataLabel = chart.series[0].points[0].dataLabel,
        stackX = stack.absoluteBox.x + stack.absoluteBox.width / 2,
        dataLabelX = dataLabel.absoluteBox.x + dataLabel.absoluteBox.width / 2;

    assert.close(
        stackX,
        dataLabelX,
        1,
        'the middle of stackLabel and dataLabel should be similar.'
    );
});


// Not implemented yet
QUnit.skip('Stack labels - center in category', assert => {
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                centerInCategory: true
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        series: [
            {
                stack: 0,
                data: [15, 0, 0]
            },
            {
                stack: 0,
                data: [22, 14, 17]
            },
            {
                stack: 1,
                data: [2, null, 0]
            },
            {
                stack: 1,
                data: [0, null, 6]
            },
            {
                stack: 2,
                data: [44, 7, null]
            }
        ]
    });
    assert.ok(true);
});

QUnit.test('Stack labels - reverse axis/inverted chart - #8843.', assert => {
    const getOptions = (inverted, reversed) => ({
        chart: {
            inverted,
            type: 'column'
        },
        title: {
            text: `chart.inverted: ${inverted}, yAxis.reversed: ${reversed}`,
            style: {
                fontSize: '14px'
            }
        },
        xAxis: {
            categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
        },
        yAxis: {
            stackLabels: {
                enabled: true
            },
            reversed,
            minPadding: 0,
            maxPadding: 0
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            bar: {
                /* pointPadding:0 */
            },
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'normal',
                        textOutline: 'none',
                        color: '#888'
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3, -1, -2, -3]
        }, {
            data: [1, 2, 3, -1, -2, -3]
        }]
    });

    const chart = Highcharts.chart('container', getOptions(false, true));
    let alignOptions1 = chart.yAxis[0].stacking.stacks['column,,,'][0].alignOptions;
    let alignOptions2 = chart.yAxis[0].stacking.stacks['-column,,,'][3].alignOptions;

    assert.equal(
        alignOptions1.align,
        'center',
        'positive value not inverted chart reversed axis '
    );
    assert.equal(
        alignOptions1.verticalAlign,
        'bottom',
        'positive value not inverted chart reversed axis '
    );
    assert.equal(
        alignOptions2.align,
        'center',
        'negative value not inverted chart, reversed axis'
    );
    assert.equal(
        alignOptions2.verticalAlign,
        'top',
        'negative value not inverted chart, reversed axis'
    );
    chart.update(getOptions(true, true));
    alignOptions1 = chart.yAxis[0].stacking.stacks['column,,,'][0].alignOptions;
    alignOptions2 = chart.yAxis[0].stacking.stacks['-column,,,'][3].alignOptions;

    assert.equal(
        alignOptions1.align,
        'left',
        'positive value inverted chart reversed axis '
    );
    assert.equal(
        alignOptions1.verticalAlign,
        'middle',
        'positive value inverted chart reversed axis '
    );
    assert.equal(
        alignOptions2.align,
        'right',
        'negative value inverted chart, reversed axis'
    );
    assert.equal(
        alignOptions2.verticalAlign,
        'middle',
        'negative value inverted chart, reversed axis'
    );
    chart.update(getOptions(true, false));
    alignOptions1 = chart.yAxis[0].stacking.stacks['column,,,'][0].alignOptions;
    alignOptions2 = chart.yAxis[0].stacking.stacks['-column,,,'][3].alignOptions;

    assert.equal(
        alignOptions1.align,
        'right',
        'positive value inverted chart not reversed axis '
    );
    assert.equal(
        alignOptions1.verticalAlign,
        'middle',
        'positive value inverted chart not reversed axis '
    );
    assert.equal(
        alignOptions2.align,
        'left',
        'negative value inverted chart not reversed axis'
    );
    assert.equal(
        alignOptions2.verticalAlign,
        'middle',
        'negative value inverted chart not reversed axis'
    );
});
