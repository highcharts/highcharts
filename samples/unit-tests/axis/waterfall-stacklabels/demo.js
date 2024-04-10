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
                enabled: true,
                padding: 0
            }
        },
        plotOptions: {
            waterfall: {
                stacking: 'normal'
            }
        },
        series: [
            {
                data: [
                    -10,
                    -30,
                    {
                        isIntermediateSum: true
                    },
                    -20,
                    {
                        isSum: true
                    }
                ]
            },
            {
                data: [
                    20,
                    10,
                    {
                        isIntermediateSum: true
                    },
                    10,
                    {
                        isSum: true
                    }
                ]
            }
        ]
    });

    var series = chart.series,
        yAxis = chart.yAxis[0];

    assert.strictEqual(
        series[1].points[3].plotY >
            yAxis.waterfall.stacks[series[0].stackKey][3].label.alignAttr.y,
        true,
        'Stack label should be positioned above the stack.'
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
        series[1].points[3].plotY <
            yAxis.waterfall.stacks[series[0].stackKey][3].label.alignAttr.y,
        true,
        'Stack label should be positioned below the stack.'
    );

    chart.update({
        yAxis: {
            min: 50
        }
    });

    assert.close(
        chart.container.querySelector('.highcharts-stack-labels text').getBBox()
            .y,
        0,
        2,
        'The y attribute should be close to 0'
    );

    assert.strictEqual(
        chart.container
            .querySelector('.highcharts-label.highcharts-stack-labels')
            .getAttribute('visibility'),
        'hidden',
        'Stack label is hidden.'
    );
});
