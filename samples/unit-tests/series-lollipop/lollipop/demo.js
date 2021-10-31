QUnit.test('Lollipop offset affection.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'lollipop'
        },
        series: [
            {
                color: '#0000ff',
                negativeColor: '#ff0000',
                data: [
                    {
                        low: 2
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
    });

    assert.close(
        chart.series[0].data[0].shapeArgs.x,
        chart.series[1].data[0].shapeArgs.x,
        2,
        'Lollipop and Errorbar connectors should be in the same place.'
    );

    assert.deepEqual(
        chart.series[0].points.map((p) => p.graphic.attr('fill')),
        ['#0000ff', '#0000ff', '#ff0000', '#0000ff', '#ff0000'],
        '#15523: Only negative points should use negativeColor'
    );
});
