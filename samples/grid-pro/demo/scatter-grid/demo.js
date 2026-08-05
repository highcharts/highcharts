// Generate test data with discrete X values and continuous Y values.
const getTestData = x => {
    const off = 0.2 + 0.2 * Math.random();
    const varMult = 0.5 + (0.5 * Math.random());
    return new Array(200).fill(1).map(() => [
        x,
        off + (Math.random() - 0.5) * (varMult * (Math.random() - 0.5))
    ]);
};

// Generate statistics from the test data
const getTestStatistics = datasets => {
    const columns = {
        sample: [],
        mean: [],
        var: [],
        sd: []
    };
    let i = 1;
    for (const dataset of datasets) {
        const mean = dataset.map(x => x[1])
            .reduce((sum, num) => sum + num, 0) / dataset.length;
        const variance = dataset.map(x => x[1])
            .reduce((sum, num) => sum + ((num - mean) ** 2)) /
            (dataset.length - 1);
        const standardDeviation = Math.sqrt(variance);

        columns.sample.push(i);
        columns.mean.push(mean);
        columns.var.push(variance);
        columns.sd.push(standardDeviation);
        i++;
    }
    return new Grid.DataTable({ columns });
};

const datasets = new Array(5).fill(1).map((_, i) =>
    getTestData(i)
);

let activeRow = null;

const fullChartOptions = {
    chart: {
        type: 'scatter'
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Scatter chart connected to a Grid'
    },
    xAxis: {
        categories: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5']
    },
    yAxis: {
        title: {
            text: 'Measurements'
        }
    },
    plotOptions: {
        scatter: {
            showInLegend: false,
            cursor: 'pointer',
            jitter: {
                x: 0.24
            },
            marker: {
                radius: 2,
                symbol: 'circle'
            },
            point: {
                events: {
                    click: function () {
                        // In the single-sample view there is only one series,
                        // and it is already the selected one.
                        if (activeRow === null) {
                            selectRow(this.series.index);
                        }
                    }
                }
            },
            tooltip: {
                pointFormat: 'Measurement: {point.y:.3f}'
            }
        }
    },
    series: datasets.map((dataset, i) => ({
        name: 'Sample ' + (i + 1),
        data: dataset,
        colorIndex: i
    }))
};

const chart = Highcharts.chart('chart-container', fullChartOptions);

const gridData = getTestStatistics(datasets);

const grid = Grid.grid('grid-container', {
    data: {
        dataTable: gridData
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    header: [
        {
            columnId: 'sample',
            format: 'Sample'
        }, {
            columnId: 'mean',
            format: 'Mean'
        }, {
            columnId: 'var',
            format: 'Variance'
        }, {
            columnId: 'sd',
            format: 'Standard Deviation'
        }
    ],
    columns: [{
        id: 'sample',
        cells: {
            format: '{value:.0f}'
        }
    }],
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    selectRow(this.row.id);
                },
                afterSetValue: function () {
                    setActiveRowStyle();
                }
            },
            format: '{value:.3f}'
        }
    }
});

document.getElementById('reset-selection')
    .addEventListener('click', () => {
        selectRow(null);
    });

// Selects a sample, either from the grid or from the chart. Pass null to
// clear the selection.
function selectRow(rowId) {
    if (activeRow === rowId) {
        return;
    }
    activeRow = rowId;

    setActiveRowStyle();
    updateChart();
}

function setActiveRowStyle() {
    grid.viewport?.rows.forEach(row => {
        const rowIsActive = (activeRow === row.id);
        row.cells.forEach(c => {
            c.htmlElement.classList.toggle('active-row', rowIsActive);
        });
    });
}

function getMinMax(datasets) {
    let min = Infinity;
    let max = -Infinity;

    for (const dataset of datasets) {
        for (const row of dataset) {
            if (row[1] < min) {
                min = row[1];
            }
            if (row[1] > max) {
                max = row[1];
            }
        }
    }
    return [min, max];
}

const minMax = getMinMax(datasets);

function updateChart() {
    if (activeRow === null) {
        // Revert chart options
        chart.update({
            xAxis: {
                categories: [
                    'Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'
                ],
                min: undefined,
                max: undefined,
                plotLines: undefined
            },
            yAxis: {
                title: {
                    text: 'Measurements'
                }
            },
            plotOptions: {
                scatter: {
                    jitter: {
                        x: 0.24,
                        y: 0
                    },
                    marker: {
                        radius: 2
                    }
                }
            },
            series: datasets.map((dataset, i) => ({
                name: 'Sample ' + (i + 1),
                data: dataset,
                colorIndex: i
            }))
        }, true, true);
    } else {
        // Set new chart options
        chart.update({
            xAxis: {
                categories: undefined,
                min: minMax[0],
                max: minMax[1],
                plotLines: [{
                    value: gridData.getCell('mean', activeRow),
                    width: 2,
                    label: {
                        text: 'mean',
                        allign: 'top'
                    },
                    dashStyle: 'dot',
                    zIndex: 5
                }]
            },
            yAxis: {
                title: {
                    text: 'Dataset ID'
                }
            },
            plotOptions: {
                scatter: {
                    showInLegend: false,
                    jitter: {
                        x: 0,
                        y: 0.3
                    },
                    marker: {
                        radius: 5
                    },
                    tooltip: {
                        pointFormat: 'Measurement: {point.x:.3f}'
                    }
                }
            },
            series: {
                data: datasets[activeRow].map(row => [row[1], row[0]]),
                colorIndex: activeRow
            }
        }, true, true);
    }
}
