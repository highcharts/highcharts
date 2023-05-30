QUnit.test('Funnel selected state (#5156)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        plotOptions: {
            funnel: {
                allowPointSelect: true,
                states: {
                    select: {
                        color: 'red'
                    }
                }
            }
        },
        series: [
            {
                data: [
                    {
                        y: 1,
                        name: 'selected',
                        selected: true
                    },
                    2
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('fill'),
        'red',
        'Selected color is red'
    );
});

QUnit.test('Funnel size relative to center(#4738)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel',
            marginRight: 100,
            animation: false
        },
        title: {
            text: 'Sales funnel',
            x: -50
        },
        plotOptions: {
            series: {
                center: [110, 150],
                neckWidth: 50,
                neckHeight: 100,
                // reversed: true,
                // -- Other available options
                height: 200,
                width: 150
            }
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: 'Unique users',
                data: [
                    ['Website visits', 15654],
                    ['Downloads', 4064],
                    ['Requested price list', 1987],
                    ['Invoice sent', 976],
                    ['Finalized', 846]
                ]
            }
        ]
    });

    const series = chart.series[0];
    assert.equal(series.getWidthAt(250), 50, 'Bottom width');
    assert.equal(series.getWidthAt(150), 50, 'Center width');
    assert.equal(series.getWidthAt(50), 150, 'Top width');

    const initialY = series.points[0].plotY;
    series.addPoint({ name: 'Negative Point', y: -5000 });

    assert.equal(
        initialY,
        series.points[0].plotY,
        '#17514, Negative value should have no influence on the chart\'s layout.'
    );

});

QUnit.test('Visible funnel items', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel',
            marginRight: 100,
            width: 300
        },
        title: {
            text: 'Sales funnel',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: 'black',
                    softConnector: true
                },
                neckWidth: '30%',
                neckHeight: '25%'

                // -- Other available options
                // height: pixels or percent
                // width: pixels or percent
            }
        },
        legend: {
            enabled: true
        },
        series: [
            {
                name: 'Unique users',
                data: [
                    {
                        name: 'Website visits',
                        y: 15654,
                        visible: false
                    },
                    {
                        name: 'Downloads',
                        y: 4064
                    },
                    ['Requested price list', 1987],
                    ['Invoice sent', 976],
                    ['Finalized', 846]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('visibility'),
        'hidden',
        'No graphic for invisible point'
    );
});

QUnit.test('Funnel path', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        plotOptions: {
            series: {
                reversed: true
            }
        },
        series: [
            {
                name: 'Unique users',
                data: [
                    ['Website visits', 323],
                    ['Downloads', 1343],
                    ['Requested price list', 2287],
                    ['Invoice sent', 2784]
                ]
            }
        ]
    });

    const series = chart.series[0],
        points = series.points;

    assert.strictEqual(
        points[3].graphic.element
            .getAttribute('d')
            .split(' ')
            .filter(function (s) {
                return s !== 'L'; // Because Edge adds an L for each segment
            }).length,
        14,
        'The path should have the neck intact (#8277)'
    );

    series.update({
        borderRadius: 10
    });

    assert.strictEqual(
        points[0].graphic.d.split(' ').filter(s => s === 'C').length,
        2,
        'The first point should have 2 rounded corners, scope: stack (#18839)'
    );

    assert.strictEqual(
        points[1].graphic.d.split(' ').filter(s => s === 'C').length,
        0,
        'The second point should have 0 rounded corners, scope: stack (#18839)'
    );

    assert.strictEqual(
        points[3].graphic.d.split(' ').filter(s => s === 'C').length,
        4,
        'The last point should have 4 rounded corners, scope: stack (#18839)'
    );

    series.update({
        borderRadius: {
            radius: '1%',
            scope: 'point'
        }
    });

    assert.strictEqual(
        points[0].graphic.d.split(' ').filter(s => s === 'C').length,
        4,
        'The first point should have 4 rounded corners, scope: point (#18839)'
    );

    assert.strictEqual(
        points[1].graphic.d.split(' ').filter(s => s === 'C').length,
        4,
        'The second point should have 4 rounded corners, scope: point (#18839)'
    );

    assert.strictEqual(
        points[3].graphic.d.split(' ').filter(s => s === 'C').length,
        6,
        'The last point should have 6 rounded corners, scope: point (#18839)'
    );
});

