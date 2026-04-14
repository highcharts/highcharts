let chart = null; // Chart is not created initially

const activeCols = new Set();

Grid.grid('grid', {
    data: {
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
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    const grid = this.row.viewport.grid;
                    const yearColumnId = 'Year';
                    const columnId = this.column.id;

                    // Skip if clicked on Year column
                    if (columnId === yearColumnId) {
                        return;
                    }

                    // We get the x axis from the Year column
                    const years = grid.dataTable.getColumn(yearColumnId);

                    // Create chart if it doesn't exist
                    if (!chart) {
                        chart = Highcharts.chart('chart', {
                            title: {
                                text: 'U.S Solar Employment Growth',
                                align: 'center'
                            },
                            xAxis: {
                                categories: years
                            },
                            yAxis: {
                                title: {
                                    text: 'Number of Employees'
                                }
                            }
                        });
                    }

                    // Check if series already exists in the chart
                    const existingSeries = chart.series.find(
                        s => s.name === columnId
                    );

                    const toggleColumnHighlight = () => {
                        if (activeCols.has(columnId)) {
                            activeCols.delete(columnId);
                        } else {
                            activeCols.add(columnId);
                        }
                    };

                    const accessibility = grid.accessibility;

                    if (existingSeries) {
                        // Remove the series from chart
                        existingSeries.remove();

                        // Accessibility
                        accessibility.announce(
                            `Removed series ${columnId} from chart.`,
                            true
                        );

                        // If no series left, destroy the chart
                        if (chart.series.length === 0) {
                            chart.destroy();
                            chart = null;

                            // Accessibility
                            accessibility.announce('Destroyed chart.', true);
                        }
                    } else {
                        // Add new series to chart
                        chart.addSeries({
                            name: columnId,
                            data: this.column.data
                        });

                        // Accessibility
                        accessibility.announce(
                            `Added series ${columnId} to the chart.`,
                            true
                        );
                    }
                    toggleColumnHighlight();
                    setActiveColumnStyle(this);
                },
                afterSetValue: function () {
                    setActiveColumnStyle(this);
                }
            }
        }
    },
    columns: [{
        id: 'Year',
        width: 65
    }]
});

function setActiveColumnStyle(cell) {
    const isActive = activeCols.has(cell.column.id);
    const cells = cell.column.cells;
    cells.forEach(c => {
        c.htmlElement.classList.toggle('active-column', isActive);
    });
    cell.column.header.htmlElement.classList.toggle('active-column', isActive);
}
