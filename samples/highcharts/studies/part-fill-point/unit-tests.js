/**
 * Checks that the extra shape is calculated correctly.
 */
QUnit.test('translate()', function (assert) {
    var chart,
        point,
        shapeArgs,
        partFillShape,
        partialFill;

        // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range study'
        },
        subtitle: {
            text: 'With partially filled points'
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(2014, 11, 3)
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderRadius: 5,
            pointWidth: 10,
            data: [{
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2014, 11, 2),
                partialFill: 0.25,
                y: 0
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                partialFill: 0.5,
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                partialFill: 0.75,
                y: 2
            }]
        }]
    });

    chart = $('#container').highcharts();

    point = chart.series[0].points[0];
    shapeArgs = point.shapeArgs;
    partFillShape = point.partFillShape;
    partialFill = point.partialFill;

    assert.equal(
        shapeArgs.y,
        partFillShape.y -
                Math.abs(shapeArgs.height - (shapeArgs.height * partialFill)),
        'Original shapeArgs y-position was untouched'
    );

    assert.equal(
        shapeArgs.height,
        partFillShape.height / partialFill,
        'Original shapeArgs height was untouched'
    );

    assert.equal(
        partFillShape.y,
        shapeArgs.y +
                Math.abs(shapeArgs.height - (shapeArgs.height * partialFill)),
        'Extra shape has correct calculated y-position'
    );

    assert.equal(
        partFillShape.height,
        shapeArgs.height * partialFill,
        'Extra shape has correct calculated height'
    );
});

/**
 * Checks that the extra shape is rendered correctly.
 */
QUnit.test('drawPoints()', function (assert) {
    var chart,
        $graphic,
        $extraGraphic,
        origY,
        origHeight,
        extraY,
        extraHeight,
        partialFill;

    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range study'
        },
        subtitle: {
            text: 'With partially filled points'
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(2014, 11, 3)
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderRadius: 5,
            pointWidth: 10,
            data: [{
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2014, 11, 2),
                partialFill: 0.25,
                y: 0
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                partialFill: 0.5,
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                partialFill: 0.75,
                y: 2
            }]
        }]
    });

    chart = $('#container').highcharts();

    $graphic = $(chart.series[0].points[0].graphic.element);
    $extraGraphic = $(chart.series[0].points[0].partFillGraphic.element);
    origY = parseFloat($graphic.attr('y'));
    origHeight = parseFloat($graphic.attr('height'));
    extraY = parseFloat($extraGraphic.attr('y'));
    extraHeight = parseFloat($extraGraphic.attr('height'));
    partialFill = chart.series[0].points[0].partialFill;

    assert.equal(
        origY,
        extraY - Math.abs(origHeight - (origHeight * partialFill)),
        'Original shape has correct rendered y-position'
    );

    assert.equal(
        origHeight,
        extraHeight / partialFill,
        'Original shape has correct rendered height'
    );

    assert.equal(
        extraY,
        origY + Math.abs(origHeight - (origHeight * partialFill)),
        'Extra shape has correct rendered y-position'
    );

    assert.equal(
        extraHeight,
        origHeight * partialFill,
        'Extra shape has correct rendered height'
    );
});
