
QUnit.test('#7534: Annotations positioning with series cropThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            keys: ['y', 'id'],
            data: [[12, 'anno'], 0, 7, 0, 10, 1, 2, 14, 5, 11, 9, 9, 19, 6, 15, 18, 2, 3, 5, 17],
            cropTreshold: 1
        }],

        annotations: [{
            labels: [{
                point: 'anno'
            }]
        }]
    });

    chart.xAxis[0].setExtremes(5, 10, true, false);

    var annotationLabel = chart.annotations[0].labels[0];

    assert.strictEqual(
        annotationLabel.attr('y'),
        -9e9,
        'Label is placed outside of the chart'
    );

    assert.strictEqual(
        annotationLabel.placed,
        false,
        'Label.placed is set to false'
    );
});
