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

function percentileZ(p) {
    if (p < 0.5) {
        return -percentileZ(1 - p);
    }

    if (p > 0.92) {
        if (p === 1) {
            return Infinity;
        }
        const r = Math.sqrt(-Math.log(1 - p));
        return (((2.3212128 * r + 4.8501413) * r - 2.2979648) * r - 2.7871893) /
               ((1.6370678 * r + 3.5438892) * r + 1);
    }
    p -= 0.5;
    const r = p * p;
    return p * (((-25.4410605 * r + 41.3911977) * r - 18.6150006) *
           r + 2.5066282) / ((((3.1308291 * r - 21.0622410) * r + 23.0833674) *
           r - 8.4735109) * r + 1);
}

// Two-sample Kolmogorov-Smirnov test: compares two 1-dimensional samples and
// returns the maximum distance between their empirical CDFs (`statistic`)
// along with the probability of observing that distance under the null
// hypothesis that both samples are drawn from the same distribution
// (`pValue`). A low p-value indicates the samples likely come from different
// distributions.
function kolmogorovSmirnovTest(sample1, sample2) {
    const sorted1 = [...sample1].sort((a, b) => a - b);
    const sorted2 = [...sample2].sort((a, b) => a - b);
    const n1 = sorted1.length;
    const n2 = sorted2.length;

    let i1 = 0;
    let i2 = 0;
    let cdf1 = 0;
    let cdf2 = 0;
    let statistic = 0;

    while (i1 < n1 && i2 < n2) {
        const v1 = sorted1[i1];
        const v2 = sorted2[i2];
        if (v1 <= v2) {
            do {
                i1++;
            } while (i1 < n1 && sorted1[i1] === v1);
            cdf1 = i1 / n1;
        }
        if (v2 <= v1) {
            do {
                i2++;
            } while (i2 < n2 && sorted2[i2] === v2);
            cdf2 = i2 / n2;
        }
        statistic = Math.max(statistic, Math.abs(cdf1 - cdf2));
    }

    const effectiveN = Math.sqrt((n1 * n2) / (n1 + n2));
    const pValue = kolmogorovDistribution(
        (effectiveN + 0.12 + 0.11 / effectiveN) * statistic
    );

    return { statistic, pValue };
}

// Asymptotic complementary Kolmogorov distribution Q(lambda), used to convert
// the KS statistic into a p-value (Marsaglia, Tsang & Wang, 2003).
function kolmogorovDistribution(lambda) {
    if (lambda < 0.2) {
        return 1;
    }
    let sum = 0;
    let sign = 1;
    for (let k = 1; k <= 100; k++) {
        const term = sign * Math.exp(-2 * k * k * lambda * lambda);
        sum += term;
        if (Math.abs(term) < 1e-10) {
            break;
        }
        sign = -sign;
    }
    return Math.min(Math.max(2 * sum, 0), 1);
}

const getQQData = dataset => {
    const data = dataset;
    data.sort(function (a, b) {
        return a - b;
    });
    const ranks = data.map((_, i) => i + 1);
    const probabilities = ranks.map(i => (i - 0.375) / (ranks.length + 0.25));
    const theoreticalQuantiles = probabilities.map(p => percentileZ(p));
    return data.map((x, i) => [theoreticalQuantiles[i], x]);
};

const datasets = new Array(5).fill(1).map((_, i) =>
    getTestData(i)
);

// Make all the colors semi-transparent so we can see overlapping dots
const colors = Highcharts.getOptions().colors.map(color =>
    Highcharts.color(color).setOpacity(0.5).get()
);

// One row of statistics per dataset: [dataset ID, mean, variance, sd]
const statistics = getTestStatistics(datasets);

// Row ids of the datasets currently shown in the detail chart (at most 2).
const activeRows = [];
let board;

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
                x: 0.24,
                y: 0
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

// Hardcoded data for the 4 supporting plots shown next to the detail chart.
const scatterPlotOptions = [
    {
        title: { text: '' },
        data: []
    },
    {
        title: { text: '' },
        data: []
    }
].map((options, i) => ({
    chart: {
        type: 'scatter',
        height: 180
    },
    title: options.title,
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: options.data,
        colorIndex: i
    }]
}));

const histogramPlotOptions = [
    {
        title: { text: '' },
        data: []
    },
    {
        title: { text: '' },
        data: []
    }
].map((options, i) => ({
    chart: {
        type: 'column',
        height: 180
    },
    title: options.title,
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    series: [{
        type: 'scatter',
        data: options.data,
        id: `histogram-base-${i}`,
        visible: false
    }, {
        type: 'histogram',
        baseSeries: `histogram-base-${i}`,
        colorIndex: i,
        binsNumber: 10
    }]
}));

const detailChartPlaceholderOptions = {
    chart: {
        type: 'scatter'
    },
    title: {
        text: 'Dataset detail'
    },
    subtitle: {
        text: 'Click a row in the grid to inspect its raw measurements'
    },
    xAxis: {
        min: null,
        max: null,
        plotLines: []
    },
    yAxis: {
        title: {
            text: 'Measurements'
        }
    },
    series: []
};

