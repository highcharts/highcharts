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
    const reMatrix = [];
    let i = 0;
    for (const dataset of datasets) {
        const mean = dataset.map(x => x[1])
            .reduce((sum, num) => sum + num, 0) / dataset.length;
        const variance = dataset.map(x => x[1])
            .reduce((sum, num) => sum + ((num - mean) ** 2)) /
            (dataset.length - 1);
        const standardDeviation = Math.sqrt(variance);
        reMatrix.push([i, mean, variance, standardDeviation]);
        i++;
    }
    return reMatrix;
};

const datasets = new Array(5).fill(1).map((_, i) =>
    getTestData(i)
);

// Transpose 2d list. Workaround for column-only data assignment
const transpose = matrix => {
    const reMatrix = Array(matrix[0].length).fill(0).map(() => Array(5));
    for (let i = 0; i < matrix.length; i += 1) {
        for (let j = 0; j < matrix[0].length; j += 1) {
            reMatrix[j][i] = matrix[i][j];
        }
    }
    return reMatrix;
};


// Make all the colors semi-transparent so we can see overlapping dots
const colors = Highcharts.getOptions().colors.map(color =>
    Highcharts.color(color).setOpacity(0.5).get()
);

let activeRow = null;

const fullChartOptions = {
    chart: {
        type: 'scatter'
    },

    colors,

    title: {
        text: 'Scatter chart with jitter'
    },

    xAxis: {
        categories: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5']
    },

    yAxis: {
        title: {
            text: 'Measurements'
        }
    },

    plotOptions: {
        scatter: {
            showInLegend: false,
            jitter: {
                x: 0.24
            },
            marker: {
                radius: 2,
                symbol: 'circle'
            },
            tooltip: {
                pointFormat: 'Measurement: {point.y:.3f}'
            }
        }
    },
    series: [{
        name: 'Run 1',
        data: datasets[0],
        colorIndex: 0
    }, {
        name: 'Run 2',
        data: datasets[1],
        colorIndex: 1
    }, {
        name: 'Run 3',
        data: datasets[2],
        colorIndex: 2
    }, {
        name: 'Run 4',
        data: datasets[3],
        colorIndex: 3
    }, {
        name: 'Run 5',
        data: datasets[4],
        colorIndex: 4
    }]
};

let chart = Highcharts.chart('chart-container', fullChartOptions);

const gridData = transpose(getTestStatistics(datasets));

Grid.grid('grid-container', {
    data: {
        columns: {
            dID: gridData[0],
            mean: gridData[1],
            var: gridData[2],
            sd: gridData[3]
        }
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    header: [
        {
            columnId: 'dID',
            format: 'Dataset ID'
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
        id: 'dID',
        cells: {
            format: '{value:.0f}'
        }
    }],
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    const rowId = this.row.id;

                    if (activeRow === rowId) {
                        activeRow = null;
                    } else {
                        activeRow = rowId;
                    }

                    setActiveRowStyle(this);
                    updateChart();
                },
                afterSetValue: function () {
                    setActiveRowStyle(this);
                }
            },
            format: '{value:.3f}'
        }
    }
});

function setActiveRowStyle(cell) {
    cell.row.viewport.rows.forEach(row => {
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
        chart = Highcharts.chart('chart-container', fullChartOptions);
    } else {
        chart.update({
            chart: {
                type: 'scatter'
            },
            xAxis: {
                categories: undefined,
                min: minMax[0],
                max: minMax[1],
                plotLines: [{
                    value: gridData[1][activeRow],
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
                        radius: 5,
                        symbol: 'circle'
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
