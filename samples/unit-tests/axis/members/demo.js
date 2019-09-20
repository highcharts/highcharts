// Skipped as #10161 was rolled back (broke with pointPlacement = on)
QUnit.test('setAxisTranslation', assert => {
    const { yAxis: [axis] } = Highcharts.chart('container', {
        yAxis: {
            type: 'category',
            categories: ['Category 1'],
            staticScale: 50
        },
        series: [{
            type: 'xrange',
            data: [{ x: 1, x2: 2, y: 0 }]
        }]
    });

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
        1,
        'should have pointRange equal 1 when min and max is 0 but axis has categories'
    );
    assert.strictEqual(
        axis.minPixelPadding,
        25,
        'should have minPixelPadding equal 25 when staticScale is 50 and minPointOffset is 0.5.'
    );
});

QUnit.test('setTickPositions', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'xrange',
            data: [{ x: 0, x2: 1, y: 0 }]
        }]
    });
    const axis = chart.yAxis[0];

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
    chart.update({
        yAxis: {
            type: 'category',
            categories: ['Category 1']
        }
    });
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