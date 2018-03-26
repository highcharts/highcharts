
QUnit.test('#7534: Annotations positioning with series cropThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            keys: ['y', 'id'],
            data: [[12, 'anno'], 0, 7, 0, 10, 1, 2, 14, 5, 11, 9, 9, 19, 6, 15, 18, 2, 3, 5, 17],
            cropTreshold: 1
        }, {
            keys: ['y', 'id'],
            data: [4, 0, 7, 0, [15, 'anno2'], 10, 1, 2, 14, 5, 11, 9, 9, 19, 6, 15, 18, 2, 3, 5, 17],
            marker: { enabled: false },
            cropTreshold: 1
        }],

        annotations: [{
            labels: [{
                point: 'anno'
            }]
        }, {
            labels: [{
                point: 'anno2',
                align: 'left',
                verticalAlign: 'top',
                x: 0,
                y: 0
            }]
        }]
    });


    var annotationLabel = chart.annotations[1].labels[0];
    var point = chart.get('anno2');

    assert.strictEqual(
        Math.round(annotationLabel.attr('y')),
        Math.round(point.plotY + point.series.group.translateY),
        'For series without marker - label is placed correctly - y coordinate'
    );

    assert.strictEqual(
        Math.round(annotationLabel.attr('x')),
        Math.round(point.plotX + point.series.group.translateX),
        'For series without marker - label is placed correctly - x coordinate'
    );

    assert.ok(
        annotationLabel.placed,
        'For series without markers - label.placed is set to true'
    );

    chart.xAxis[0].setExtremes(5, 10, true, false);

    annotationLabel = chart.annotations[0].labels[0];

    assert.strictEqual(
        annotationLabel.attr('y'),
        -9e9,
        'Label is placed outside of the chart'
    );

    assert.notOk(
        annotationLabel.placed,
        'Label.placed is set to false'
    );

    annotationLabel = chart.annotations[1].labels[0];

    assert.strictEqual(
        annotationLabel.attr('y'),
        -9e9,
        'For series without marker - Label is placed outside the chart'
    );

    assert.notOk(
        annotationLabel.placed,
        'For series without markers - label.placed is set to false'
    );

});
