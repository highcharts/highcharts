let chart = null; // Chart is not created initially

Grid.grid('grid', {
    dataTable: {
        columns: {
            Year: [
                2010, 2011, 2012, 2013, 2014, 2015,
                2016, 2017, 2018, 2019, 2020, 2021, 2022
            ],
            'Installation & Developers': [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
            ],
            Manufacturing: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
            ],
            'Sales & Distribution': [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
            ],
            'Operations & Maintenance': [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
            ],
            Other: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
            ]
        }
    },
    events: {
        cell: {
            click: function () {
                // Skip if clicked on Year column
                if (this.column.id === 'Year') {
                    return;
                }

                // Create chart if it doesn't exist
                if (!chart) {
                    chart = Highcharts.chart('chart', {
                        title: {
                            text: 'U.S Solar Employment Growth',
                            align: 'center'
                        },
                        xAxis: {
                            categories: [
                                2010, 2011, 2012, 2013, 2014, 2015,
                                2016, 2017, 2018, 2019, 2020, 2021, 2022
                            ]
                        },
                        yAxis: {
                            title: {
                                text: 'Number of Employees'
                            }
                        },
                        series: []
                    });
                }

                // Check if series already exists in the chart
                const existingSeries = chart.series.find(
                    s => s.name === this.column.id
                );

                const toggleColumnHighlight = (columnId, active) => {
                    // Get all cells in the column
                    const cells = this.column.cells;
                    cells.forEach(cell => {
                        const cellElement = cell.htmlElement;
                        if (active) {
                            cellElement.classList.add('active-column');
                        } else {
                            cellElement.classList.remove('active-column');
                        }
                    });
                    // Also highlight the header
                    const headerCell = this.column.header.htmlElement;
                    if (active) {
                        headerCell.classList.add('active-column');
                    } else {
                        headerCell.classList.remove('active-column');
                    }
                };

                if (existingSeries) {
                    // Remove the series from chart
                    existingSeries.remove();
                    // Remove highlighting from the column
                    toggleColumnHighlight(this.column.id, false);

                    // If no series left, destroy the chart
                    if (chart.series.length === 0) {
                        chart.destroy();
                        chart = null;
                    }
                } else {
                    // Add new series to chart
                    chart.addSeries({
                        name: this.column.id,
                        data: this.column.cells.map(c => c.value)
                    });
                    // Add highlighting to the column
                    toggleColumnHighlight(this.column.id, true);
                }
            }
        }
    }
});
