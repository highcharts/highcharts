QUnit.test('series.centerInCategory', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        xAxis: [{}, {}],

        yAxis: [
            {},
            {
                opposite: true,
                title: null
            }
        ],

        series: [
            {
                name: 'Tokyo',
                data: [
                    [0, 2],
                    [1, 3],
                    [2, 2],
                    [3, null]
                ]
            },
            {
                name: 'Warsaw',
                data: [
                    [0, 2],
                    [1, 5],
                    [2, 1]
                ]
            },
            {
                name: 'Madrid',
                data: [
                    [0, null],
                    [1, 3]
                ]
            },
            {
                name: 'Another',
                data: [
                    [0, 1],
                    [1, 2],
                    [3, 4]
                ]
            },
            {
                name: 'Test',
                data: [
                    [0, 1],
                    [1, 2],
                    [3, 4]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        13,
        '(centerInCategory: false) - point\'s width'
    );

    chart.update({
        plotOptions: {
            series: {
                centerInCategory: true
            }
        }
    });

    assert.strictEqual(
        chart.series[3].points[0].shapeArgs.width,
        13,
        '(centerInCategory: true) - point\'s width should be unchanged'
    );

    assert.ok(
        chart.series[1].points[2].shapeArgs.x + chart.plotLeft >
            chart.xAxis[0].ticks[2].mark.element.getBBox().x,
        'Point should be on the right side of the tick.'
    );

    chart.redraw();
    /* No longer relevant after refactoring to xAxis-based stacks for
        centerInCategory
    assert.strictEqual(
        Object.keys(chart.yAxis[0].stacking.stacks).length,
        1,
        '#14910: Group stack should not be removed on redraw'
    );
    */

    chart.update({
        chart: {
            inverted: true
        }
    });

    let point = chart.series[0].points[0];

    const tooltipY = chart.plotHeight - point.tooltipPos[1];
    assert.ok(
        tooltipY > point.shapeArgs.x &&
            tooltipY < point.shapeArgs.x + point.shapeArgs.width,
        '#15217: Tooltip should be positioned on top of the bar'
    );


    chart.update({
        chart: {
            inverted: false
        },
        series: chart.series.map((s, i) => ({
            stacking: 'normal',
            stack: i <= 1 ? 'stack1' : 'stack2',
            data: s.data
        }))
    });

    assert.notEqual(
        chart.series[0].points[0].shapeArgs.y,
        chart.series[1].points[0].shapeArgs.y,
        '#14980: Toggling stacking with centerInCategory enabled should work'
    );

    chart.update({
        chart: {
            type: 'columnrange'
        },
        series: [
            {
                name: 'Tokyo',
                data: [2, null, 2, null]
            },
            {
                name: 'Warsaw',
                data: [2, [3, 5], 1]
            },
            {
                name: 'Madrid',
                data: [null, 3]
            },
            {
                name: 'Another',
                data: [1, 2, 4, [2, 6]]
            },
            {
                name: 'Test',
                data: [1, null, 4]
            }
        ]
    });

    point = chart.series[3].points[3];
    let tickX = chart.xAxis[0].ticks[3].mark.element.getBBox().x;
    assert.ok(
        chart.plotLeft + point.shapeArgs.x < tickX &&
            chart.plotLeft + point.shapeArgs.x + point.shapeArgs.width > tickX,
        '#15045: Point should be centered on the tick'
    );

    chart.update({
        chart: {
            type: 'columnpyramid'
        },
        series: [{
            data: [
                [0, 2],
                [1, 1],
                [2, 2]
            ]
        }, {
            data: [
                [0, 2],
                [1, null],
                [2, 3]
            ]
        }, {
            data: [
                [0, 2],
                [1, 2]
            ]
        }, {
            data: [
                [0, 2],
                [1, 1]
            ]
        }]
    }, true, true);

    point = chart.series[2].points[1];
    tickX = chart.xAxis[0].ticks[1].mark.element.getBBox().x;

    const pointBBox = point.graphic.element.getBBox();

    assert.ok(
        chart.plotLeft + pointBBox.x < tickX &&
            chart.plotLeft + pointBBox.x + pointBBox.width > tickX,
        '#19127: Point should be centered on the tick if series is columnpyramid.'
    );

    chart.update({
        chart: {
            type: 'column'
        },
        series: [{
            data: [
                [0, 2],
                [0, 1],
                [1, 2]
            ]
        }, {
            data: [
                [0, null],
                [1, 2]
            ]
        }]
    }, true, true);

    point = chart.series[0].points[0];
    tickX = chart.xAxis[0].ticks[0].mark.element.getBBox().x;
    assert.ok(
        chart.plotLeft + point.shapeArgs.x < tickX &&
            chart.plotLeft + point.shapeArgs.x + point.shapeArgs.width > tickX,
        '#17610: Point should be centered on the tick.'
    );

    chart.update({
        series: [{
            data: [
                [0, 10],
                [0, 5],
                [1, 5]
            ]
        }, {
            data: [
                [0, 10],
                [0, 5],
                [0, 5],
                [0, 5],
                [0, 5],
                [1, 5]
            ]
        }]
    }, true, true);

    const series = chart.series[0];

    assert.close(
        chart.xAxis[0].ticks[0].mark.element.getBBox().x -
            series.points[0].shapeArgs.x,
        chart.xAxis[0].ticks[1].mark.element.getBBox().x -
            series.points[2].shapeArgs.x,
        2,
        '#17610: Point should have correct offset.'
    );


    chart.xAxis[1].remove();
    chart.addAxis({
        opposite: true
    }, false);
    chart.update({
        series: [{
            data: [
                [0, 1],
                [1, 2],
                [2, 3]
            ]
        }, {
            data: [
                [0, 1],
                [1, null],
                [2, 3]
            ],
            yAxis: 1
        }, {
            data: [
                [0, 1],
                [1, 2],
                [2, 3]
            ],
            yAxis: 1
        }]
    }, true, true);

    assert.close(
        chart.series[1].points[0].graphic.getBBox().x -
            chart.series[0].points[0].graphic.getBBox().x,
        chart.series[2].points[0].graphic.getBBox().x -
            chart.series[1].points[0].graphic.getBBox().x,
        2,
        '#17764: Points should be evenly spaced within category'
    );

    assert.close(
        chart.series[1].points[0].graphic.getBBox().x -
            chart.series[0].points[0].graphic.getBBox().x,
        chart.series[2].points[1].graphic.getBBox().x -
            chart.series[0].points[1].graphic.getBBox().x,
        2,
        '#17764: Points should be evenly spaced, null point between'
    );
});
