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
        i,
        point,
        points,
        shapeArgs,
        partShapeArgs,
        partialFill;

        // THE CHART
    $('#container').highcharts(defaultChartConfig);

    chart = $('#container').highcharts();

    points = chart.series[0].points;
    for (i = 0; i < points.length; i++) {
        point = points[i];
        shapeArgs = point.shapeArgs;
        partShapeArgs = point.partShapeArgs;
        partialFill = point.partialFill;

        assert.equal(
            partShapeArgs.y,
            shapeArgs.y + 1,
            'point ' + i + ' partShapeArgs y-position is correctly calculated'
        );

        assert.equal(
            partShapeArgs.height,
            shapeArgs.height - 2,
            'point ' + i + ' partShapeArgs height is correctly calculated'
        );

        assert.equal(
            partShapeArgs.x,
            shapeArgs.x,
            'point ' + i + ' partShapeArgs has correct calulated x-position'
        );

        assert.equal(
            partShapeArgs.width,
            shapeArgs.width * partialFill,
            'point ' + i + ' partShapeArgs has correct calculated width'
        );
    }
});

/**
 * Checks that the extra shape is rendered correctly.
 */
QUnit.test('drawPoints()', function (assert) {
    var chart,
        i,
        points,
        point,
        $graphic,
        $graphOrig,
        $graphOver,
        origX,
        overX,
        origY,
        overY,
        origWidth,
        overWidth,
        origHeight,
        overHeight,
        partialFill;

    // THE CHART
    chart = Highcharts.chart('container', defaultChartConfig);

    points = chart.series[0].points;
    for (i = 0; i < points.length; i++) {
        point = points[i];
        $graphic = $(point.graphic.element);
        $graphOrig = $($graphic.find('.highcharts-partfill-original'));
        $graphOver = $($graphic.find('.highcharts-partfill-overlay'));
        origX = parseFloat($graphOrig.attr('x'));
        overX = parseFloat($graphOver.attr('x'));
        origY = parseFloat($graphOrig.attr('y'));
        overY = parseFloat($graphOver.attr('y'));
        origWidth = parseFloat($graphOrig.attr('width'));
        overWidth = parseFloat($graphOver.attr('width'));
        origHeight = parseFloat($graphOrig.attr('height'));
        overHeight = parseFloat($graphOver.attr('height'));
        partialFill = point.partialFill;

        assert.equal(
            overY,
            origY + 1,
            'point ' + i + ' partShapeArgs y-position is rendered correctly'
        );

        assert.equal(
            overHeight,
            origHeight - 2,
            'point ' + i + ' partShapeArgs height is rendered correctly'
        );

        assert.equal(
            overX,
            origX,
            'point ' + i + ' partShapeArgs has correct rendered x-position'
        );

        assert.equal(
            overWidth,
            origWidth * partialFill,
            'point ' + i + ' partShapeArgs has correct rendered width'
        );
    }
});

/**
 * Checks that the fill option in a point's partialFill options is applied
 */
QUnit.test('point fill option is applied in drawPoints()', function (assert) {
    var chart,
        $graphic,
        expected = "#fa0",
        actual;

    defaultChartConfig.series[0].data[0].partialFill = {
        amount: 0.25,
        fill: expected
    };
    chart = Highcharts.chart('container', defaultChartConfig);
    $graphic = $(chart.series[0].data[0].graphic.element);
    actual = $graphic.find('.highcharts-partfill-overlay').attr('fill');
    assert.equal(
        actual,
        expected,
        'fill in point.partialFill options is applied'
    );
});

/**
 * Checks that the fill option in a series' partialFill options is applied
 */
QUnit.test('series fill option is applied in drawPoints()', function (assert) {
    var chart,
        $graphic,
        expected = "#000",
        actual;

    defaultChartConfig.series[0].partialFill = {
        amount: 0.25,
        fill: expected
    };
    chart = Highcharts.chart('container', defaultChartConfig);
    $graphic = $(chart.series[0].data[0].graphic.element);
    actual = $graphic.find('.highcharts-partfill-overlay').attr('fill');
    assert.equal(
        actual,
        expected,
        'fill in point.partialFill options is applied'
    );
});
