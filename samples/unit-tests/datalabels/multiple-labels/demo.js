QUnit.test('Multiple data labels general tests.', function (assert) {
    var defined = Highcharts.defined,
        chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },
            series: [
                {
                    type: 'xrange',
                    name: 'Project 1',
                    dataLabels: [
                        {
                            enabled: true,
                            format: 'Left label',
                            align: 'left'
                        },
                        {
                            enabled: true,
                            format: 'Right label',
                            align: 'right'
                        }
                    ],
                    data: [
                        {
                            name: 'Start prototype',
                            x: Date.UTC(2014, 10, 18),
                            x2: Date.UTC(2014, 10, 25),
                            y: 1
                        },
                        {
                            name: 'Test prototype',
                            x: Date.UTC(2014, 10, 27),
                            x2: Date.UTC(2014, 10, 29),
                            y: 2
                        },
                        {
                            name: 'Develop',
                            x: Date.UTC(2014, 10, 20),
                            x2: Date.UTC(2014, 10, 25),
                            y: 3
                        },
                        {
                            name: 'Run acceptance tests',
                            x: Date.UTC(2014, 10, 23),
                            x2: Date.UTC(2014, 10, 26),
                            y: 4
                        }
                    ]
                }
            ]
        }),
        result;

    var controller = new TestController(chart),
        point = chart.series[0].points[0],
        correct = true;

    point.dataLabels.forEach(function (dataLabel, i) {
        if (i === 0) {
            controller.touchStart(0, 0);
        }
        controller.moveTo(
            chart.plotLeft + dataLabel.x + dataLabel.width / 2,
            chart.plotTop + dataLabel.y + dataLabel.height / 2
        );

        if (chart.hoverPoint !== point) {
            correct = false;
        }
    });

    assert.strictEqual(
        correct,
        true,
        'Appropriate tooltip appears when hovering both point\'s data labels.'
    );

    assert.strictEqual(
        defined(point.dataLabels[0].element.point) &&
            defined(point.dataLabels[1].element.point),
        true,
        'Both data labels have point reference within element.'
    );

    // dataLabels - other than first are showing outside or zoomed range #12370
    function checkLabelsVisibility(chart, action) {
        var res = true;

        if (action === 'hide') {
            chart.yAxis[0].setExtremes(3.5, 4.5);
        } else if (action === 'show') {
            chart.yAxis[0].setExtremes(0, 4.5);
        }

        chart.series[0].points[0].dataLabels.forEach(function (dl) {
            if (
                (action === 'hide' && dl.attr('visibility') !== 'hidden') ||
                (action === 'show' && dl.attr('visibility') === 'hidden')
            ) {
                res = false;
            }
        });

        return res;
    }

    chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            inverted: false
        },
        yAxis: {
            xreversed: undefined,
            reversed: false
        },
        series: [
            {
                dataLabels: [
                    {
                        enabled: true,
                        inside: true,
                        align: 'center',
                        format: '1st label'
                    },
                    {
                        enabled: !false,
                        format: '2nd'
                    }
                ],
                name: 'Tokyo',
                data: [
                    [0, 3],
                    [1, 4]
                ]
            }
        ]
    });

    result = checkLabelsVisibility(chart, 'hide');
    assert.ok(result, 'All data labels should be hidden (#12370).');

    result = checkLabelsVisibility(chart, 'show');
    assert.ok(result, 'All data labels should be visible (#12370).');

    chart.yAxis[0].update({
        reversed: true
    });

    result = checkLabelsVisibility(chart, 'hide');
    assert.ok(
        result,
        'All data labels should be hidden when yAxis is reversed (#12370).'
    );

    result = checkLabelsVisibility(chart, 'show');
    assert.ok(
        result,
        'All data labels should be visible when yAxis is reversed (#12370).'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    result = checkLabelsVisibility(chart, 'hide');
    assert.ok(
        result,
        'All data labels should be hidden when chart is inverted and yAxis is reversed (#12370).'
    );

    result = checkLabelsVisibility(chart, 'show');
    assert.ok(
        result,
        'All data labels should be visible when chart is inverted and yAxis is reversed (#12370).'
    );

    chart.yAxis[0].update({
        reversed: false
    });

    result = checkLabelsVisibility(chart, 'hide');
    assert.ok(
        result,
        'All data labels should be hidden when chart is inverted (#12370).'
    );

    result = checkLabelsVisibility(chart, 'show');
    assert.ok(
        result,
        'All data labels should be visible when chart is inverted (#12370).'
    );

    chart.series[0].update({
        dataLabels: [{
            enabled: true
        }, {
            enabled: false
        }]
    });

    assert.ok(
        true,
        'There shouldn\'t be any error in the browser console (#17589).'
    );

    assert.strictEqual(
        chart.series[0].points[0].dataLabels[1],
        void 0,
        'Second data label should be disabled (#17589}.'
    );
});
