// 1
QUnit.test('#13664 - annotation measure on yAxis', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            labels: {
                distance: 8
            }
        },
        yAxis: [
            {
                height: '50%'
            },
            {
                min: 3,
                top: '50%',
                height: '50%'
            }
        ],
        annotations: [
            {
                type: 'measure',
                typeOptions: {
                    selectType: 'x',
                    yAxis: 1,
                    xAxis: 0,
                    point: {
                        x: 5,
                        y: 10
                    },
                    background: {
                        width: 300 + 'px',
                        height: 150 + 'px'
                    }
                }
            }
        ],

        series: [{
            data: [1, 2, 3, 2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3]
        }, {
            yAxis: 1,
            data: [6, 7, 8, 3, 2, 4, 4, 4, 4, 3, 3, 2, 4, 4, 4, 4, 3]
        }]
    });

    var controller = new TestController(chart);

    let bbox = chart.annotations[0].shapesGroup.getBBox();
    assert.ok(
        bbox.y === chart.yAxis[1].top,
        'Annotation measure should be visible on vary yaxis (#13664).'
    );

    assert.close(
        bbox.y,
        chart.annotations[0].labels[0].graphic.anchorY,
        0.5,
        `Annotation's label's Y position should be
        close to the Y position of the annotation.`
    );

    assert.close(
        bbox.x,
        chart.annotations[0].labels[0].graphic.anchorX,
        0.5,
        `Annotation's label's X position should
        be close to the X position of the annotation.`
    );

    chart.update({
        chart: {
            spacingTop: 100
        },
        title: {
            text: ''
        }
    });

    bbox = chart.annotations[0].shapesGroup.getBBox();

    assert.close(
        bbox.y,
        chart.annotations[0].labels[0].graphic.anchorY,
        0.5,
        `Annotation's label's Y position should be close
        to the Y position of the annotation after updates.`
    );

    assert.close(
        bbox.x,
        chart.annotations[0].labels[0].graphic.anchorX,
        0.5,
        `Annotation's label's X position should be close
        to the X position of the annotation after updates.`
    );

    const axisMiddlePos = chart.yAxis[1].top + chart.yAxis[1].height / 2,
        { y, height } = chart.annotations[0].controlPoints[0].graphic.getBBox(),
        controlPointYPos = y + height / 2;

    assert.equal(
        Math.round(controlPointYPos),
        Math.round(axisMiddlePos),
        `Annotation's control points should be positioned in the middle of yAxis
        #17995`
    );

    bbox = chart.annotations[0].shapesGroup.getBBox();

    // drag the annotation to the left
    controller.mouseDown(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    controller.mouseMove(bbox.x - 50, bbox.y);
    controller.mouseUp();

    bbox = chart.annotations[0].shapesGroup.getBBox();

    chart.annotations[0].update({
        typeOptions: {
            label: {
                style: {
                    color: 'red'
                }
            }
        }
    });

    assert.equal(
        bbox.x,
        chart.annotations[0].shapesGroup.getBBox().x,
        'The annotation should stay in the same place after update, #19121.'
    );
});
