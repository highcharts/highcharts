QUnit.module('No x column', () => {

    if (!Highcharts.Series.prototype.tempNoXColumn) {
        QUnit.skip(
            'Skipped tests for no x column - ' +
            'enable `Series.tempNoXColumn` to test'
        );
        return;
    }

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

    QUnit.test('Input data table with modified x', assert => {
        const chart = Highcharts.chart('container', {
            title: {
                text: 'Input data table with modified x'
            },
            series: [{
                dataTable: {
                    columns: {
                        x: [1, 2, 3, 4],
                        y: [1, 4, 3, 5]
                    }
                },
                pointStart: 2020,
                pointInterval: 10,
                relativeXValue: true,
                type: 'column'
            }]
        });

        assert.deepEqual(
            chart.series[0].getColumn('x'),
            [2030, 2040, 2050, 2060],
            'X column + relativeXValue => x data should be modified'
        );

        chart.update({
            xAxis: {
                type: 'datetime'
            },
            series: [{
                pointStart: '2025-09-23',
                // pointInterval: 10, // unchanged
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
            'X column + relativeXvalue => should handle date inputs'
        );
    });

    QUnit.test('Input data table, uniqueNames', assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'X axis uniqueNames'
            },
            xAxis: {
                type: 'category'
            },
            series: [{
                colorByPoint: true,
                dataTable: {
                    columns: {
                        name: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'],
                        y: [3, 6, 9, 2, 2, 3, 6, 7]
                    }
                },
                showInLegend: false
            }]
        });

        assert.deepEqual(
            chart.series[0].getColumn('x'),
            [0, 1, 2, 3, 0, 1, 2, 3],
            'X data should handle categories with unique names'
        );

        chart.update({
            xAxis: {
                uniqueNames: false
            }
        });

        assert.deepEqual(
            chart.series[0].getColumn('x'),
            [0, 1, 2, 3, 4, 5, 6, 7],
            'X data should handle categories with uniqueNames set to false'
        );
    });
});
