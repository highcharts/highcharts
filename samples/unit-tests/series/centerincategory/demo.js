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
        "(centerInCategory: false) - point's width"
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
        "(centerInCategory: true) - point's width should be unchanged"
    );

    assert.ok(
        chart.series[1].points[2].shapeArgs.x + chart.plotLeft >
            chart.xAxis[0].ticks[2].mark.element.getBBox().x,
        'Point should be on the right side of the tick.'
    );

    chart.redraw();
    assert.strictEqual(
        Object.keys(chart.yAxis[0].stacking.stacks).length,
        1,
        '#14910: Group stack should not be removed on redraw'
    );

    /*
    chart.series[1].setData([
        [0, 2],
        [1, null],
        [1, 5],
        [1, null],
        [2, 1]
    ]);

    assert.notEqual(
        chart.xAxis[0].ticks[0].mark.element.getBBox().x -
            chart.series[1].points[0].shapeArgs.x,
        chart.xAxis[0].ticks[1].mark.element.getBBox().x -
            chart.series[1].points[2].shapeArgs.x,
        'Nulls and value with the same x coordinates should be handled properly.'
    );

    chart.series[0].update({
        xAxis: 1,
        yAxis: 1
    }, false);

    chart.series[1].update({
        xAxis: 1,
        yAxis: 1
    }, false);

    chart.xAxis[0].update({
        width: '50%'
    }, false);

    chart.xAxis[1].update({
        width: '50%',
        left: '50%',
        offset: 0
    }, false);

    chart.redraw();

    assert.ok(
        chart.plotLeft + chart.series[1].points[1].shapeArgs.x + chart.plotSizeX / 2 >
            chart.xAxis[1].ticks[1].mark.element.getBBox().x,
        'centerInCategory should work for multiple x-axes.'
    );

    chart.update({
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        }
    }, false);

    const thirdSeries = chart.series[2];

    thirdSeries.update({
        stack: 1
    }, false);

    chart.redraw();

    assert.ok(
        chart.yAxis[0].stacking.stacks[thirdSeries.stackKey][1].label.absoluteBox.x <
            chart.xAxis[0].ticks[1].mark.element.getBBox().x,
        'stackLabels placement'
    );
    */
});
