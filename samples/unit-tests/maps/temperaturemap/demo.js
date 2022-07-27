QUnit.test('Temperaturemap API options.', assert => {
    const chart = Highcharts.mapChart('container', {

        accessibility: {
            enabled: false
        },

        series: [{
            type: 'temperaturemap',
            data: [{
                lat: 0,
                lon: 0,
                z: 9
            }, {
                lat: 50,
                lon: 50,
                z: 6
            }, {
                lat: 100,
                lon: 100,
                z: 6
            }, {
                lat: 150,
                lon: 50,
                z: 3
            }],
            minSize: 50,
            maxSize: 150,
            temperatureColors: ['#00ff00', '#ff0000', '#0000ff']
        }]
    });

    let series = chart.series[0],
        points = series.points,
        temperatureColors = series.options.temperatureColors,
        colorsLength = temperatureColors.length;

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
        temperatureColors: [[0.7, '#0000ff'], [1, '#00ffff']]
    });

    temperatureColors = series.options.temperatureColors;
    colorsLength = temperatureColors.length;

    points.forEach(point => {
        assert.strictEqual(
            point.graphics.length,
            colorsLength,
            'The point should have a correct number of graphics.'
        );

        const firstGraphicWidth = point.graphics[0].attr('width');

        point.graphics.forEach((graphic, i) => {
            const colorStop = (temperatureColors.slice().reverse())[i][0];

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
        lat: -150,
        lon: -150,
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

    addedPoint.setVisible(false);

    addedPoint.graphics.forEach(graphic => {
        assert.strictEqual(
            graphic.attr('visibility'),
            'hidden',
            'After point.setVisible(false), all graphics should be hidden.'
        );
    });

    addedPoint.setVisible(true);

    addedPoint.graphics.forEach(graphic => {
        assert.notStrictEqual(
            graphic.attr('visibility'),
            'hidden',
            'After point.setVisible(true), all graphics should be visible.'
        );
    });

    addedPoint.remove();

    assert.notOk(
        addedPoint.graphics,
        true,
        `After point.remove(), the point's graphics should be destroyed.`
    );

    series = chart.addSeries({
        type: 'temperaturemap',
        data: [{
            lat: 0,
            lon: 0,
            z: 10
        }, {
            lat: -50,
            lon: -50,
            z: 5
        }]
    });

    points = series.points;
    temperatureColors = series.options.temperatureColors;
    colorsLength = temperatureColors.length;

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
