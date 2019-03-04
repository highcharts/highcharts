QUnit.test('Tooltip positioned correctly through the getPosition function.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            width: 400,
            height: 400
        },

        xAxis: {
            type: 'category'
        },
        tooltip: {
            animation: false,
            pointFormat: 'aaa aaa aaa aaa<br/> ' +
                'aaa aaa aaa aaa<br/> aaa aaa ' +
                'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                'aaa aaa aaa aaa<br/> aaa aaa ' +
                'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                'aaa aaa aaa aaa<br/> aaa aaa ' +
                'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                'aaa aaa aaa aaa<br/> aaa aaa ' +
                'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                'aaa aaa aaa aaa<br/> aaa aaa ' +
                'aaa aaa<br/> aaa aaa aaa aaa '
        },
        series: [{
            type: 'column',
            data: [2, 3, 5, 2, 5, 2]
        }]
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    assert.strictEqual(
        chart.tooltip.now.anchorY,
        Math.round(chart.series[0].points[0].plotY) + chart.plotTop,
        'Tooltip points to the middle of the top side of fist column (#7242)'
    );

    chart.series[0].setData([-2, -3, -5, -2, -5, -2]);

    chart.tooltip.refresh(chart.series[0].points[5]);

    assert.strictEqual(
        chart.tooltip.now.anchorY,
        Math.round(chart.series[0].points[5].plotY) + chart.plotTop,
        'Tooltip points to the middle of the top side of last column (#7242)'
    );

    // Add one point
    const x = chart.tooltip.label.translateX;
    chart.series[0].points[5].onMouseOver();

    chart.series[0].addPoint({
        x: 6,
        y: 1
    });
    assert.notEqual(
        chart.tooltip.label.translateX,
        x,
        'The tooltip should move with its point'
    );
});
// Highcharts v4.0.3, Issue #424
// Tooltip is positioned on the top series if multiple y axis is used.
QUnit.test('Wrong tooltip pos for column (#424)', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: [{
            height: '40%'
        }, {
            top: '50%',
            height: '50%',
            offset: 0
        }],
        tooltip: {
            hideDelay: 0
        },
        series: [{
            data: [1]
        }, {
            data: [5],
            yAxis: 1,
            type: 'column'
        }]
    });

    var controller = new TestController(chart),
        tooltipYPos = 0,
        linePoint = chart.series[0].points[0],
        lineXPos = linePoint.plotX,
        lineYPos = linePoint.plotY,
        columnPoint = chart.series[1].points[0],
        columnXPos = columnPoint.plotX,
        columnYPos = chart.series[1].group.translateY + columnPoint.plotY;

    controller.moveTo((lineXPos + 1), (lineYPos + 1));
    assert.ok(
        !chart.tooltip.isHidden,
        'Tooltip should be visible.'
    );
    tooltipYPos = chart.tooltip.label.translateY;
    assert.ok(
        tooltipYPos < lineYPos,
        "Tooltip of first series should be over first series"
    );
    controller.moveTo(0, 0);
    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should be hidden.'
    );
    controller.moveTo((columnXPos + 1), (columnYPos + 1));
    assert.ok(
        !chart.tooltip.isHidden,
        'Tooltip should be visible.'
    );
    tooltipYPos = chart.tooltip.label.translateY;
    assert.ok(
        (tooltipYPos < columnYPos) && (tooltipYPos > lineYPos),
        'Tooltip of second series should be over second series, but under first series'
    );
});