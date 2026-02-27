// Data preparation
const data = new Grid.DataTable({
    columns: {
        instanceId: [
            'i-18cd0d5', 'i-2b3f4e6', 'i-3c5d6e3', 'i-4d7e8f6', 'i-5e9f0a7',
            'i-6f1a2b2', 'i-7a2b3c4', 'i-8b3c4d8', 'i-9c4d5e3', 'i-0d5e6f2',
            'i-1f2g3h4', 'i-2g3h4i5', 'i-3h4i5j6', 'i-4i5j6k7', 'i-5j6k7l8',
            'i-6k7l8m9', 'i-7l8m9n0', 'i-8m9n0o1', 'i-9n0o1p2', 'i-0o1p2q3',
            'i-1p2q3r4', 'i-2q3r4s5', 'i-3r4s5t6', 'i-4s5t6u7', 'i-5t6u7v8',
            'i-6u7v8w9', 'i-7v8w9x0', 'i-8w9x0y1', 'i-9x0y1z2', 'i-0y1z2a3'
        ],
        running: [
            true, true, true, true, true, false, true, true, false, true,
            true, false, true, true, true, true, false, true, true, false,
            true, true, false, true, true, true, true, false, true, true
        ],
        cpuUtilization: [
            '15, 18, 29, 48, 56, 54, 34, 28, 23, 13, 8, 5, 9, 15, 25',
            '99, 96, 82, 53, 33, 22, 29, 38, 52, 73, 84, 91, 97, 89, 70',
            '1, 4, 24, 65, 79, 77, 52, 38, 29, 22, 16, 10, 6, 9, 15',
            '50, 54, 64, 78, 89, 96, 99, 95, 89, 86, 83, 80, 76, 73, 70',
            '20, 21, 22, 25, 28, 31, 35, 43, 51, 58, 58, 55, 59, 58, 54',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '97, 92, 89, 85, 82, 81, 85, 88, 91, 97, 97, 94, 93, 92, 91',
            '5, 2, 1, 2, 4, 7, 9, 6, 4, 3, 3, 2, 1, 1, 0',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '86, 73, 57, 38, 35, 44, 70, 56, 33, 23, 18, 15, 11, 8, 5',
            '45, 48, 52, 58, 64, 70, 75, 78, 74, 68, 62, 55, 48, 42, 38',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '30, 35, 42, 51, 58, 64, 68, 65, 59, 52, 46, 39, 33, 28, 24',
            '88, 85, 80, 75, 71, 68, 66, 64, 62, 61, 60, 59, 58, 57, 56',
            '12, 15, 19, 25, 32, 40, 48, 55, 61, 65, 67, 66, 63, 58, 52',
            '95, 93, 90, 87, 84, 82, 80, 78, 76, 75, 74, 73, 72, 71, 70',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '60, 58, 55, 52, 49, 47, 45, 44, 43, 42, 42, 43, 44, 45, 46',
            '25, 28, 32, 37, 43, 50, 58, 65, 71, 75, 77, 76, 73, 69, 64',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '70, 68, 65, 61, 57, 53, 49, 46, 43, 41, 39, 38, 37, 36, 35',
            '35, 38, 42, 47, 53, 60, 67, 73, 78, 81, 82, 81, 78, 74, 69',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '92, 89, 85, 81, 77, 74, 71, 69, 67, 66, 65, 64, 63, 62, 61',
            '8, 11, 16, 23, 31, 40, 49, 57, 63, 67, 69, 68, 65, 60, 54',
            '55, 58, 62, 67, 73, 79, 84, 88, 90, 90, 88, 85, 81, 76, 71',
            '18, 21, 25, 30, 36, 43, 51, 59, 66, 71, 74, 75, 73, 69, 64',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '78, 75, 71, 66, 61, 56, 52, 48, 45, 43, 41, 40, 39, 38, 37',
            '42, 45, 49, 54, 60, 67, 74, 80, 85, 88, 89, 88, 85, 81, 76'
        ],
        memoryUtilization: [
            '28, 35, 41, 41, 43, 41, 47, 53, 63, 64, 64, 65, 75, 74, 79',
            '76, 79, 77, 72, 67, 63, 63, 56, 54, 49, 42, 38, 42, 33, 28',
            '49, 55, 57, 67, 69, 72, 78, 78, 75, 72, 72, 67, 61, 61, 54',
            '48, 49, 40, 35, 38, 26, 20, 22, 28, 24, 29, 26, 39, 35, 55',
            '40, 40, 40, 41, 39, 38, 40, 42, 39, 69, 63, 67, 61, 65, 64',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '50, 48, 52, 51, 50, 48, 50, 53, 50, 50, 49, 50, 52, 51, 50',
            '45, 47, 46, 44, 47, 48, 71, 46, 43, 44, 47, 45, 49, 44, 44',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '100, 86, 89, 78, 72, 64, 61, 52, 50, 49, 42, 35, 36, 33, 32',
            '35, 38, 42, 45, 48, 51, 54, 56, 58, 60, 61, 62, 63, 64, 65',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '55, 58, 61, 63, 65, 67, 68, 69, 68, 66, 64, 62, 60, 58, 56',
            '72, 70, 68, 66, 64, 62, 60, 59, 58, 57, 56, 55, 54, 53, 52',
            '30, 32, 35, 38, 42, 46, 50, 54, 58, 61, 63, 64, 65, 65, 65',
            '80, 78, 76, 74, 72, 70, 68, 67, 66, 65, 64, 63, 62, 61, 60',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '52, 54, 56, 58, 59, 60, 61, 62, 62, 62, 61, 60, 59, 58, 57',
            '44, 46, 49, 52, 55, 58, 61, 64, 66, 68, 69, 70, 70, 70, 69',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '68, 66, 64, 62, 60, 58, 56, 55, 54, 53, 52, 51, 50, 50, 50',
            '38, 40, 43, 46, 50, 54, 58, 62, 65, 68, 70, 71, 72, 72, 71',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '85, 83, 81, 79, 77, 75, 73, 71, 70, 69, 68, 67, 66, 65, 64',
            '25, 27, 30, 33, 37, 41, 45, 49, 53, 57, 60, 62, 64, 65, 66',
            '58, 60, 62, 64, 66, 68, 70, 71, 72, 73, 73, 73, 72, 71, 70',
            '42, 44, 47, 50, 53, 56, 59, 62, 64, 66, 67, 68, 68, 68, 67',
            '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
            '75, 73, 71, 69, 67, 65, 63, 61, 60, 59, 58, 57, 56, 55, 54',
            '48, 50, 53, 56, 59, 62, 65, 68, 70, 72, 73, 74, 74, 74, 73'
        ],
        publicIP: [
            '54.123.456.78', '152.234.567.89', '203.123.456.90',
            '198.123.456.91', '172.123.456.92', '192.123.456.93',
            '10.123.456.94', '203.123.456.95', '198.123.456.96',
            '172.123.456.97',
            '54.234.567.100', '152.123.456.101', '203.234.567.102',
            '198.234.567.103', '172.234.567.104', '192.234.567.105',
            '10.234.567.106', '203.123.456.107', '198.123.456.108',
            '172.123.456.109',
            '54.123.789.110', '152.234.890.111', '203.123.789.112',
            '198.234.890.113', '172.123.789.114', '192.234.890.115',
            '10.123.789.116', '203.234.890.117', '198.123.789.118',
            '172.234.890.119'
        ],
        diskOperationsIn: [
            10, 20, 1, 30, 40, 0, 25, 60, 0, 70,
            15, 0, 35, 45, 50, 55, 0, 40, 65, 0,
            12, 28, 0, 38, 48, 52, 58, 0, 42, 68
        ],
        diskOperationsOut: [
            80, 70, 36, 60, 50, 0, 36, 30, 0, 20,
            75, 0, 55, 65, 45, 40, 0, 50, 35, 0,
            78, 72, 0, 62, 48, 42, 38, 0, 52, 25
        ],
        diskUsage: [
            4, 9, 80, 30, 95, 0, 15, 8, 0, 90,
            12, 0, 65, 45, 88, 75, 0, 22, 55, 0,
            18, 35, 0, 50, 92, 70, 28, 0, 60, 85
        ]
    }
});

