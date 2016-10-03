/**
 * Checks that the correct series types 'bar', 'column', 'columnrange', 'pie',
 * 'gauge' and 'solidgauge' are marked as supported.
 */
QUnit.test('supportsPartFill', function (assert) {
    var chart,
        supportedTypes = ['bar', 'column', 'columnrange'],
        someUnSupportedTypes = ['line', 'area', 'arearange', 'areaspline', 'bubble', 'funnel', 'pie', 'gauge', 'solidgauge'],
        type,
        i,
        chartOptions = {
            chart: {
                type: ''
            },
            series: [{
                data: [29.9, 71.5, 106.4]
            }]
        };

    // Check that each SUPPORTED series type is marked as supported
    for (i = 0; i < supportedTypes.length; i++) {
        type = supportedTypes[i];
        chartOptions.chart.type = type;
        $('#container').highcharts(chartOptions);
        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].supportsPartFill === true,
            true,
            'Series type "' + type + '" is marked as supported'
        );
    }

    // Check that each UNSUPPORTED series type is marked as unsupported
    for (i = 0; i < someUnSupportedTypes.length; i++) {
        type = someUnSupportedTypes[i];
        chartOptions.chart.type = type;
        $('#container').highcharts(chartOptions);
        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].supportsPartFill === true,
            false,
            'Series type "' + type + '" is not marked as supported'
        );
    }

});

/**
 * Checks that the extra shape is calculated correctly.
 */
QUnit.test('translate()', function (assert) {
    var chart,
        point,
        shapeArgs,
        partFillShape,
        partialFill;

    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Highcharts PartFillPoint'
        },
        series: [{
            data: [{
                x: 0,
                y: 107,
                partialFill: 0.25
            }, {
                x: 1,
                y: 31,
                partialFill: 0.5
            }, {
                x: 2,
                y: 635,
                partialFill: 0.75
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
        partFillShape.y - Math.abs(shapeArgs.height - (shapeArgs.height * partialFill)),
        'Original shapeArgs y-position was untouched'
    );

    assert.equal(
        shapeArgs.height,
        partFillShape.height / partialFill,
        'Original shapeArgs height was untouched'
    );

    assert.equal(
        partFillShape.y,
        shapeArgs.y + Math.abs(shapeArgs.height - (shapeArgs.height * partialFill)),
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

    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Highcharts PartFillPoint'
        },
        series: [{
            data: [{
                x: 0,
                y: 107,
                partialFill: 0.25
            }, {
                x: 1,
                y: 31,
                partialFill: 0.5
            }, {
                x: 2,
                y: 635,
                partialFill: 0.75
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
