QUnit.test('General waterfall tests', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        series: [{
            minPointLength: 20,
            data: [5, 0.0001, null, 10, -0.0001, null, 0.0001, null, 5, { isSum: true }]
        }]
    });

    assert.ok(
        chart.series[0].points[chart.series[0].points.length - 1].shapeArgs.y,
        chart.yAxis[0].toPixels(20.0001),
        'MinPointLength doesn\'t influence data rendering (#6062).'
    );

    chart.series[0].update({
        data: [{
            y: null
        }],
        stacking: 'normal'
    });

    assert.ok(1, 'No errors when stacking null points (#7667).');


    chart.series[0].update({
        data: [-20, 10, {
            isIntermediateSum: true
        }]
    }, false);
    chart.addSeries({
        stacking: 'normal',
        data: [-20, 50, {
            isIntermediateSum: true
        }]
    });

    assert.ok(1, 'No errors when stacking starts from negative value (#2280)');


    chart.update({
        series: [{
            dataLabels: {
                enabled: true,
                inside: false
            },
            data: [-5.8, -5.3, -4, -2.7, -6.9]
        }]
    }, true, true);

    assert.ok(
        chart.series[0].points[0].dataLabel.attr('y') >=
            chart.series[0].points[0].plotY +
            chart.series[0].points[0].shapeArgs.height,
        'Label rendered below the point.'
    );
});