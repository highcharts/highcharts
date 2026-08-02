QUnit.test('Navigator and Gantt first render', assert => {
    const chart = Highcharts.ganttChart('container', {
        navigator: {
            enabled: true
        },
        series: [{
            data: [{
                name: 'Category 1',
                start: Date.UTC(2026, 0, 1),
                end: Date.UTC(2026, 0, 4)
            }, {
                name: 'Category 2',
                start: Date.UTC(2026, 0, 2),
                end: Date.UTC(2026, 0, 6)
            }]
        }]
    });

    const SeriesColY = chart.series[0].dataTable.getColumn('y'),
        NavSeriesColY = chart.navigator.series[0].dataTable.getColumn('y');

    assert.notStrictEqual(
        NavSeriesColY,
        undefined,
        'Column "y" should exist in navigator series data table'
    );

    NavSeriesColY.forEach((_, i) => {
        assert.strictEqual(
            SeriesColY[i],
            NavSeriesColY[i],
            '"y" column values in Nav and Chart series should be identical'
        );
    });
});
