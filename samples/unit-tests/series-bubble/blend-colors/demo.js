QUnit.test('Bubble blendColors API option.', assert => {
    const chart = Highcharts.chart('container', {

        accessibility: {
            enabled: false
        },

        plotOptions: {
            bubble: {
                blendColors: ['#00ff00', '#ff0000', '#0000ff']
            }
        },

        series: [{
            type: 'bubble',
            data: [{
                x: 0,
                y: 0,
                z: 9
            }, {
                x: 50,
                y: 50,
                z: 6
            }, {
                x: 100,
                y: 100,
                z: 6
            }, {
                x: 150,
                y: 50,
                z: 3
            }],
            minSize: 50,
            maxSize: 150
        }]
    });

    let series = chart.series[0],
        points = series.points,
        blendColors = series.options.blendColors,
        colorsLength = blendColors.length;

    points.forEach(point => {
        assert.strictEqual(
            point.graphics.length,
            colorsLength,
            'The point should have a correct number of graphics.'
        );

        const firstGraphicWidth = point.graphics[0].attr('width');

        point.graphics.forEach((graphic, i) => {
            const graphicIndex = (colorsLength - i) / colorsLength;

            assert.strictEqual(
                graphic.attr('width'),
                Math.ceil(firstGraphicWidth * graphicIndex),
                `The graphic's size should be correct.`
            );

            assert.strictEqual(
                graphic.attr('zIndex'),
                i,
                `The graphic's zIndex should be correct.`
            );
        });
    });

    series.update({
        blendColors: [[0.7, '#0000ff'], [1, '#00ffff']]
    });

    blendColors = series.options.blendColors;
    colorsLength = blendColors.length;

    points.forEach(point => {
        assert.strictEqual(
            point.graphics.length,
            colorsLength,
            'The point should have a correct number of graphics.'
        );

        const firstGraphicWidth = point.graphics[0].attr('width');

        point.graphics.forEach((graphic, i) => {
            const colorStop = (blendColors.slice().reverse())[i][0];

            assert.strictEqual(
                graphic.attr('width'),
                Math.ceil(firstGraphicWidth * colorStop),
                `The graphic's size should be correct.`
            );

            assert.strictEqual(
                graphic.attr('zIndex'),
                i,
                `The graphic's zIndex should be correct.`
            );
        });
    });

    series.addPoint({
        x: -150,
        y: -150,
        z: 15
    });

    const addedPoint = series.points[series.points.length - 1];

    assert.strictEqual(
        addedPoint.graphics.length,
        2,
        'After addPoint(), the point should have a correct number of graphics.'
    );

    addedPoint.graphics.forEach(graphic => {
        assert.notStrictEqual(
            graphic.attr('visibility'),
            'hidden',
            'All graphics should be visible.'
        );
    });

    addedPoint.remove();

    assert.notOk(
        addedPoint.graphics,
        `After point.remove(), the point's graphics should be destroyed.`
    );

    series = chart.addSeries({
        type: 'bubble',
        data: [{
            x: 0,
            y: 0,
            z: 10
        }, {
            x: -50,
            y: -50,
            z: 5
        }]
    });

    points = series.points;
    blendColors = series.options.blendColors;
    colorsLength = blendColors.length;

    points.forEach(point => {
        assert.strictEqual(
            point.graphics.length,
            colorsLength,
            'The point should have a correct number of graphics.'
        );

        const firstGraphicWidth = point.graphics[0].attr('width');

        point.graphics.forEach((graphic, i) => {
            const graphicIndex = (colorsLength - i) / colorsLength;

            assert.strictEqual(
                graphic.attr('width'),
                Math.ceil(firstGraphicWidth * graphicIndex),
                `The graphic's size should be correct.`
            );

            assert.strictEqual(
                graphic.attr('zIndex'),
                i,
                `The graphic's zIndex should be correct.`
            );
        });
    });

    series.remove();

    assert.strictEqual(
        chart.series.length,
        1,
        `After series.remove(), there should be only one series.`
    );

});
