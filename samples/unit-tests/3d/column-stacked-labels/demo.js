QUnit.test('3D columns stackLabels render', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            type: 'column',
            renderTo: 'container',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 35
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            column: {
                animation: false,
                stacking: 'normal',
                dataLabels: {
                    allowOverlap: true,
                    enabled: true,
                    inside: false
                }
            }
        },
        series: [{
            data: [3, 3, 3],
            stack: 'female'
        }]
    });

    var series = chart.series[0],
        dataLabel = series.data[0].dataLabel,
        stackLabel = chart.yAxis[0].stacking.stacks[series.stackKey][0].label;

    dataLabel.x = dataLabel.translateX + dataLabel.element.getBBox().x;
    dataLabel.y = dataLabel.translateY + dataLabel.element.getBBox().y;
    stackLabel.x = stackLabel.translateX + stackLabel.element.getBBox().x;
    stackLabel.y = stackLabel.translateY + stackLabel.element.getBBox().y;

    assert.close(
        dataLabel.x,
        stackLabel.x,
        7, // Win.Firefox draws them 6 pixels apart
        'StackLabel x position is the same as datalabel x position'
    );

    assert.close(
        dataLabel.y,
        stackLabel.y,
        7,
        'StackLabel y position is the same as datalabel y position'
    );
});
