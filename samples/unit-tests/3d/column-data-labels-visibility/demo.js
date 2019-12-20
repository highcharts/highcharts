QUnit.test('3D columns dataLabels initial visibility', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            animation: false,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        },
        series: [{
            dataLabels: {
                enabled: true
            },
            data: [{
                x: 1,
                y: 5
            }, {
                x: 2,
                y: 10
            }, {
                x: 3,
                y: 10
            }]
        }]
    });
    const points = chart.series[0].points;
    let dataLabel = points[0].dataLabel;

    assert.strictEqual(
        chart.series[0].dataLabelsGroup.element.children.length > 0,
        true,
        'Series dataLabels are visible'
    );

    assert.close(
        dataLabel.x + dataLabel.width / 2,
        points[0].pos3d.x,
        4,
        'dataLabel is in proper x position'
    );
    assert.close(
        dataLabel.y + dataLabel.height,
        points[0].pos3d.y,
        4,
        'dataLabel is in proper y position'
    );

    dataLabel = points[1].dataLabel;
    assert.close(
        dataLabel.x + dataLabel.width / 2,
        points[1].pos3d.x,
        4,
        'dataLabel is in proper x position'
    );
    assert.close(
        dataLabel.y + dataLabel.height,
        points[1].pos3d.y,
        4,
        'dataLabel is in proper y position'
    );


    chart.update({
        chart: {
            options3d: {
                enabled: true,
                alpha: 180,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        }
    });

    dataLabel = points[0].dataLabel;
    assert.close(
        dataLabel.x + dataLabel.width / 2,
        points[0].pos3d.x,
        4,
        'dataLabel is in proper x position'
    );
    assert.close(
        dataLabel.y + dataLabel.height,
        points[0].pos3d.y,
        4,
        'dataLabel is in proper y position'
    );

    dataLabel = points[1].dataLabel;
    assert.close(
        dataLabel.x + dataLabel.width / 2,
        points[1].pos3d.x,
        4,
        'dataLabel is in proper x position'
    );
    assert.close(
        dataLabel.y + dataLabel.height,
        points[1].pos3d.y,
        4,
        'dataLabel is in proper y position'
    );

    chart.update({
        chart: {
            inverted: true,
            options3d: {
                enabled: true,
                alpha: 180,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        }
    });

    dataLabel = points[0].dataLabel;
    assert.close(
        dataLabel.x + dataLabel.padding / 2,
        points[0].pos3d.x,
        4,
        'dataLabel is in proper x position in inverted graph'
    );
    assert.close(
        dataLabel.y + dataLabel.absoluteBox.height / 2,
        points[0].series.xAxis.height - points[0].pos3d.y,
        4,
        'dataLabel is in proper y position in inverted graph'
    );
    dataLabel = points[1].dataLabel;
    assert.close(
        dataLabel.x + dataLabel.padding / 2,
        points[1].pos3d.x,
        4,
        'dataLabel is in proper x position in inverted graph'
    );
    assert.close(
        dataLabel.y + dataLabel.absoluteBox.height / 2,
        points[1].series.xAxis.height - points[1].pos3d.y,
        4,
        'dataLabel is in proper y position in inverted graph'
    );

    chart.update({
        chart: {
            inverted: true,
            options3d: {
                enabled: true,
                alpha: 180,
                beta: 180,
                depth: 300,
                viewDistance: 5
            }
        }
    });
});