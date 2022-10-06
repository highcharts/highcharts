QUnit.test('Pie borderColor null(#1828)', function (assert) {
    var chart = $('#container')
        .highcharts({
            chart: {
                type: 'pie'
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5],
                    borderColor: null,
                    borderWidth: 1
                }
            ]
        })
        .highcharts();

    chart.series[0].points.forEach((point, i) => {
        assert.equal(
            point.graphic.element.getAttribute('stroke'),
            point.graphic.element.getAttribute('fill'),
            'Point ' + i + ' has correct stroke'
        );
    });
});

QUnit.test('Undefined value (#6589)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            width: 600
        },
        series: [
            {
                animation: false,
                data: [
                    {
                        name: 'Microsoft Internet Explorer',
                        y: 56.33
                    },
                    {
                        name: 'Chrome',
                        y: 24.03,
                        sliced: true,
                        selected: true
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
                    },
                    {
                        name: 'Pipoca',
                        y: undefined
                    }
                ]
            }
        ]
    });

    var box = chart.series[0].points[0].graphic.getBBox();
    assert.ok(box.width > 50, 'Box width OK');
    assert.ok(box.height > 50, 'Box height OK');
});

QUnit.test(
    'Update to negative (#7113) + Empty pie look (#5526)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            accessibility: {
                enabled: false // A11y forces graphic for null points
            },

            chart: {
                type: 'pie',
                width: 600
            },

            series: [
                {
                    data: [10, 10, 10]
                    // data: [-10, -10, -10]
                }
            ]
        });

        // Issue #7113
        chart.series[0].setData([-10, -10, -10]);
        assert.strictEqual(
            chart.series[0].points[0].graphic,
            undefined,
            'Graphic should be removed'
        );

        // Issue #13101
        chart.series[0].points[0].select(false, false);

        // Issue #5526
        assert.ok(
            Highcharts.defined(chart.series[0].graph),
            'Empty pie graphic is created.'
        );

        chart.update({
            plotOptions: {
                pie: {
                    innerSize: 40,
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    color: '#c0ffee'
                }
            },

            series: {
                data: []
            }
        });

        var graph = chart.series[0].graph;

        // Issue #13646
        assert.strictEqual(
            chart.userOptions.plotOptions.pie.color,
            '#c0ffee',
            'The empty circle should be a user-specified color (#13646).'
        );

        // Issue #13229
        assert.ok(
            graph.pathArray,
            'Path should be drawn instead of a circle (#13229).'
        );
    }
);

QUnit.test('Updating point visibility (#8428)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        series: [
            {
                id: 'brands',
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: 'Chrome',
                        y: 61.41,
                        visible: false
                    },
                    {
                        name: 'Internet Explorer',
                        y: 11.84
                    },
                    {
                        name: 'Firefox',
                        y: 10.85
                    },
                    {
                        name: 'Edge',
                        y: 4.67
                    },
                    {
                        name: 'Safari',
                        y: 4.18
                    },
                    {
                        name: 'Sogou Explorer',
                        y: 1.64
                    },
                    {
                        name: 'Opera',
                        y: 1.6
                    },
                    {
                        name: 'QQ',
                        y: 1.2
                    },
                    {
                        name: 'Other',
                        y: 2.61
                    }
                ]
            }
        ]
    });

    var point = chart.series[0].points[0];

    function isHidden(element) {
        return (
            element === undefined ||
            element.element.getAttribute('visibility') === 'hidden'
        );
    }

    assert.ok(
        isHidden(point.graphic),
        'Hidden point should not have a graphic'
    );
    assert.ok(
        isHidden(point.dataLabel),
        'Hidden point should not have a data label'
    );

    point.update({
        visible: true
    });

    assert.ok(!isHidden(point.graphic), 'Hidden point should have a graphic');
    assert.ok(
        !isHidden(point.dataLabel),
        'Hidden point should have a data label'
    );

    point.update({
        visible: false
    });

    assert.ok(
        isHidden(point.graphic),
        'Hidden point should not have a graphic'
    );
    assert.ok(
        isHidden(point.dataLabel),
        'Hidden point should not have a data label'
    );
});

QUnit.test('#14246: ignoreHiddenPoint legend click', assert => {
    const chart = Highcharts.chart('container', {
        series: [
            {
                type: 'pie',
                data: [6, 3, 2, 4],
                showInLegend: true,
                ignoreHiddenPoint: false
            }
        ]
    });

    const point = chart.series[0].points[0];

    Highcharts.fireEvent(point.legendItem.label.element, 'click');
    assert.strictEqual(
        point.graphic.attr('visibility'),
        'hidden',
        'Point should be hidden'
    );
    assert.ok(
        chart.isInsidePlot(point.graphic.x, point.graphic.y),
        'Point graphic should be inside plot'
    );

    Highcharts.fireEvent(point.legendItem.label.element, 'click');
    assert.notStrictEqual(
        point.graphic.attr('visibility'),
        'hidden',
        'Point should be visible'
    );
    assert.ok(
        chart.isInsidePlot(point.graphic.x, point.graphic.y),
        'Point graphic should be inside plot'
    );
});

QUnit.test(
    'Colors must change after second update. (#14773)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                styledMode: true,
                type: 'pie'
            },
            series: [{
                data: [3]
            }]
        });

        const styleBefore = chart.series[0]
            .points[0]
            .graphic
            .element
            .attributes
            .class
            .value;

        chart.series[0].points[0].update({
            colorIndex: 5
        });

        chart.series[0].points[0].update({
            colorIndex: 0
        });

        const styleAfter = chart.series[0]
            .points[0]
            .graphic
            .element
            .attributes
            .class
            .value;

        assert.strictEqual(
            styleAfter,
            styleBefore,
            'Must be the same style after updating twice.'
        );
    }
);

QUnit.test('Pie chart initialized through the stockChart constructor and splitted tooltip, (#14773).',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            series: [{
                type: 'pie',
                data: [3]
            }]
        });
        chart.tooltip.refresh(chart.series[0].points[0]);
        assert.ok(
            true,
            `Hovering over the pie chart initialized through the stockChart
            constructor should not produce errors in the console.`
        );

        chart.addSeries({
            data: [2, 3, 5, 6]
        }, false);
        chart.update({
            navigator: {
                enabled: false
            },
            tooltip: {
                split: true
            }
        });
        chart.tooltip.refresh(chart.series[0].points[0]);
        chart.tooltip.refresh(chart.series[1].points[0]);
        chart.tooltip.refresh(chart.series[0].points[0]);
        assert.ok(
            true,
            `After hovering over two series where one of them should not have
            a splitter tooltip, while tooltip split explicitly set to true,
            there should be no errors in the console.`
        );
    }
);
