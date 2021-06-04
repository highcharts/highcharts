QUnit.test('Plot band labels outside plot area (#3983)', function (assert) {
    var chart,
        options = {
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
                    }
                ]
            },

            series: [
                {
                    data: [1, 2, 3, 4, 5, 6, 7],
                    pointStart: 10
                }
            ]
        };

    // Create the Highcharts chart
    chart = $('#container').highcharts(options).highcharts();

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

    // Create the Highcharts Stock chart
    chart = $('#container').highcharts('StockChart', options).highcharts();

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
            chart = Highcharts.stockChart('container', {
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
            });

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
    }
);
