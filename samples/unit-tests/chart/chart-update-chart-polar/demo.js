/* eslint func-style:0 */


QUnit.test('Option chart.polar update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    });

    assert.ok(
        !chart.polar,
        'Initially not polar'
    );

    assert.ok(
        !chart.xAxis[0].isRadial,
        'Axis not radial'
    );

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('d') === null,
        'Columns not arced'
    );


    // Make polar
    chart.update({
        chart: {
            polar: true
        }
    });

    assert.ok(
        chart.polar,
        'Now polar'
    );

    assert.ok(
        chart.xAxis[0].isRadial,
        'Axis is radial'
    );

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A') > -1,
        'Columns are arced'
    );
    assert.ok(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[1]].gridLine.element.getAttribute('d').indexOf('A') > -1,
        'Grid lines are arced'
    );

    // Unmake polar
    chart.update({
        chart: {
            polar: false
        }
    });

    assert.ok(
        !chart.polar,
        'Not polar'
    );

    assert.ok(
        !chart.xAxis[0].isRadial,
        'Axis not radial'
    );

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('d') === null,
        'Columns not arced'
    );
    assert.ok(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[1]].gridLine.element.getAttribute('d').indexOf('A') === -1,
        'Grid lines not arced'
    );

});
