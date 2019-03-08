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
