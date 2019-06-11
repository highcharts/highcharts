QUnit.test('Point select and staging', assert => {
    let selectedPoints = [];
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [
                ['Ein', 1],
                ['To', 2],
                ['Tre', 3],
                ['Fire', 4]
            ],
            point: {
                events: {
                    select: () => {
                        selectedPoints = chart.getSelectedPoints()
                            .map(p => p.name);
                    },
                    unselect: () => {
                        selectedPoints = chart.getSelectedPoints()
                            .map(p => p.name);
                    }
                }
            }
        }]
    });

    assert.deepEqual(
        selectedPoints,
        [],
        'Initially we should have an empty array'
    );

    chart.series[0].points[0].select();
    assert.deepEqual(
        selectedPoints,
        ['Ein'],
        'We should have one selected point'
    );

    chart.series[0].points[1].select();
    assert.deepEqual(
        selectedPoints,
        ['To'],
        'After selecting the second point, the first should be unselected'
    );

    chart.series[0].points[2].select(true, true);
    assert.deepEqual(
        selectedPoints,
        ['To', 'Tre'],
        'After accumulating the third point, there should be two points selected'
    );

    chart.series[0].points[1].select(false, true);
    assert.deepEqual(
        selectedPoints,
        ['Tre'],
        'After unselecting/accumulating the second point, there should be one point selected'
    );

    chart.series[0].points[2].select(false);
    assert.deepEqual(
        selectedPoints,
        [],
        'After unselecting the final point, there should be no point selected'
    );

});