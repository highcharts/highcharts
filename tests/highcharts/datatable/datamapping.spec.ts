import { createChart, expect, test } from '~/fixtures';

test.describe('DataTable and dataMapping', () => {
    test('Data mapping', async ({ page }) => {
        const handle = await createChart(
            page,
            {
                dataTable: [{
                    id: 'dataTable1',
                    columns: {
                        Year: [2020, 2021, 2022, 2023],
                        Cost: [11, 13, 12, 14],
                        Revenue: [1, 1, 1, 1]
                    }
                }, {
                    id: 'dataTable2',
                    columns: {
                        Cost2: [11, 13, 12, 14],
                        Revenue2: [2, 2, 2, 2]
                    }
                }, {
                    id: 'dataTable3',
                    columns: {
                        Cost3: [11, 13, 12, 14],
                        Revenue3: [3, 3, 3, 3]
                    }
                }, {
                    id: 'dataTable4',
                    columns: {
                        Cost4: [11, 13, 12, 14],
                        Revenue4: [4, 4, 4, 4]
                    }
                }],
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
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
                        y: {
                            column: 'Revenue'
                        }
                    }
                }, {
                    dataMapping: {
                        y: {
                            dataTable: 1,
                            column: 'Revenue2'
                        }
                    }
                }, {
                    dataMapping: {
                        y: {
                            dataTable: 'dataTable3',
                            column: 'Revenue3'
                        }
                    }
                }, {
                    dataMapping: {
                        y: {
                            dataTable: 'dataTable4',
                            column: 1
                        }
                    }
                }]
            }
        );

        const createdChart = await handle.jsonValue();

        // Shorthand mapping with string
        expect(createdChart.series[0].name).toBe('Cost');
        expect(createdChart.series[0].points[0].y).toBe(11);

        // Full mapping with object
        expect(createdChart.series[1].name).toBe('Revenue');
        expect(createdChart.series[1].points[0].y).toBe(1);

        // Mapping with dataTable index
        expect(createdChart.series[2].name).toBe('Revenue2');
        expect(createdChart.series[2].points[0].y).toBe(2);

        // Mapping with dataTable id
        expect(createdChart.series[3].name).toBe('Revenue3');
        expect(createdChart.series[3].points[0].y).toBe(3);

        // Mapping with column index
        expect(createdChart.series[4].name)
            // The series doesn't know the column name
            .toBe('Series 5');
        expect(createdChart.series[4].points[0].y).toBe(4);
    });
});
