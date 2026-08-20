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

const sampleCategories = [
    'Sample 1',
    'Sample 2',
    'Sample 3',
    'Sample 4',
    'Sample 5'
];

const chartAnimation = {
    duration: 500
};

let activeRow = null;

function getOverviewData(sampleIndex) {
    return datasets[sampleIndex].map((row, pointIndex) => ({
        id: `${sampleIndex}-${pointIndex}`,
        x: row[0],
        y: row[1]
    }));
}

function getSelectedData(sampleIndex, idSampleIndex = sampleIndex) {
    return datasets[sampleIndex].map((row, pointIndex) => ({
        id: `${idSampleIndex}-${pointIndex}`,
        x: row[1],
        y: row[0]
    }));
}

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
        categories: sampleCategories
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
                        // Only select a sample from the overview.
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
    series: datasets.map((_, i) => ({
        name: 'Sample ' + (i + 1),
        data: getOverviewData(i),
        colorIndex: i
    }))
};

const chart = Highcharts.chart('chart-container', fullChartOptions);

const gridData = getTestStatistics(datasets);

const resetSelectionButton = document.getElementById('reset-selection');

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
                const rowIsActive = (activeRow === this.value - 1);
                this.row.htmlElement.classList.toggle(
                    'active-row',
                    rowIsActive
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

resetSelectionButton.disabled = true;

resetSelectionButton.addEventListener('click', () => {
    selectRow(null);
});

// Selects a sample, either from the grid or from the chart. Pass null to
// clear the selection.
function selectRow(rowId) {
    const previousRow = activeRow;

    activeRow = rowId;

    setActiveRowStyle();
    resetSelectionButton.disabled = activeRow === null;
    updateChart(previousRow);
}

function setActiveRowStyle() {
    grid.viewport?.rows.forEach(row => {
        const rowIsActive = (activeRow === row.id);
        row.htmlElement.classList.toggle('active-row', rowIsActive);
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

function setSeriesOptions(series, selectedView) {
    series.options.cursor = selectedView ? 'default' : 'pointer';
    series.options.jitter = selectedView ? {
        x: 0,
        y: 0.3
    } : {
        x: 0.24,
        y: 0
    };
    series.options.marker.radius = selectedView ? 5 : 2;
    series.tooltipOptions.pointFormat = selectedView ?
        'Measurement: {point.x:.3f}' :
        'Measurement: {point.y:.3f}';

    [series.tracker, series.markerGroup].forEach(group => {
        group?.css({
            cursor: series.options.cursor
        });
    });
}

function setSeriesOpacity(series, opacity) {
    [
        series.group,
        series.markerGroup,
        series.tracker,
        ...(series.dataLabelsGroups || [])
    ].forEach(group => {
        group?.attr({ opacity });
    });
}

function updateChart(previousRow) {
    if (activeRow === null) {
        const animatedSeries = chart.series[previousRow];

        animatedSeries?.setVisible(false, false);

        // Revert chart options
        chart.update({
            xAxis: {
                categories: sampleCategories,
                min: undefined,
                max: undefined,
                plotLines: undefined
            },
            yAxis: {
                visible: true
            }
        }, false, false, chartAnimation);

        chart.series.forEach((series, i) => {
            setSeriesOptions(series, false);

            if (series !== animatedSeries) {
                series.setData(getOverviewData(i), false, false, true);
                series.setVisible(true, false);
            }
        });

        if (animatedSeries) {
            chart.redraw(false);
            animatedSeries.setVisible(true, false);
            animatedSeries.setData(
                getOverviewData(previousRow),
                false,
                chartAnimation,
                true
            );
        }
    } else {
        const previousSeries = previousRow === null ?
            null :
            chart.series[previousRow];
        const activeSeries = chart.series[activeRow];

        if (previousSeries && previousRow !== activeRow) {
            activeSeries.setVisible(true, false);
            setSeriesOpacity(activeSeries, 0);
            setSeriesOptions(activeSeries, true);
            activeSeries.setData(
                getSelectedData(previousRow, activeRow),
                false,
                false,
                true
            );
            chart.redraw(false);

            previousSeries.setVisible(false, false);
            setSeriesOpacity(activeSeries, 1);
        }

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
                        verticalAlign: 'top'
                    },
                    dashStyle: 'dot',
                    zIndex: 5
                }]
            },
            yAxis: {
                visible: false
            }
        }, false, false, chartAnimation);

        chart.series.forEach((series, i) => {
            const isActive = activeRow === i;

            setSeriesOptions(series, isActive);

            if (isActive) {
                series.setVisible(true, false);
                series.setData(getSelectedData(i), false, chartAnimation, true);
            } else if (series.visible) {
                series.setData(getOverviewData(i), false, false, true);
                series.setVisible(false, false);
            }
        });
    }

    chart.redraw(chartAnimation);
}
