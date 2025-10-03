QUnit.test('Input data table with no x', assert => {
    const chart = Highcharts.chart('container', {
        title: {
            text: 'Data table with no x'
        },
        series: [{
            dataTable: {
                columns: {
                    y: [1, 3, 2, 4]
                }
            },
            type: 'column'
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'The y-axis should be activated'
    );

    assert.strictEqual(
        chart.xAxis[0].pointRange,
        1,
        'Point range should be applied'
    );

    chart.series[0].update({
        pointStart: 2025
    });

    assert.deepEqual(
        chart.series[0].getColumn('x'),
        [2025, 2026, 2027, 2028],
        'X data should be updated'
    );

    chart.series[0].update({
        pointStart: 2000,
        pointInterval: 10
    });

    assert.deepEqual(
        chart.series[0].getColumn('x'),
        [2000, 2010, 2020, 2030],
        'X data should be updated with start and interval'
    );

    chart.update({
        xAxis: {
            type: 'datetime'
        },
        series: [{
            pointStart: '2025-10-03',
            pointIntervalUnit: 'day'
        }]
    });

    assert.deepEqual(
        chart.series[0].getColumn('x').map(x => new Date(x).toUTCString()),
        [
            'Fri, 03 Oct 2025 00:00:00 GMT',
            'Mon, 13 Oct 2025 00:00:00 GMT',
            'Thu, 23 Oct 2025 00:00:00 GMT',
            'Sun, 02 Nov 2025 00:00:00 GMT'
        ],
        'X data should handle date inputs'
    );

    chart.update({
        xAxis: {
            type: 'category',
            categories: ['Ein', 'To', 'Tre', 'Fire']
        },
        series: [{
            pointStart: 0,
            pointIntervalUnit: undefined,
            pointInterval: undefined
        }]
    });

    assert.deepEqual(
        chart.series[0].getColumn('x'),
        [0, 1, 2, 3],
        'X data should handle categories'
    );
});
