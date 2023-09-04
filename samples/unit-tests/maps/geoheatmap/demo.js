QUnit.test('GeoHeatMap Series', assert => {

    const chart = Highcharts.mapChart('container', {

        colorAxis: {
            minColor: 'rgb(0,0,0)'
        },

        series: [{
            states: {
                hover: {
                    color: '#a4edba',
                    borderWidth: 5
                }
            },
            colsize: 15,
            rowsize: 10,
            type: 'geoheatmap',
            data: [{
                lon: 0,
                lat: 10,
                value: 10
            }]
        }]

    });

    // Testing colors, borders, rowsize, colsize

    const series = chart.series[0],
        bBox = series.points[0].graphic.getBBox(),
        colsize = series.options.colsize,
        rowsize = series.options.rowsize;

    assert.strictEqual(
        bBox.width - colsize,
        0,
        'GeoHeatMap point fixed width should set correctly through colsize options.'
    );

    assert.strictEqual(
        bBox.height - rowsize,
        0,
        'GeoHeatMap point fixed height should set correctly through rowsize options.'
    );

    series.points[0].setState('hover', false);

    assert.ok(
        series.points[0].graphic['stroke-width'] > 0,
        'GeoHeatMap point border should be set to hover after changing state to hover.'
    );

    assert.strictEqual(
        series.data[0].graphic.attr('fill'),
        '#a4edba',
        'Point use hover color.'
    );

    series.points[0].setState('normal', false);

    assert.strictEqual(
        series.points[0].graphic['stroke-width'],
        undefined,
        'GeoHeatMap border should be set to initial after changing state to normal.'
    );

    series.update({
        data: [{
            lon: 0,
            lat: 20,
            value: 0
        },
        [0, 30, 5]
        ]
    });

    assert.notOk(
        series.points[0].isNull,
        'Point with data is not a null point.'
    );

    assert.notOk(
        series.points[0].graphic.hasClass('highcharts-null-point'),
        'Point with data doesn\'t have null point class.'
    );

    series.update({
        borderWidth: 0
    });

    assert.strictEqual(
        series.transformGroups[0].element.getAttribute('stroke-width'),
        '0',
        'The stroke width should be 0.'
    );

    series.update({
        interpolation: {
            enabled: true
        }
    });

    const
        controller = new TestController(chart),
        point = series.points[0],
        { plotX, plotY } = point,
        { container, plotLeft, plotTop } = chart;

    controller.moveTo(plotLeft + plotX, plotTop + plotY);

    assert.ok(
        container.getElementsByClassName('highcharts-tooltip') !== undefined,
        'Tooltip should be visible, when intepolated image is hovered.'
    );

    assert.deepEqual(
        [chart.hoverPoint.lon, chart.hoverPoint.lat],
        [point.lon, point.lat],
        'Hovered point should be correct.'
    );

    series.setData([{
        lon: 0,
        lat: 20,
        value: 5
    }, [0, 30, 0]]);

    // Move mouse a little bit to refresh tooltip
    controller.moveTo(plotLeft + plotX + 5, plotTop + plotY);

    assert.strictEqual(
        chart.hoverPoint.value,
        5,
        `Hovered point value should be changed be correct after changing the
        data.`
    );
});