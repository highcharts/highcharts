QUnit.test('Annotation\'s dynamic methods', function (assert) {
    var labelCollector;
    var chart = Highcharts.chart('container', {
        chart: {
            events: {
                load: function () {
                    labelCollector = this.annotations[0].labelCollector;
                }
            }
        },

        series: [{
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }],

        annotations: [{
            id: '1',
            labels: [{
                point: {
                    x: 2,
                    y: 100000,
                    xAxis: 0,
                    yAxis: 0
                }
            }]
        }]
    }, function (chart) {
        var annotation = chart.addAnnotation({});

        assert.ok(
            true,
            'No errors after adding an annotation in callback (#10628).'
        );

        chart.removeAnnotation(annotation);
    });

    assert.strictEqual(
        chart.options.annotations.length,
        1,
        'Annotation options are correctly added to chart options'
    );

    chart.removeAnnotation('1');

    assert.strictEqual(
        chart.labelCollectors.indexOf(labelCollector),
        -1,
        'Annotation label collector is not kept in the chart\'s label collectors (#7677).'
    );

    assert.strictEqual(
        chart.options.annotations.length,
        0,
        'Annotation options from the chart options are erased when the annotation is removed (#8393).'
    );

    var secondAnnotationOptions = {
        id: 2,
        labels: [{
            point: {
                x: 3,
                y: 125000,
                xAxis: 0,
                yAxis: 0
            }
        }]
    };

    var secondAnnotation = chart.addAnnotation(secondAnnotationOptions);

    var thirdAnnotationOptions = {
        id: '3',
        labels: [{
            point: {
                x: 4,
                y: 125000,
                xAxis: 0,
                yAxis: 0
            }
        }]
    };

    var thirdAnnotation = chart.addAnnotation(thirdAnnotationOptions);

    assert.ok(
        chart.options.annotations[0] === secondAnnotation.options &&
        chart.options.annotations[1] === thirdAnnotation.options &&
        chart.options.annotations.length === 2,
        'Annotation options from the chart options are added when the annotations are added (#8393).'
    );

    thirdAnnotation.update({
        labelOptions: {
            format: 'custom format',
            backgroundColor: 'red'
        }
    });

    assert.strictEqual(
        thirdAnnotation.labels[0].options.format,
        'custom format',
        'Correct annotations text after update (annotations.labels)'
    );

    thirdAnnotation.update({
        labelOptions: {
            backgroundColor: 'green'
        }
    });

    assert.strictEqual(
        thirdAnnotation.labels[0].graphic.attr('fill'),
        'green',
        'Correct annotations label fill after update (annotations.labels)'
    );

    var annotation = chart.addAnnotation({
        shapes: [{
            type: 'circle',
            point: {
                x: 4,
                y: 123000,
                xAxis: 0,
                yAxis: 0
            },
            r: 5
        }]
    });

    annotation.update({
        shapes: [{
            r: 25
        }]
    });

    assert.strictEqual(
        annotation.shapes[0].graphic.attr('r'),
        25,
        'Correct annotation size after update (annotations.shapes)'
    );

    chart.removeAnnotation(2);

    assert.strictEqual(
        chart.annotations.length,
        2,
        'Annotation with id=number, should be removed without errors (#10648)'
    );
});

QUnit.test('Hiding and showing annotations with linked points', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            showInLegend: true,
            data: [{
                id: 'point1',
                visible: false,
                y: 3
            }, {
                y: 3
            }],
            type: 'pie'
        }],
        annotations: [{
            labels: [{
                point: 'point1',
                text: 'Annotation'
            }]
        }]
    });

    assert.strictEqual(
        chart.annotations[0].labels[0].graphic.visibility,
        'hidden',
        'Annotation correctly hidden.'
    );
});
