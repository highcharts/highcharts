QUnit.test('Sync between data table and series', async assert => {
    const chart = Highcharts.chart('container', {
        dataTable: [{
            columns: {
                Year: [2020, 2021, 2022, 2023],
                Cost: [0, 1, 2, 3],
                Revenue: [10, 11, 12, 13]
            }
        }],
        plotOptions: {
            series: {
                dataMapping: {
                    x: 'Year'
                }
            }
        },
        series: [{
            dataMapping: {
                y: 'Cost'
            }
        }, {
            dataMapping: {
                y: 'Revenue'
            }
        }]
    });

    // Utility function to create a delay, because chart redraws are async
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const dataTable = chart.dataTable[0];

    // Initial values
    assert.strictEqual(chart.series[0].points[0].y, 0);
    assert.strictEqual(chart.series[1].points[0].y, 10);
    assert.strictEqual(dataTable.columns.Cost[0], 0);

    // Add a row to the DataTable and check if Series/Points are updated
    dataTable.setRow({
        Year: 2024,
        Cost: 4,
        Revenue: 14
    });

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[4].y,
        4,
        'After adding a row to the DataTable, the new point should be ' +
        'reflected in the series'
    );

    // Update an indexed row in the DataTable and check if Series/Points are
    // updated
    dataTable.setRow({
        Year: 2020,
        Cost: 5,
        Revenue: 15
    }, 0);

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[0].y,
        5,
        'After updating a row in the DataTable, the corresponding point ' +
        'should be updated in the series'
    );

    // Delete a row in the DataTable and check if Series/Points are updated
    dataTable.deleteRows(0);

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[0].y,
        1,
        'After deleting a row in the DataTable, the corresponding point ' +
        'should be removed from the series'
    );

    // Update a column in the DataTable and check if Series/Points are updated
    dataTable.setColumn('Cost', [10, 11, 12, 13]);

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[0].y,
        10,
        'After updating a column in the DataTable, the corresponding points ' +
        'should be updated in the series'
    );
});
