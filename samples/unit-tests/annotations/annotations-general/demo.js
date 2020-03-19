QUnit.test('Annotations clipping', function (assert) {
    var chart = Highcharts.chart('container', {
        annotations: [{
            clip: false,
            labels: [{
                point: '1',
                text: 'label1',
                overflow: 'allow',
                y: 70
            }, {
                point: '2',
                text: 'label2'
            }]
        }],
        series: [{
            data: [{
                y: 29.9,
                id: '1'
            }, {
                y: 71.5,
                id: '2'
            }, 106.4, 129.2, 144.0]
        }]
    });

    assert.notOk(
        chart.annotations[0].clipRect,
        'Clip rect should not be set (#12897).'
    );

    chart.annotations[0].update({
        clip: true
    });

    assert.ok(
        chart.annotations[0].clipRect,
        'Clip rect should be set after update (#12897).'
    );
});
