QUnit.test('Plot band labels', function (assert) {
    let chart;
    const options = {
        chart: {
            width: 600
        },
        xAxis: {
            plotBands: [
                {
                    from: 5,
                    to: 6,
                    color: Highcharts.getOptions().colors[0],
                    label: {
                        text: 'Before'
                    }
                },
                {
                    from: 12,
                    to: 13,
                    color: Highcharts.getOptions().colors[2],
                    label: {
                        text: 'Within'
                    }
                },
                {
                    from: 25,
                    to: 26,
                    color: Highcharts.getOptions().colors[3],
                    label: {
                        text: 'After'
                    }
                },
                {
                    value: 11,
                    label: {
                        text: 'Abcdef',
                        x: 0,
                        useHTML: true
                    }
                }
            ]
        },

        yAxis: {
            plotLines: [{
                value: 4,
                label: {
                    text: 'Big text',
                    useHTML: true,
                    style: {
                        fontSize: '2em'
                    },
                    align: 'right'
                }
            }, {
                value: 5,
                label: {
                    text: 'Small text',
                    useHTML: true,
                    align: 'right'
                }
            }]
        },

        series: [
            {
                data: [1, 2, 3, 4, 5, 6, 7],
                pointStart: 10
            }
        ]
    };

    // Create the Highcharts chart
    chart = Highcharts.chart('container', options);

    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[0].label,
        'undefined',
        'Highcharts - before'
    );
    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[1].label,
        'object',
        'Highcharts - within'
    );
    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[2].label,
        'undefined',
        'Highcharts - after'
    );

    const line = chart.xAxis[0].plotLinesAndBands[3].svgElem.getBBox(),
        label = chart.xAxis[0].plotLinesAndBands[3].label;

    assert.close(
        line.x,
        label.x,
        1,
        'HTML label should be placed (x-pos) near the plot line (#20792).'
    );

    // Create the Highcharts Stock chart
    chart = Highcharts.stockChart('container', options);

    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[0].label,
        'undefined',
        'Label less than x axis should not be rendered'
    );
    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[1].label,
        'object',
        'Label within x axis should be rendered'
    );
    assert.equal(
        typeof chart.xAxis[0].plotLinesAndBands[2].label,
        'undefined',
        'Label greater than x axis should not be rendered'
    );

    assert.close(
        chart.yAxis[0].plotLinesAndBands[0].label.element
            .getBoundingClientRect()
            .right,
        chart.yAxis[0].plotLinesAndBands[1].label.element
            .getBoundingClientRect()
            .right,
        1,
        'Font size should be considered when laying out label (#19488)'
    );
});

QUnit.test('NaN in label position (#7175)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            plotBands: [
                {
                    // mark the weekend
                    color: '#FCFFC5',
                    from: Date.UTC(2010, 0, 2),
                    to: Date.UTC(2010, 0, 4),
                    label: {
                        text: 'Plot band'
                    }
                }
            ],
            tickInterval: 24 * 3600 * 1000, // one day
            type: 'datetime'
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    56.4,
                    69.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4
                ],
                pointStart: Date.UTC(2010, 0, 1),
                pointInterval: 24 * 3600 * 1000
            }
        ]
    });

    assert.notEqual(
        chart.container.innerHTML.indexOf('Plot band'),
        -1,
        'Label added successfully'
    );
    assert.strictEqual(chart.container.innerHTML.indexOf('NaN'), -1, 'No NaN');

    chart.series[0].hide();

    assert.strictEqual(chart.container.innerHTML.indexOf('NaN'), -1, 'No NaN');
});

QUnit.test(
    'Events should be bound to all plotBands (#6166) and plotLines (#10302).',
    function (assert) {
        var clicked,
            plotLineReference,
            cfg = {
                xAxis: {
                    min: 20,
                    max: 50,
                    plotBands: [
                        {
                            color: '#FCFFC5',
                            from: 0,
                            to: 11,
                            id: 'plotband-1',
                            events: {
                                click: function () {
                                    clicked = 'plotBand';
                                }
                            }
                        }
                    ]
                },
                series: [
                    {
                        data: [
                            [1, 20],
                            [11, 20],
                            [21, 25],
                            [41, 28]
                        ]
                    }
                ]
            },
            chart = Highcharts.stockChart('container', cfg);

        chart.xAxis[0].setExtremes(0, 10);

        var controller = new TestController(chart);
        controller.click(100, 100);

        assert.deepEqual(clicked, 'plotBand', 'Click event fired on plot band');

        // #10302
        chart.xAxis[0].setExtremes(20, 50);
        chart.update({
            xAxis: {
                plotLines: [
                    {
                        value: 5,
                        width: 20,
                        color: 'black',
                        zIndex: 1,
                        events: {
                            click: function () {
                                plotLineReference = this;
                                clicked = 'plotLine';
                            }
                        }
                    }
                ]
            }
        });

        chart.xAxis[0].setExtremes(0, 40);
        controller.click(85, 100);

        assert.deepEqual(clicked, 'plotLine', 'Click event fired on plot line');

        assert.strictEqual(
            plotLineReference,
            chart.xAxis[0].plotLinesAndBands[0],
            '\"this\" in plotline event should refer to the corresponding ' +
            'plotline object.'
        );
    }
);

QUnit.test('Plotbands in stock', assert => {

    const chart = Highcharts.stockChart('container', {
        series: [{
            data: Array.from({ length: 50 }, () => 1),
            showInNavigator: false
        }],
        xAxis: {
            min: 10,
            max: 30
        },
        navigator: {
            xAxis: {
                min: 0,
                max: 50,
                plotBands: [{
                    from: 10,
                    to: 14,
                    color: 'red'
                }]
            }
        }
    });
    const xAxis = chart.xAxis[1];
    assert.strictEqual(
        xAxis.plotLinesAndBands[0].svgElem.pathArray[0][2],
        xAxis.top,
        'The plotBand on navigator should be positioned on corresponding yAxis'
    );
});

QUnit.test('PlotBand on main axis when navigator yAxis has id', assert => {

    const chart = Highcharts.stockChart('container', {
        xAxis: {
            plotBands: [{
                from: 5,
                to: 10,
                color: 'yellow'
            }]
        },
        navigator: {
            yAxis: {
                id: 'nav-ABC'
            }
        },

        series: [{
            data: Array.from({ length: 15 }, () => 1)
        }]
    });
    const xAxis = chart.xAxis[0];

    assert.strictEqual(
        xAxis.plotLinesAndBands[0].svgElem.pathArray.length,
        5,
        'The plotband should only have 1 box'
    );
});
