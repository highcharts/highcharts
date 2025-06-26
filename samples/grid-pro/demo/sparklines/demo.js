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
        diskOperationsIn: [10, 20, 1, 30, 40, 0, 25, 60, 0, 70],
        diskOperationsOut: [80, 70, 36, 60, 50, 0, 36, 30, 0, 20],
        diskUsage: [4, 9, 80, 30, 95, 0, 15, 8, 0, 90]
    }
});

// Defined zones here to use in various sparkline options.
const percentageZones = [{
    value: 0.5,
    color: '#9998'
}, {
    value: 60,
    color: '#4CAF50'
}, {
    value: 70,
    color: '#DDEB3B'
}, {
    value: 90,
    color: '#FFAA00'
}, {
    color: '#F44336'
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
                chartOptions: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        min: 0,
                        max: 100
                    },
                    plotOptions: {
                        column: {
                            borderRadius: 0,
                            crisp: false,
                            zones: percentageZones
                        }
                    }
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
                            data: [{
                                y: this.row.data.diskOperationsIn,
                                color: '#2caffe'
                            }, {
                                y: this.row.data.diskOperationsOut,
                                color: '#544fc5'
                            }],
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
                chartOptions: function (data) {
                    return {
                        chart: {
                            type: 'pie',
                            animation: true
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

for (let i = 0, iEnd = data.getRowCount(); i < iEnd; i++) {
    scheduleUpdate(i);
}

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

function updateInstanceStatus(rowIndex) {
    const running = data.getCell('running', rowIndex);
    if (!running) {
        return;
    }

    const cpuUtilization = data.getCell('cpuUtilization', rowIndex);
    const memoryUtilization = data.getCell('memoryUtilization', rowIndex);

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

    row.loadData();
    row.cells.forEach(cell => {
        cell.setValue();
    });
}