QUnit.test('Funnel dataLabels', function (assert) {
    const data = [
        ['Website visits', 5654],
        ['Downloads', 4064],
        ['Requested price list', 1987],
        ['Invoice sent', 1976],
        ['Finalized', 4201]
    ];

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'funnel'
            },
            plotOptions: {
                series: {
                    center: ['50%', '50%'],
                    dataLabels: {
                        inside: true,
                        verticalAlign: 'middle'
                    },
                    reversed: false,
                    width: '50%'
                }
            },
            series: [
                {
                    name: 'Unique users',
                    data
                }
            ]
        }),
        series = chart.series[0],
        point = series.points[2],
        pointBBox = point.graphic.getBBox(),
        pointWidth,
        dataLabel;

    assert.strictEqual(
        Math.round(
            pointBBox.x + pointBBox.width / 2 - point.dataLabel.width / 2
        ),
        point.dataLabel.x,
        'DataLabels centered horizontally inside the funnel (#10036)'
    );

    series.update({
        dataLabels: {
            align: 'left'
        }
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(point.plotY);

    assert.strictEqual(
        Math.round(point.plotX - pointWidth / 2 + point.dataLabel.padding),
        point.dataLabel.x,
        'DataLabels inside the funnel and left aligned (#10036)'
    );

    series.update({
        center: ['58%', '47%'],
        reversed: true
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(2 * series.center[1] - point.plotY);

    assert.strictEqual(
        Math.round(point.plotX - pointWidth / 2 + point.dataLabel.padding),
        point.dataLabel.x,
        'DataLabels aligned correctly when funnel is reversed (#10036)'
    );

    series.update({
        dataLabels: {
            align: 'right'
        }
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(2 * series.center[1] - point.plotY);

    assert.strictEqual(
        Math.round(
            point.plotX +
                pointWidth / 2 -
                point.dataLabel.padding -
                point.dataLabel.width
        ),
        point.dataLabel.x,
        'DataLabels inside the funnel and right aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'bottom'
        }
    });

    point = series.points[2];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y +
                pointBBox.height +
                point.dataLabel.options.y -
                point.dataLabel.height
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and bottom aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'top'
        }
    });

    point = series.points[4];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y + point.dataLabel.padding + point.dataLabel.options.y
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and top aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'middle'
        }
    });

    point = series.points[1];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y + pointBBox.height / 2 - point.dataLabel.height / 2
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and centered vertically (#10036)'
    );

    chart.update({
        plotOptions: {
            series: {
                center: ['50%', '50%'],
                dataLabels: {
                    inside: false,
                    verticalAlign: 'bottom',
                    allowOverlap: false
                },
                reversed: false,
                width: '50%',
                showInLegend: true
            }
        },
        legend: {
            enabled: true
        }
    });

    Highcharts.fireEvent(chart.series[0].points[0].legendItem.group.element, 'click');
    Highcharts.fireEvent(chart.series[0].points[0].legendItem.group.element, 'click');
    Highcharts.fireEvent(chart.series[0].points[0].legendItem.group.element, 'click');

    dataLabel = chart.series[0].points[1].dataLabel;

    assert.notEqual(
        dataLabel.x,
        dataLabel.alignAttr.x,
        'DataLabels with allowOverlap set to false should be positioned correctly after point hide (#12350)'
    );

    chart.update({
        plotOptions: {
            series: {
                dataLabels: {
                    rotation: 1
                }
            }
        }
    });

    // Force dataLabel re-creation
    chart.series[0].setData(data, true, false, false);

    assert.ok(true, '#16176: No error should occur');
});
