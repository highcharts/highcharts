QUnit.test('Sync between data table and series', async assert => {
    let redrawCount = 0;
    const chart = Highcharts.chart('container', {
        dataTable: [{
            columns: {
                Year: [2020, 2021, 2022, 2023],
                Cost: [0, 1, 2, 3],
                Revenue: [10, 11, 12, 13]
            }
        }],
        chart: {
            events: {
                redraw: function () {
                    redrawCount++;
                }
            }
        },
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
    redrawCount = 0;
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
    assert.strictEqual(
        redrawCount,
        1,
        'After adding a row to the DataTable, the chart should redraw once'
    );

    // Update an indexed row in the DataTable and check if Series/Points are
    // updated
    redrawCount = 0;
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
    assert.strictEqual(
        redrawCount,
        1,
        'After updating a row in the DataTable, the chart should redraw once'
    );

    // Delete a row in the DataTable and check if Series/Points are updated
    redrawCount = 0;
    dataTable.deleteRows(0);

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[0].y,
        1,
        'After deleting a row in the DataTable, the corresponding point ' +
        'should be removed from the series'
    );

    assert.strictEqual(
        redrawCount,
        1,
        'After deleting a row in the DataTable, the chart should redraw once'
    );

    // Update a column in the DataTable and check if Series/Points are updated
    redrawCount = 0;
    dataTable.setColumn('Cost', [10, 11, 12, 13]);

    await delay(1);
    assert.strictEqual(
        chart.series[0].points[0].y,
        10,
        'After updating a column in the DataTable, the corresponding points ' +
        'should be updated in the series'
    );
    assert.strictEqual(
        redrawCount,
        1,
        'After updating a column in the DataTable, the chart should redraw once'
    );

    // Set multiple columns
    redrawCount = 0;
    dataTable.setColumns({
        Cost: [20, 21, 22, 23],
        Revenue: [30, 31, 32, 33]
    });
    await delay(1);
    // #25371, each series triggered its own chart redraw
    assert.strictEqual(
        redrawCount,
        1,
        'After adding a row to the DataTable, the chart should be exactly once'
    );
});
