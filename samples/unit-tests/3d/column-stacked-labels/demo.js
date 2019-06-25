QUnit.test("JS error when stack ID's are strings in Highcharts 3D.(#4532)", function (assert) {
    var chart = $('#container').highcharts({
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 6,
                beta: 15,
                viewDistance: 0,
                depth: 40
            }
        },
        series: [{
            data: [5, 10],
            stack: "m1"
        }, {
            data: [2, 4],
            stack: "m1"
        }]
    }).highcharts();


    assert.strictEqual(
        chart.series[0].points && chart.series[0].points.length === 2,
        true,
        'No error.'
    );

});

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

    var dataLabel = chart.series[0].data[0].dataLabel,
        stackLabel = chart.yAxis[0].stacks.columnfemale[0].label;

    dataLabel.x = dataLabel.translateX + dataLabel.element.getBBox().x;
    dataLabel.y = dataLabel.translateY + dataLabel.element.getBBox().y;
    stackLabel = stackLabel.element.getBBox();

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
