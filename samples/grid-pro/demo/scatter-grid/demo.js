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
            formatter() {
                this.row.htmlElement.style.setProperty(
                    '--active-row-color',
                    chart.options.colors[this.value - 1]
                );
                return this.value;
            }
        }
    }],
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    selectRow(this.row.id);
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
    activeRow = rowId;

    setActiveRowStyle();
    updateChart();
}

function setActiveRowStyle() {
    grid.viewport?.rows.forEach(row => {
        const rowIsActive = (activeRow === row.id);
        row.htmlElement.classList.toggle('active-row', rowIsActive);
    });
}

function updateChart() {
    if (activeRow === null) {
        // Revert chart options
        chart.update({
            chart: {
                inverted: false
            },
            xAxis: {
                min: undefined,
                max: undefined
            },
            yAxis: {
                plotLines: []
            }
        });
    } else {
        // Zoom the x-axis to the selected sample, flip it, and add a plot line
        // for the mean value.
        const meanValue = gridData.getCell('mean', activeRow);
        chart.update({
            chart: {
                inverted: true
            },
            xAxis: {
                min: activeRow,
                max: activeRow
            },
            yAxis: {
                plotLines: [{
                    value: gridData.getCell('mean', activeRow),
                    width: 2,
                    label: {
                        text: `Mean: ${meanValue.toFixed(3)}`,
                        align: 'top'
                    },
                    dashStyle: 'dot',
                    zIndex: 5
                }]
            }
        });
    }
}
