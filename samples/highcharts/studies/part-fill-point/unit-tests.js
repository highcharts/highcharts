var defaultChartConfig = {
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
        min: Date.UTC(2014, 11, 1),
        max: Date.UTC(2014, 11, 9)
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
};

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
    $('#container').highcharts(defaultChartConfig);

    chart = $('#container').highcharts();

    point = chart.series[0].points[0];
    shapeArgs = point.shapeArgs;
    partFillShape = point.partFillShape;
    partialFill = point.partialFill;

    assert.equal(
        partFillShape.y,
        shapeArgs.y + 1,
        'partFillShape y-position is calculated as shapeArgs y-position + 1'
    );

    assert.equal(
        partFillShape.height,
        shapeArgs.height - 2,
        'partFillShape height is calculated as shapeArgs height - 2'
    );

    assert.equal(
        partFillShape.x,
        shapeArgs.x,
        'partFillShape and shapeArgs have same calcuated x-position'
    );

    assert.equal(
        partFillShape.width,
        shapeArgs.width * partialFill,
        'partFillShape has correct calculated width'
    );
});

/**
 * Checks that the extra shape is rendered correctly.
 */
QUnit.test('drawPoints()', function (assert) {
    var chart,
        $graphic,
        $extraGraphic,
        origX,
        extraX,
        origY,
        extraY,
        origWidth,
        extraWidth,
        origHeight,
        extraHeight,
        partialFill;

    // THE CHART
    $('#container').highcharts(defaultChartConfig);

    chart = $('#container').highcharts();

    $graphic = $(chart.series[0].points[0].graphic.element);
    $extraGraphic = $(chart.series[0].points[0].partFillGraphic.element);
    origX = parseFloat($graphic.attr('x'));
    extraX = parseFloat($extraGraphic.attr('x'));
    origY = parseFloat($graphic.attr('y'));
    extraY = parseFloat($extraGraphic.attr('y'));
    origWidth = parseFloat($graphic.attr('width'));
    extraWidth = parseFloat($extraGraphic.attr('width'));
    origHeight = parseFloat($graphic.attr('height'));
    extraHeight = parseFloat($extraGraphic.attr('height'));
    partialFill = chart.series[0].points[0].partialFill;

    assert.equal(
        extraY,
        origY + 1,
        'partFillShape y-position is rendered as shapeArgs y-position + 1'
    );

    assert.equal(
        extraHeight,
        origHeight - 2,
        'partFillShape height is rendered as shapeArgs height - 2'
    );

    assert.equal(
        extraX,
        origX,
        'partFillShape and shapeArgs have same rendered x-position'
    );

    assert.equal(
        extraWidth,
        origWidth * partialFill,
        'partFillShape has correct rendered width'
    );
});