// Defined zones here to use in various sparkline options.
const percentageZones = [{
    value: 0.5,
    color: '#9998'
}, {
    value: 60,
    color: '#4caf50'
}, {
    value: 85,
    color: '#ebcb3b'
}, {
    color: '#f44336'
}];

// Create the grid with the data table and configure the columns.
const grid = Grid.grid('container', {
    data: { dataTable: data },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    columns: [{
        id: 'instanceId',
        header: {
            format: 'Instance ID'
        },
        width: 120
    }, {
        id: 'running',
        header: {
            format: 'Status'
        },
        cells: {
            format: `{#if value}
                <div class="status running">running</div>
            {else}
                <div class="status stopped">stopped</div>
            {/if}`
        },
        width: 100
    }, {
        id: 'cpuUtilization',
        header: {
            format: 'CPU Utilization'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        // Take note that the animation is enabled by
                        // default for sparkline charts, but we can disable
                        // it if we want to.
                        animation: false
                    },
                    yAxis: {
                        min: 0,
                        max: 100.1
                    },
                    plotOptions: {
                        series: {
                            zones: percentageZones
                        }
                    }
                }
            }
        }
    }, {
        id: 'memoryUtilization',
        header: {
            format: 'Memory Utilization'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: function (data) {
                    const yData = data.split(',').map(Number);

                    // To make the sparkline animate like the points are added
                    // to the end of the series isntead of updating the existing
                    // points, we need to update also the x values of the
                    // points. It can be done in the dataset directly, or
                    // calculated here, in the `chartOptions` callback.
                    const firstX = (
                        this.content?.chart?.series?.[0].points?.[0]?.x ?? -1
                    ) + 1;

                    return {
                        yAxis: {
                            min: 0,
                            max: 100
                        },
                        series: [{
                            type: 'column',
                            data: yData.map((y, i) => ([firstX + i, y])),
                            borderRadius: 0,
                            // Columns rendered on a sparkline are usually
                            // very thin, so crisp edges make the spaces
                            // between points irregular. Turning crisp off
                            // makes them evenly spaced, but with slightly
                            // blurred edges.
                            crisp: false,
                            zones: percentageZones
                        }]
                    };
                }
            }
        }
    }, {
        id: 'publicIP',
        header: {
            format: 'Public IP'
        },
        width: 150
    }, {
        id: 'diskOperationsIn',
        header: {
            format: 'Disk Operations'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                // This sparkline uses two columns of data to render a bar chart
                // with two bars, one for disk operations in and one for disk
                // operations out. That's why the `chartOptions` is a
                // function that returns the options based on the row data.
                // The context of the function is the cell, so we can
                // access the row data using `this.row.data`.
                chartOptions: function () {
                    return {
                        chart: {
                            type: 'bar',
                            marginLeft: 35
                        },
                        yAxis: {
                            min: 0,
                            max: 100
                        },
                        xAxis: {
                            // Axes are not rendered on sparklines, by default,
                            // but we can turn them on in the chart options.
                            visible: true,
                            categories: ['in', 'out'],
                            lineColor: '#999',
                            labels: {
                                enabled: true,
                                allowOverlap: true,
                                distance: 3,
                                style: {
                                    color: '#999'
                                }
                            }
                        },
                        series: [{
                            colorByPoint: true,
                            data: [
                                this.row.data.diskOperationsIn,
                                this.row.data.diskOperationsOut
                            ],
                            dataLabels: {
                                enabled: true,
                                allowOverlap: true,
                                useHTML: true,
                                format: '<span class="spark-label">{y}</span>'
                            }
                        }]
                    };
                }
            }
        }
    }, {
        id: 'diskOperationsOut',
        // This column is not rendered, but it is used by the
        // `diskOperationsIn` column to render the sparkline.
        enabled: false
    }, {
        id: 'diskUsage',
        width: 120,
        header: {
            format: 'Disk Usage'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                // The first argument of the `chartOptions` function is the
                // raw data value of the cell, so we can use it to set the
                // chart options based on the value.
                chartOptions: function (data) {
                    return {
                        chart: {
                            type: 'pie'
                        },
                        series: [{
                            innerSize: '50%',
                            data: [{
                                name: 'Used',
                                y: data,
                                color: percentageZones.find(
                                    zone => data <= (zone.value || Infinity)
                                ).color
                            }, {
                                name: 'Free',
                                y: 100 - data,
                                color: '#9994'
                            }]
                        }]
                    };
                }
            }
        }
    }],
    pagination: {
        enabled: true
    }
});

