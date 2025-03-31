QUnit.test('Fixed tooltip', function (assert) {
    const chart = Highcharts.chart('container', {
        tooltip: {
            fixed: true
        },
        yAxis: [{
            height: '50%',
            offset: 0,
            lineWidth: 3,
            lineColor: Highcharts.getOptions().colors[0]
        }, {
            top: '50%',
            height: '50%',
            offset: 0,
            lineWidth: 3,
            lineColor: Highcharts.getOptions().colors[1]
        }],
        series: [{
            data: [1, 2, 3, 4, 5]
        }, {
            data: [5, 4, 3, 2, 1],
            yAxis: 1
        }]
    });

    const yOffset = chart.options.tooltip.position.y;
    const { series, tooltip, yAxis } = chart;

    tooltip.refresh([series[0].points[0]]);
    assert.strictEqual(
        tooltip.label.translateY,
        yAxis[0].pos + yOffset,
        'Relative to pane, first series, tooltip should be top-aligned'
    );

    tooltip.refresh([series[1].points[0]]);
    assert.strictEqual(
        tooltip.label.translateY,
        yAxis[1].pos + yOffset,
        'Relative to pane, second series, tooltip should be top-aligned'
    );

    chart.tooltip.update({
        position: {
            verticalAlign: 'bottom'
        }
    });

    tooltip.refresh([series[0].points[0]]);
    assert.close(
        tooltip.label.translateY,
        yAxis[0].pos + yAxis[0].len - tooltip.label.getBBox().height + yOffset,
        1,
        'Relative to pane, first series, tooltip should be bottom-aligned'
    );

    chart.tooltip.update({
        shared: true
    });

    tooltip.refresh([series[0].points[0], series[1].points[0]]);
    assert.close(
        tooltip.label.translateY,
        chart.plotTop + chart.plotHeight - tooltip.label.getBBox().height +
            yOffset,
        1,
        'Relative to pane, shared, tooltip should be bottom-aligned to plot'
    );

    chart.tooltip.update({
        shared: false,
        split: true
    });

    tooltip.refresh([series[0].points[0], series[1].points[0]]);

    assert.close(
        series[0].tt.translateY,
        yAxis[0].pos + yAxis[0].len - series[0].tt.getBBox().height + yOffset,
        2,
        'Relative to pane, split, tooltip should be bottom-aligned to pane'
    );


});