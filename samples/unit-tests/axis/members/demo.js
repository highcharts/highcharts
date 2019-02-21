QUnit.test('setAxisTranslation', assert => {
    const { Axis } = Highcharts;
    const chart = {
        axes: [],
        xAxis: [{}],
        yAxis: []
    };
    const axis = new Axis(chart, {
        categories: ['Test'],
        isX: false,
        max: 0,
        min: 0
    });

    axis.staticScale = 50;
    axis.setAxisTranslation();

    assert.strictEqual(
        axis.minPointOffset,
        0.5,
        'should have minPointOffset equal 0.5 when type is "category".'
    );
    assert.strictEqual(
        axis.pointRangePadding,
        1,
        'should have pointRangePadding equal 1 when type is "category".'
    );
    assert.strictEqual(
        axis.pointRange,
        0,
        'should have pointRange equal 0 when min and max is 0.'
    );
    assert.strictEqual(
        axis.minPixelPadding,
        25,
        'should have minPixelPadding equal 25 when staticScale is 50 and minPointOffset is 0.5.'
    );
});

QUnit.test('setTickPositions', assert => {
    const { Axis } = Highcharts;
    const axis = Object.assign({}, Axis.prototype, {
        options: {
            tickPositions: ['Test']
        },
        min: 0,
        max: 0
    });

    axis.setTickPositions();
    assert.strictEqual(
        axis.max,
        0.5,
        'should have max equal 0.5 when only 1 point and tickPositions.length < 2.'
    );
    assert.strictEqual(
        axis.min,
        -0.5,
        'should have min equal -0.5 when only 1 point and tickPositions.length < 2.'
    );

    /**
     * Should not modify min and max when axis type is category.
     */
    axis.hasNames = true;
    axis.min = axis.max = 0;
    axis.setTickPositions();
    assert.strictEqual(
        axis.max,
        0,
        'should have min equal 0 when only 1 point, tickPositions.length < 2, and hasNames is true.'
    );
    assert.strictEqual(
        axis.min,
        0,
        'should have max equal 0 when only 1 point, tickPositions.length < 2, and hasNames is true..'
    );
});