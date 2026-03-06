QUnit.test('Series dataTable option update', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            dataTable: {
                columns: {
                    x: [0, 1, 2],
                    y: [0, 1, 2]
                }
            },
            type: 'column'
        }]
    });

    assert.deepEqual(
        chart.series[0].points.map(p => p.y),
        [0, 1, 2],
        'Base data'
    );

    chart.series[0].setData({
        columns: {
            x: [0, 1, 2],
            y: [1, 2, 3]
        }
    });

    assert.strictEqual(
        chart.series[0].points.map(p => p.y).toString(),
        [1, 2, 3].toString(),
        'Passing DataTable config to setData, series should be updated'
    );

    chart.series[0].setData(new Highcharts.DataTableCore({
        columns: {
            x: [0, 1, 2],
            y: [2, 3, 4]
        }
    }));

    assert.strictEqual(
        chart.series[0].points.map(p => p.y).toString(),
        [2, 3, 4].toString(),
        'Passing DataTable instance to setData, series should be updated'
    );

    chart.series[0].update({
        dataTable: {
            columns: {
                x: [0, 1, 2],
                y: [3, 4, 5]
            }
        }
    });

    assert.strictEqual(
        chart.series[0].points.map(p => p.y).toString(),
        [3, 4, 5].toString(),
        'Passing DataTable config to Series.update, series should be updated'
    );

    Highcharts.charts[0].series[0].update({
        dataTable: new Highcharts.DataTableCore({
            columns: {
                x: [0, 1, 2],
                y: [4, 5, 6]
            }
        })
    });

    assert.strictEqual(
        chart.series[0].points.map(p => p.y).toString(),
        [4, 5, 6].toString(),
        'Passing DataTable instance to Series.update, series should be updated'
    );
});
