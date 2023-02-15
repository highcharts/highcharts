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

    const bBox = chart.series[0].points[0].graphic.getBBox(),
        colsize = chart.series[0].options.colsize,
        rowsize = chart.series[0].options.rowsize;

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

    chart.series[0].points[0].setState('hover', false);

    assert.ok(
        chart.series[0].points[0].graphic['stroke-width'] > 0,
        'GeoHeatMap point border should be set to hover after changing state to hover.'
    );

    assert.strictEqual(
        chart.series[0].data[0].graphic.attr('fill'),
        '#a4edba',
        'Point use hover color.'
    );

    chart.series[0].points[0].setState('normal', false);

    assert.strictEqual(
        chart.series[0].points[0].graphic['stroke-width'],
        undefined,
        'GeoHeatMap border should be set to initial after changing state to normal.'
    );

    chart.series[0].update({
        data: [{
            lon: 0,
            lat: 20,
            value: 0
        },
        [0, 30, 5]
        ]
    });

    assert.notOk(
        chart.series[0].points[0].isNull,
        'Point with data is not a null point.'
    );

    assert.notOk(
        chart.series[0].points[0].graphic.hasClass('highcharts-null-point'),
        'Point with data doesn\'t have null point class.'
    );

    chart.series[0].update({
        borderWidth: 0
    });

    assert.strictEqual(
        chart.series[0].transformGroups[0].element.getAttribute('stroke-width'),
        '0',
        'The stroke width should be 0.'
    );

});