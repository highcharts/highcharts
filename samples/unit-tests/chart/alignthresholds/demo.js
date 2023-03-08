QUnit.test('alignThresholds', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            alignThresholds: true,
            type: 'column'
        },
        yAxis: [
            {
                id: 'first',
                title: {
                    text: 'Primary Axis'
                },
                gridLineWidth: 0
            },
            {
                id: 'second',
                title: {
                    text: 'Secondary Axis'
                },
                opposite: true
            }
        ],
        series: [
            {
                data: [
                    29.9,
                    -71.5,
                    -106.4,
                    -129.2,
                    -144.0,
                    -176.0,
                    -135.6,
                    -148.5,
                    -216.4,
                    -194.1,
                    -95.6,
                    -54.4
                ],
                yAxis: 0
            },
            {
                data: [
                    129.9,
                    271.5,
                    306.4,
                    -29.2,
                    544.0,
                    376.0,
                    435.6,
                    348.5,
                    216.4,
                    294.1,
                    35.6,
                    354.4
                ],
                yAxis: 1
            }
        ]
    });

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Varied positive and negative data, thresholds should be aligned'
    );

    chart.series[0].setData([1001, 1002, 1003], false);
    chart.series[1].setData([-1001, -1002, -1003], false);
    chart.redraw();

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Data is nowhere near the threshold, thresholds should be aligned'
    );


    chart.series[0].setData([-1001, -1002, -1003], false);
    chart.series[1].setData([-101, -102, -103], false);
    chart.redraw();

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'All negative data, thresholds should be aligned'
    );


    chart.series[0].setData([1001, 1002, 1003], false);
    chart.series[1].setData([101, 102, 103], false);
    chart.redraw();

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'All positive data, thresholds should be aligned'
    );

    chart.addSeries({
        data: [-100, -200, -300]
    });

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Multi series, thresholds should be aligned'
    );

    chart.update({
        chart: {
            alignThresholds: false
        }
    });

    assert.notEqual(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Updated to alignThresholds: false, thresholds should not be aligned'
    );

    chart.update({
        chart: {
            alignThresholds: true
        }
    });

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Updated to alignThresholds: true, thresholds should be aligned'
    );

    chart.yAxis[0].update({
        reversed: true
    });

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'One reversed axis, thresholds should be aligned'
    );

    chart.yAxis[1].update({
        reversed: true
    });

    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Two reversed axes, thresholds should be aligned'
    );

    // Reset reversed and add another axis
    chart.update({
        yAxis: [{
            reversed: false
        }, {
            reversed: false
        }]
    });
    chart.addAxis({ id: 'third' }, false);
    chart.series[2].update({
        type: 'line',
        yAxis: 2
    });

    assert.notEqual(
        chart.yAxis[1].tickPositions.indexOf(0),
        chart.yAxis[2].tickPositions.indexOf(0),
        'One axis without threshold, thresholds should not (necessarily) be aligned'
    );

    chart.series[2].update({
        threshold: 0
    });
    chart.redraw();
    assert.equal(
        chart.yAxis[1].tickPositions.indexOf(0),
        chart.yAxis[2].tickPositions.indexOf(0),
        'All axes have thresholds, thresholds should be aligned'
    );

    chart.update({
        yAxis: [{
            height: '50%'
        }, {
            top: '50%',
            height: '50%'
        }, {
            height: '50%'
        }]
    });
    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[2].tickPositions.indexOf(0),
        'Panes, two axes in same pane, thresholds should be aligned'
    );
    assert.notEqual(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Panes, two axes of different pane, thresholds should not be aligned'
    );

    chart.series[2].remove(false);
    chart.update({
        chart: {
            animation: false
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                animation: false
            }
        },
        yAxis: [{
            height: void 0,
            top: void 0
        }, {
            top: void 0,
            height: void 0
        }]
    });

    const point1Box = chart.series[0].points[0].shapeArgs,
        point2Box = chart.series[1].points[0].shapeArgs;

    assert.strictEqual(
        point1Box.y + point1Box.height,
        point2Box.y + point2Box.height,
        '#17314: alignThresholds and stacking should place columns correctly.'
    );
});
