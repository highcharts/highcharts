
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
        id: '2',
        labels: [{
            point: {
                x: 3,
                y: 125000,
                xAxis: 0,
                yAxis: 0
            }
        }]
    };

    chart.addAnnotation(secondAnnotationOptions, false);

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

    chart.addAnnotation(thirdAnnotationOptions, false);

    assert.ok(
        chart.options.annotations[0] === secondAnnotationOptions &&
        chart.options.annotations[1] === thirdAnnotationOptions &&
        chart.options.annotations.length === 2,
        'Annotation options from the chart options are added when the annotations are added (#8393).'
    );
});
