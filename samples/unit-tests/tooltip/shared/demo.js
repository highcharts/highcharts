QUnit.test('Shared tooltip with pointPlacement (#5832)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                kdNow: true
            }
        },

        series: [{
            data: [1, 1, 1],
            stack: 'a',
            pointPlacement: 0.06

        }, {
            data: [2, 2, 2],
            stack: 'test'

        }, {
            data: [3, 3, 3],
            stack: 'test'
        }, {
            data: [4, 4, 4],
            stack: 'other',
            pointPlacement: -0.06
        }, {
            data: [5, 5, 5],
            stack: 'other',
            pointPlacement: -0.06
        }]
    });

    var point = chart.series[0].points[0],
        offset = Highcharts.offset(chart.container);

    // Set hoverPoint
    point.onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: point.plotX + chart.plotLeft + offset.left,
        pageY: point.plotY + chart.plotTop + offset.top,
        target: chart.container
    });

    assert.strictEqual(
        chart.hoverPoints.length,
        5,
        'All series present'
    );

});