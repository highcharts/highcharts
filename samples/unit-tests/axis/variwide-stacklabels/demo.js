QUnit.test('#10962 - Stack labels in variwide series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'variwide'
        },
        title: {
            text: 'Stack labels in variwide chart'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                data: [
                    [0, 50, 135504],
                    [1, 42, 277339],
                    [2, 32, 421611],
                    [3, 38, 462057],
                    [4, 35, 902885],
                    [5, 34, 1702641]
                ]
            },
            {
                data: [
                    [0, 47, 135504],
                    [1, 61, 277339],
                    [2, 92, 421611],
                    [3, 76, 462057],
                    [4, 99, 902885],
                    [5, 82, 1702641]
                ]
            }
        ]
    });

    var series = chart.series,
        yAxis = chart.yAxis[0];

    assert.close(
        yAxis.stacking.stacks[series[0].stackKey][4].label.alignAttr.x,
        series[0].points[4].dataLabel.alignAttr.x,
        5,
        'The stack labels should be x-positioned close to the data label.'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                align: 'left'
            }
        }
    });

    assert.strictEqual(
        series[0].points[4].plotX >
            yAxis.stacking.stacks[series[0].stackKey][4].label.alignAttr.x,
        true,
        'The stack label should be positioned before the 4th point\'s center.'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                align: 'right'
            }
        }
    });

    assert.strictEqual(
        series[0].points[4].plotX <
            yAxis.stacking.stacks[series[0].stackKey][4].label.alignAttr.x,
        true,
        'The stack label should be positioned after the 4th point\'s center.'
    );

    chart.update({
        xAxis: {
            min: 6
        }
    });

    assert.strictEqual(
        chart.container
            .querySelector('.highcharts-label.highcharts-stack-labels')
            .getAttribute('visibility'),
        'hidden',
        'Stack label is hidden.'
    );
});
