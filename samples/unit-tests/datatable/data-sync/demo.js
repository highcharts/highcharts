QUnit.module('DataTable sync', () => {

    // Utility function to create a delay, because chart redraws are async
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    QUnit.test('Chart-level data table and series', async assert => {
        const chart = Highcharts.chart('container', {
            dataTable: [{
                columns: {
                    Year: [2020, 2021, 2022, 2023],
                    Cost: [0, 1, 2, 3],
                    Revenue: [10, 11, 12, 13]
                }
            }],
            chart: {
                type: 'column'
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

        dataTable.columns.Cost[1] = 6;
        Highcharts.fireEvent(dataTable, 'afterSetCell', {
            cellValue: 6,
            columnId: 'Cost',
            rowIndex: 1
        });

        await delay(1);
        assert.strictEqual(
            chart.series[0].points[1].y,
            6,
            'After setting a cell in the DataTable, the corresponding point ' +
            'should be updated in the series'
        );

        // Update a column in the DataTable and check if Series/Points are
        // updated
        dataTable.setColumn('Cost', [10, 11, 12, 13]);

        await delay(1);
        assert.strictEqual(
            chart.series[0].points[0].y,
            10,
            'After updating a column in the DataTable, the corresponding ' +
            'points should be updated in the series'
        );

        // Series.update should not break the sync (#25441)
        chart.series[0].update({ color: 'red' });
        dataTable.setColumn('Cost', [20, 21, 22, 23]);

        await delay(1);
        assert.strictEqual(
            chart.series[0].points[0].y,
            20,
            'After updating a column in the DataTable, the corresponding' +
            ' points should be updated in the series even after Series.update'
        );

        dataTable.setColumns({
            Year: [2020, 2021, 2022, 2023],
            Cost: [0, 1, 2, 3],
            Revenue: [10, 11, 12, 13]
        });
        dataTable.deleteRows(0);

        assert.strictEqual(
            chart.series[0].points.length,
            3,
            'After deleting a row in the DataTable, only one point ' +
            'should be removed from the series'
        );
    });

    QUnit.test(
        'Series-level data table and series/points',
        async assert => {
            const dataTable = new Highcharts.DataTable({
                columns: {
                    x: [1, 2, 3, 4],
                    y: [1, 3, 2, 4]
                }
            });

            const { series: [series] } = Highcharts.chart('container', {
                series: [{ dataTable, type: 'column' }]
            });

            assert.ok(
                dataTable === series.dataTable,
                'Series should have the same data table as the one passed in ' +
                'the options'
            );

            series.points[0].update({ y: 5 });

            await delay(1);
            assert.strictEqual(
                dataTable.columns.y[0],
                5,
                'After updating a point, the corresponding cell in the data ' +
                'table should be updated'
            );

            series.setData([2, 3, 2, 4]);

            await delay(1);
            assert.deepEqual(
                dataTable.columns.y,
                [2, 3, 2, 4],
                'After updating the series data, the corresponding column in ' +
                'the data table should be updated'
            );

            dataTable.setColumn('y', [10, 11, 12, 13]);

            await delay(1);
            assert.deepEqual(
                series.points.map(point => point.y),
                [10, 11, 12, 13],
                'After updating a column in the data table, the ' +
                'corresponding series data should be updated'
            );

            dataTable.setRow({ x: 1, y: 14 }, 0);

            await delay(1);
            assert.strictEqual(
                series.points[0].y,
                14,
                'After adding a row in the data table, the corresponding ' +
                'point should be added to the series'
            );

            /*
            dataTable.setRow({ x: 5, y: 5 });

            await delay(1);
            assert.strictEqual(
                series.points[4].y,
                5,
                'After adding a row in the data table, the corresponding ' +
                'point should be added to the series'
            );
            */

            /*
            dataTable.deleteRows(0);

            await delay(1);
            assert.strictEqual(
                series.points[0].y,
                11,
                'After deleting a row in the data table, the corresponding ' +
                'point should be removed from the series'
            );
            */
        }
    );
});