async function setupBoard() {
    board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'statistics',
                type: 'JSON',
                data: [
                    ['dID', 'mean', 'var', 'sd'],
                    ...statistics
                ]
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'chart-overview'
                    }]
                }, {
                    cells: [{
                        id: 'grid-container'
                    }, {
                        id: 'info-panel',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'info-scatter-1'
                                }, {
                                    id: 'info-scatter-2'
                                }]
                            }, {
                                cells: [{
                                    id: 'info-hist-1'
                                }, {
                                    id: 'info-hist-2'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'chart-detail'
                    }, {
                        id: 'chart-detail-info'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'chart-overview',
            type: 'Highcharts',
            chartOptions: fullChartOptions
        }, {
            renderTo: 'chart-detail',
            type: 'Highcharts',
            chartOptions: detailChartPlaceholderOptions
        }, {
            renderTo: 'chart-detail-info',
            type: 'KPI',
            title: 'Kolmogorov-Smirnov Test over the selected datasets:',
            valueFormat: 'P-Value: {value}'
        }, {
            renderTo: 'info-scatter-1',
            type: 'Highcharts',
            chartOptions: scatterPlotOptions[0]
        }, {
            renderTo: 'info-scatter-2',
            type: 'Highcharts',
            chartOptions: scatterPlotOptions[1]
        }, {
            renderTo: 'info-hist-1',
            type: 'Highcharts',
            chartOptions: histogramPlotOptions[0]
        }, {
            renderTo: 'info-hist-2',
            type: 'Highcharts',
            chartOptions: histogramPlotOptions[1]
        }, {
            renderTo: 'grid-container',
            type: 'Grid',
            connector: {
                id: 'statistics'
            },
            gridOptions: {
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
                                const activeIndex = activeRows.indexOf(rowId);

                                if (activeIndex !== -1) {
                                    activeRows.splice(activeIndex, 1);
                                } else if (activeRows.length < 2) {
                                    activeRows.push(rowId);
                                }
                                // Else: 2 datasets are already focused, and
                                // this row isn't one of them, so ignore.

                                setActiveRowStyle(this);
                                updateChart();
                            },
                            afterSetValue: function () {
                                setActiveRowStyle(this);
                            },
                            mouseOver: function () {
                                highlightSeries(this.row.id);
                            },
                            mouseOut: function () {
                                highlightSeries(null);
                            }
                        },
                        format: '{value:.3f}'
                    }
                }
            }
        }]
    });
}

setupBoard();

function highlightSeries(rowId) {
    const chart = board.getComponentByCellId('chart-overview').chart;

    chart.series.forEach(series => {
        series.setState(
            rowId === null ? '' :
                (series.colorIndex === Number(rowId) ? 'hover' : 'inactive')
        );
    });
}

function setActiveRowStyle(cell) {
    cell.row.viewport.rows.forEach(row => {
        const rowIsActive = activeRows.includes(row.id);
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

// chart.update({series: {data: []}}) is a no-op: options diffing can't see
// an empty array as a change, so it drops `data` before it reaches the
// series. Clearing must go through setData() directly.
function clearSeries(chart) {
    chart.series[0].setData([], true);
}

// Runs the KS test on the two active datasets and shows the result in the
// KPI component, or clears it when fewer than 2 datasets are selected.
function updateKpi() {
    const kpi = board.getComponentByCellId('chart-detail-info');

    if (activeRows.length < 2) {
        kpi.update({
            // valueFormat: '',
            value: null
        });
        console.log('h');
        return;
    }

    const sample1 = datasets[activeRows[0]].map(row => row[1]);
    const sample2 = datasets[activeRows[1]].map(row => row[1]);
    const { pValue } = kolmogorovSmirnovTest(sample1, sample2);

    kpi.update({
        // valueFormat: 'P-Value: {value:.3f}',
        value: pValue
    });
}

function updateChart() {
    const detailChart = board.getComponentByCellId('chart-detail').chart;
    const qq1 = board.getComponentByCellId('info-scatter-1').chart;
    const qq2 = board.getComponentByCellId('info-scatter-2').chart;
    const hist1 = board.getComponentByCellId('info-hist-1').chart;
    const hist2 = board.getComponentByCellId('info-hist-2').chart;

    if (activeRows.length === 0) {
        detailChart.update(detailChartPlaceholderOptions, true, true);
        clearSeries(qq1);
        clearSeries(qq2);
        clearSeries(hist1);
        clearSeries(hist2);
        updateKpi();
        return;
    }

    const runNames = activeRows.map(rowId => `Run ${Number(rowId) + 1}`);

    detailChart.update({
        chart: {
            type: 'scatter'
        },
        title: {
            text: `${runNames.join(' vs ')} detail`
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            min: minMax[0],
            max: minMax[1],
            plotLines: activeRows.map((rowId, i) => ({
                value: statistics[rowId][1],
                width: 2,
                color: Highcharts.getOptions().colors[Number(rowId)],
                label: {
                    text: `${runNames[i]} mean`,
                    allign: 'top'
                },
                dashStyle: 'dash',
                zIndex: 5
            }))
        },
        yAxis: [{
            visible: false
        },
        {
            title: {
                text: 'Distribution'
            }
        }],
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
                    pointFormat: '{series.name} measurement: {point.x:.3f}'
                },
                opacity: 0.5
            }
        },
        series: activeRows.map((rowId, i) => ({
            name: runNames[i] + ' distribution',
            type: 'bellcurve',
            data: datasets[rowId].map(row => row[1]),
            colorIndex: Number(rowId),
            yAxis: 1

        }))
    }, true, true);

    qq1.update({
        series: {
            data: getQQData(datasets[activeRows[0]].map(row => row[1]))
        }
    });
    hist1.update({
        series: {
            data: datasets[activeRows[0]].map(row => row[1])
        }
    });

    if (activeRows.length === 2) {
        qq2.update({
            series: {
                data: getQQData(datasets[activeRows[1]].map(row => row[1]))
            }
        });
        hist2.update({
            series: {
                data: datasets[activeRows[1]].map(row => row[1])
            }
        });
    } else {
        clearSeries(qq2);
        clearSeries(hist2);
    }

    updateKpi();
}
