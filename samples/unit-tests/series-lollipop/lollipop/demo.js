QUnit.test('Lollipop offset affection.', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'lollipop'
            },
            series: [
                {
                    color: '#0000ff',
                    negativeColor: '#ff0000',
                    data: [
                        {
                            y: 2
                        },
                        3,
                        -4,
                        2,
                        -5
                    ]
                },
                {
                    type: 'errorbar',
                    data: [[2, 3]]
                }
            ]
        }),
        lollipopPoints = chart.series[0].points,
        errorbarPoints = chart.series[1].points;

    assert.close(
        lollipopPoints[0].shapeArgs.x,
        errorbarPoints[0].shapeArgs.x + (errorbarPoints[0].shapeArgs.width / 2),
        2,
        'Lollipop and Errorbar connectors should be in the same place.'
    );

    assert.deepEqual(
        lollipopPoints.map(p => p.graphic.attr('fill')),
        [
            '#0000ff',
            '#0000ff',
            '#ff0000',
            '#0000ff',
            '#ff0000'
        ],
        '#15523: Only negative points should use negativeColor'
    );

    chart.series[0].update({
        marker: {
            fillColor: '#00ff00'
        }
    });

    assert.strictEqual(
        lollipopPoints[0].graphic.attr('fill'),
        '#00ff00',
        '#14103: Marker fillColor should be applied.'
    );

    lollipopPoints[0].setState('hover', false);
    lollipopPoints[0].setState();

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('fill'),
        '#00ff00',
        `#14103: Marker fillColor should be not be changed after changing
        state.`
    );
});