function scheduleUpdate(rowIndex) {
    const delay = Math.random() * 1500 + 500;
    setTimeout(async () => {
        await updateInstanceStatus(rowIndex);
        scheduleUpdate(rowIndex);
    }, delay);
}

// Schedule updates for all rows in the data table.
for (let i = 0, iEnd = data.getRowCount(); i < iEnd; i++) {
    scheduleUpdate(i);
}

// Function to generate a new dummy sparkline data array based on the old one.
function generateArrayFlow(stringArray) {
    const r = Math.random() * 2 - 1;
    const change = Math.floor(r * r * r * 30);

    const array = stringArray.split(',').map(Number);
    array.shift();
    array.push(
        Highcharts.clamp(array[array.length - 1] + change, 0, 100)
    );

    return array.join(', ');
}

// Function to update the instance status in the data table and refresh the
// cells. It updates the data even if the cells are not rendered in the grid.
async function updateInstanceStatus(rowIndex) {
    const running = data.getCell('running', rowIndex);
    if (!running) {
        return;
    }

    const cpuUtilization = data.getCell('cpuUtilization', rowIndex);
    const memoryUtilization = data.getCell('memoryUtilization', rowIndex);

    // Data Table cells can be updated directly, even if the cells are not
    // rendered in the grid.
    data.setCell(
        'cpuUtilization',
        rowIndex,
        generateArrayFlow(cpuUtilization)
    );
    data.setCell(
        'memoryUtilization',
        rowIndex,
        generateArrayFlow(memoryUtilization)
    );
    data.setCell(
        'diskOperationsIn',
        rowIndex,
        Math.round(Math.random() * 100)
    );
    data.setCell(
        'diskOperationsOut',
        rowIndex,
        Math.round(Math.random() * 100)
    );
    data.setCell(
        'diskUsage',
        rowIndex,
        Math.round(Math.random() * 100)
    );

    const row = grid?.viewport.getRow(rowIndex);
    if (!row) {
        return;
    }

    // Apply the modifiers to the data table.
    await grid.querying.proceed(true);

    // Matach the data table to the presentation table.
    grid.viewport.dataTable = grid.presentationTable;

    // Load the data into the columns.
    for (const column of grid.viewport.columns) {
        column.loadData();
    }

    // row.loadData() is used to fetch the data from the data table into the
    // `row.data` object, because unlike the `column.data`, the `row.data`
    // is not a direct reference to the data table, but a copy of the data
    // for the row.
    row.loadData();

    row.cells.forEach(cell => {
        // `cell.setValue()` without arguments will refresh the cell with
        // the current value from the data table.
        cell.setValue();
    });
}
