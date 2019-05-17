QUnit.test('#3165 - Stack labels in waterfall series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        xAxis: {
            categories: ['0', '1', 'Intermediate Sum', '3', 'Sum']
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            waterfall: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [-10, -30, {
                isIntermediateSum: true
            }, -20, {
                isSum: true
            }]
        }, {
            data: [20, 10, {
                isIntermediateSum: true
            }, 10, {
                isSum: true
            }]
        }]
    });

    assert.strictEqual(
        chart.series[1].points[3].plotY >
            chart.yAxis[0].waterfallStacks.waterfall[3].label.alignAttr.y,
        true,
        'Stack label is positioned above the stack.'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                verticalAlign: 'bottom',
                y: 15
            }
        }
    });

    assert.strictEqual(
        chart.series[1].points[3].plotY <
            chart.yAxis[0].waterfallStacks.waterfall[3].label.alignAttr.y,
        true,
        'Stack label is positioned below the stack.'
    );

    chart.update({
        yAxis: {
            min: 50
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('y'),
        '0',
        'The y attribute is equal to 0.'
    );

    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('visibility'),
        'hidden',
        'Stack label is hidden.'
    );
});
