// Data preparation
const data = new Grid.DataTable({
    columns: {
        instanceId: [
            'i-18cd0d5', 'i-2b3f4e6', 'i-3c5d6e3', 'i-4d7e8f6', 'i-5e9f0a7',
            'i-6f1a2b2', 'i-7a2b3c4', 'i-8b3c4d8', 'i-9c4d5e3', 'i-0d5e6f2'
        ],
        running: [
            true, true, true, true, true, false, true, true, false, true
        ],
        // Common way of representing sparkline data is as a string with
        // comma-separated values, but more complex JSON structures can be
        // used as well.
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
            '86, 73, 57, 38, 35, 44, 70, 56, 33, 23, 18, 15, 11, 8, 5'
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
            '100, 86, 89, 78, 72, 64, 61, 52, 50, 49, 42, 35, 36, 33, 32'
        ],
        publicIP: [
            '54.123.456.78', '152.234.567.89', '203.123.456.90',
            '198.123.456.91', '172.123.456.92', '192.123.456.93',
            '10.123.456.94', '203.123.456.95', '198.123.456.96',
            '172.123.456.97'
        ],
        // Disk operations sparkline data is represented in two columns. It's
        // possible to use it in a single column with a `chartOptions` set
        // as a callback function.
        diskOperationsIn: [10, 20, 1, 30, 40, 0, 25, 60, 0, 70],
        diskOperationsOut: [80, 70, 36, 60, 50, 0, 36, 30, 0, 20],
        // Single-point sparkline data can be represented as a single number.
        diskUsage: [4, 9, 80, 30, 95, 0, 15, 8, 0, 90]
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
    dataTable: data,
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
    }]
});

function scheduleUpdate(rowIndex) {
    const delay = Math.random() * 1500 + 500;
    setTimeout(() => {
        updateInstanceStatus(rowIndex);
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
function updateInstanceStatus(rowIndex) {
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
