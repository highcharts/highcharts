const colors = Highcharts.getOptions().colors;

const colorFromPlant = name => {
    switch (name) {
    case 'iris-setosa':
        return 0;
    case 'iris-versicolor':
        return 1;
    case 'iris-virginica':
        return 2;
    default:
        return 3;
    }
};

function createChart(dataset) {
    Highcharts.setOptions({
        title: {
            align: 'left',
            style: {
                fontSize: '1em'
            }
        },
        chart: {
            spacing: 10
        },
        credits: {
            enabled: false
        }
    });

    const variables = [
        'Sepal length',
        'Sepal width',
        'Petal length',
        'Petal width'
    ];
    const categories = 'Plant';

    // 'Color' column so each point can be colored individually.
    const columnIds = [...variables, categories, 'Color'];
    const plantIndex = columnIds.indexOf(categories);
    const data = dataset.map(row => [
        ...row,
        colors[colorFromPlant(String(row[plantIndex]).toLowerCase())]
    ]);

    // Build the layout rows/cells and the matching components with a double
    // loop, so the grid scales automatically with `variables`.
    const rows = [];
    const components = [];

    variables.forEach((yVar, i) => {
        const cells = [];

        variables.forEach((xVar, j) => {
            const cellId = `cell-${i}-${j}`;
            const isBottomRow = i === variables.length - 1;
            const isLeftColumn = j === 0;

            cells.push({ id: cellId });

            if (i === j) {
                components.push({
                    renderTo: cellId,
                    type: 'Highcharts',
                    connector: {
                        id: 'iris',
                        columnAssignment: [{
                            seriesId: cellId,
                            data: yVar
                        }]
                    },
                    chartOptions: {
                        chart: {
                            type: 'histogram',
                            height: '100%'
                        },
                        title: {
                            text: null
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis: {
                            title: {
                                // Only label the bottom row
                                text: isBottomRow ? xVar : null
                            }
                        },
                        yAxis: {
                            title: {
                                // Only label the leftmost column
                                text: isLeftColumn ? yVar : null
                            }
                        },
                        plotOptions: {
                            histogram: {
                                binsNumber: 10,
                                enableMouseTracking: false
                            }
                        }
                    }
                });
            } else {
                components.push({
                    renderTo: cellId,
                    type: 'Highcharts',
                    connector: {
                        id: 'iris',
                        columnAssignment: [{
                            seriesId: cellId,
                            data: {
                                x: xVar,
                                y: yVar,
                                color: 'Color'
                            }
                        }]
                    },
                    chartOptions: {
                        chart: {
                            type: 'scatter',
                            height: 220
                        },
                        title: {
                            text: null
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis: {
                            title: {
                                // Only label the bottom row, keeping it tidy
                                text: isBottomRow ? xVar : null
                            }
                        },
                        yAxis: {
                            title: {
                                // Only label the leftmost column
                                text: isLeftColumn ? yVar : null
                            }
                        },
                        tooltip: {
                            headerFormat: '',
                            pointFormat:
                                `${xVar}: <b>{point.x}</b><br>` +
                                `${yVar}: <b>{point.y}</b>`
                        },
                        plotOptions: {
                            scatter: {
                                marker: {
                                    radius: 3
                                },
                                enableMouseTracking: false
                            }
                        }
                    }
                });
            }
        });

        rows.push({ cells });
    });

    // Keep a full data grid of the dataset below the scatterplot matrix.
    rows.push({
        cells: [{
            id: 'data-grid'
        }]
    });
    components.push({
        renderTo: 'data-grid',
        type: 'Grid',
        connector: {
            id: 'iris'
        },
        gridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                // Hide the derived color column from the grid
                id: 'Color',
                enabled: false
            }]
        }
    });

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'iris',
                type: 'JSON',
                firstRowAsNames: false,
                columnIds,
                data
            }]
        },
        gui: {
            layouts: [{
                rows
            }]
        },
        components
    }, true);
}

// Sepal length, sepal width, petal length, petal width, plant
const dataset = [
    [5.1, 3.5, 1.4, 0.2, 'Iris-setosa'],
    [4.9, 3.0, 1.4, 0.2, 'Iris-setosa'],
    [4.7, 3.2, 1.3, 0.2, 'Iris-setosa'],
    [4.6, 3.1, 1.5, 0.2, 'Iris-setosa'],
    [5.0, 3.6, 1.4, 0.2, 'Iris-setosa'],
    [5.4, 3.9, 1.7, 0.4, 'Iris-setosa'],
    [4.6, 3.4, 1.4, 0.3, 'Iris-setosa'],
    [5.0, 3.4, 1.5, 0.2, 'Iris-setosa'],
    [4.4, 2.9, 1.4, 0.2, 'Iris-setosa'],
    [4.9, 3.1, 1.5, 0.1, 'Iris-setosa'],
    [5.4, 3.7, 1.5, 0.2, 'Iris-setosa'],
    [4.8, 3.4, 1.6, 0.2, 'Iris-setosa'],
    [4.8, 3.0, 1.4, 0.1, 'Iris-setosa'],
    [4.3, 3.0, 1.1, 0.1, 'Iris-setosa'],
    [5.8, 4.0, 1.2, 0.2, 'Iris-setosa'],
    [5.7, 4.4, 1.5, 0.4, 'Iris-setosa'],
    [5.4, 3.9, 1.3, 0.4, 'Iris-setosa'],
    [5.1, 3.5, 1.4, 0.3, 'Iris-setosa'],
    [5.7, 3.8, 1.7, 0.3, 'Iris-setosa'],
    [5.1, 3.8, 1.5, 0.3, 'Iris-setosa'],
    [5.4, 3.4, 1.7, 0.2, 'Iris-setosa'],
    [5.1, 3.7, 1.5, 0.4, 'Iris-setosa'],
    [4.6, 3.6, 1.0, 0.2, 'Iris-setosa'],
    [5.1, 3.3, 1.7, 0.5, 'Iris-setosa'],
    [4.8, 3.4, 1.9, 0.2, 'Iris-setosa'],
    [5.0, 3.0, 1.6, 0.2, 'Iris-setosa'],
    [5.0, 3.4, 1.6, 0.4, 'Iris-setosa'],
    [5.2, 3.5, 1.5, 0.2, 'Iris-setosa'],
    [5.2, 3.4, 1.4, 0.2, 'Iris-setosa'],
    [4.7, 3.2, 1.6, 0.2, 'Iris-setosa'],
    [4.8, 3.1, 1.6, 0.2, 'Iris-setosa'],
    [5.4, 3.4, 1.5, 0.4, 'Iris-setosa'],
    [5.2, 4.1, 1.5, 0.1, 'Iris-setosa'],
    [5.5, 4.2, 1.4, 0.2, 'Iris-setosa'],
    [4.9, 3.1, 1.5, 0.1, 'Iris-setosa'],
    [5.0, 3.2, 1.2, 0.2, 'Iris-setosa'],
    [5.5, 3.5, 1.3, 0.2, 'Iris-setosa'],
    [4.9, 3.1, 1.5, 0.1, 'Iris-setosa'],
    [4.4, 3.0, 1.3, 0.2, 'Iris-setosa'],
    [5.1, 3.4, 1.5, 0.2, 'Iris-setosa'],
    [5.0, 3.5, 1.3, 0.3, 'Iris-setosa'],
    [4.5, 2.3, 1.3, 0.3, 'Iris-setosa'],
    [4.4, 3.2, 1.3, 0.2, 'Iris-setosa'],
    [5.0, 3.5, 1.6, 0.6, 'Iris-setosa'],
    [5.1, 3.8, 1.9, 0.4, 'Iris-setosa'],
    [4.8, 3.0, 1.4, 0.3, 'Iris-setosa'],
    [5.1, 3.8, 1.6, 0.2, 'Iris-setosa'],
    [4.6, 3.2, 1.4, 0.2, 'Iris-setosa'],
    [5.3, 3.7, 1.5, 0.2, 'Iris-setosa'],
    [5.0, 3.3, 1.4, 0.2, 'Iris-setosa'],
    [7.0, 3.2, 4.7, 1.4, 'Iris-versicolor'],
    [6.4, 3.2, 4.5, 1.5, 'Iris-versicolor'],
    [6.9, 3.1, 4.9, 1.5, 'Iris-versicolor'],
    [5.5, 2.3, 4.0, 1.3, 'Iris-versicolor'],
    [6.5, 2.8, 4.6, 1.5, 'Iris-versicolor'],
    [5.7, 2.8, 4.5, 1.3, 'Iris-versicolor'],
    [6.3, 3.3, 4.7, 1.6, 'Iris-versicolor'],
    [4.9, 2.4, 3.3, 1.0, 'Iris-versicolor'],
    [6.6, 2.9, 4.6, 1.3, 'Iris-versicolor'],
    [5.2, 2.7, 3.9, 1.4, 'Iris-versicolor'],
    [5.0, 2.0, 3.5, 1.0, 'Iris-versicolor'],
    [5.9, 3.0, 4.2, 1.5, 'Iris-versicolor'],
    [6.0, 2.2, 4.0, 1.0, 'Iris-versicolor'],
    [6.1, 2.9, 4.7, 1.4, 'Iris-versicolor'],
    [5.6, 2.9, 3.6, 1.3, 'Iris-versicolor'],
    [6.7, 3.1, 4.4, 1.4, 'Iris-versicolor'],
    [5.6, 3.0, 4.5, 1.5, 'Iris-versicolor'],
    [5.8, 2.7, 4.1, 1.0, 'Iris-versicolor'],
    [6.2, 2.2, 4.5, 1.5, 'Iris-versicolor'],
    [5.6, 2.5, 3.9, 1.1, 'Iris-versicolor'],
    [5.9, 3.2, 4.8, 1.8, 'Iris-versicolor'],
    [6.1, 2.8, 4.0, 1.3, 'Iris-versicolor'],
    [6.3, 2.5, 4.9, 1.5, 'Iris-versicolor'],
    [6.1, 2.8, 4.7, 1.2, 'Iris-versicolor'],
    [6.4, 2.9, 4.3, 1.3, 'Iris-versicolor'],
    [6.6, 3.0, 4.4, 1.4, 'Iris-versicolor'],
    [6.8, 2.8, 4.8, 1.4, 'Iris-versicolor'],
    [6.7, 3.0, 5.0, 1.7, 'Iris-versicolor'],
    [6.0, 2.9, 4.5, 1.5, 'Iris-versicolor'],
    [5.7, 2.6, 3.5, 1.0, 'Iris-versicolor'],
    [5.5, 2.4, 3.8, 1.1, 'Iris-versicolor'],
    [5.5, 2.4, 3.7, 1.0, 'Iris-versicolor'],
    [5.8, 2.7, 3.9, 1.2, 'Iris-versicolor'],
    [6.0, 2.7, 5.1, 1.6, 'Iris-versicolor'],
    [5.4, 3.0, 4.5, 1.5, 'Iris-versicolor'],
    [6.0, 3.4, 4.5, 1.6, 'Iris-versicolor'],
    [6.7, 3.1, 4.7, 1.5, 'Iris-versicolor'],
    [6.3, 2.3, 4.4, 1.3, 'Iris-versicolor'],
    [5.6, 3.0, 4.1, 1.3, 'Iris-versicolor'],
    [5.5, 2.5, 4.0, 1.3, 'Iris-versicolor'],
    [5.5, 2.6, 4.4, 1.2, 'Iris-versicolor'],
    [6.1, 3.0, 4.6, 1.4, 'Iris-versicolor'],
    [5.8, 2.6, 4.0, 1.2, 'Iris-versicolor'],
    [5.0, 2.3, 3.3, 1.0, 'Iris-versicolor'],
    [5.6, 2.7, 4.2, 1.3, 'Iris-versicolor'],
    [5.7, 3.0, 4.2, 1.2, 'Iris-versicolor'],
    [5.7, 2.9, 4.2, 1.3, 'Iris-versicolor'],
    [6.2, 2.9, 4.3, 1.3, 'Iris-versicolor'],
    [5.1, 2.5, 3.0, 1.1, 'Iris-versicolor'],
    [5.7, 2.8, 4.1, 1.3, 'Iris-versicolor'],
    [6.3, 3.3, 6.0, 2.5, 'Iris-virginica'],
    [5.8, 2.7, 5.1, 1.9, 'Iris-virginica'],
    [7.1, 3.0, 5.9, 2.1, 'Iris-virginica'],
    [6.3, 2.9, 5.6, 1.8, 'Iris-virginica'],
    [6.5, 3.0, 5.8, 2.2, 'Iris-virginica'],
    [7.6, 3.0, 6.6, 2.1, 'Iris-virginica'],
    [4.9, 2.5, 4.5, 1.7, 'Iris-virginica'],
    [7.3, 2.9, 6.3, 1.8, 'Iris-virginica'],
    [6.7, 2.5, 5.8, 1.8, 'Iris-virginica'],
    [7.2, 3.6, 6.1, 2.5, 'Iris-virginica'],
    [6.5, 3.2, 5.1, 2.0, 'Iris-virginica'],
    [6.4, 2.7, 5.3, 1.9, 'Iris-virginica'],
    [6.8, 3.0, 5.5, 2.1, 'Iris-virginica'],
    [5.7, 2.5, 5.0, 2.0, 'Iris-virginica'],
    [5.8, 2.8, 5.1, 2.4, 'Iris-virginica'],
    [6.4, 3.2, 5.3, 2.3, 'Iris-virginica'],
    [6.5, 3.0, 5.5, 1.8, 'Iris-virginica'],
    [7.7, 3.8, 6.7, 2.2, 'Iris-virginica'],
    [7.7, 2.6, 6.9, 2.3, 'Iris-virginica'],
    [6.0, 2.2, 5.0, 1.5, 'Iris-virginica'],
    [6.9, 3.2, 5.7, 2.3, 'Iris-virginica'],
    [5.6, 2.8, 4.9, 2.0, 'Iris-virginica'],
    [7.7, 2.8, 6.7, 2.0, 'Iris-virginica'],
    [6.3, 2.7, 4.9, 1.8, 'Iris-virginica'],
    [6.7, 3.3, 5.7, 2.1, 'Iris-virginica'],
    [7.2, 3.2, 6.0, 1.8, 'Iris-virginica'],
    [6.2, 2.8, 4.8, 1.8, 'Iris-virginica'],
    [6.1, 3.0, 4.9, 1.8, 'Iris-virginica'],
    [6.4, 2.8, 5.6, 2.1, 'Iris-virginica'],
    [7.2, 3.0, 5.8, 1.6, 'Iris-virginica'],
    [7.4, 2.8, 6.1, 1.9, 'Iris-virginica'],
    [7.9, 3.8, 6.4, 2.0, 'Iris-virginica'],
    [6.4, 2.8, 5.6, 2.2, 'Iris-virginica'],
    [6.3, 2.8, 5.1, 1.5, 'Iris-virginica'],
    [6.1, 2.6, 5.6, 1.4, 'Iris-virginica'],
    [7.7, 3.0, 6.1, 2.3, 'Iris-virginica'],
    [6.3, 3.4, 5.6, 2.4, 'Iris-virginica'],
    [6.4, 3.1, 5.5, 1.8, 'Iris-virginica'],
    [6.0, 3.0, 4.8, 1.8, 'Iris-virginica'],
    [6.9, 3.1, 5.4, 2.1, 'Iris-virginica'],
    [6.7, 3.1, 5.6, 2.4, 'Iris-virginica'],
    [6.9, 3.1, 5.1, 2.3, 'Iris-virginica'],
    [5.8, 2.7, 5.1, 1.9, 'Iris-virginica'],
    [6.8, 3.2, 5.9, 2.3, 'Iris-virginica'],
    [6.7, 3.3, 5.7, 2.5, 'Iris-virginica'],
    [6.7, 3.0, 5.2, 2.3, 'Iris-virginica'],
    [6.3, 2.5, 5.0, 1.9, 'Iris-virginica'],
    [6.5, 3.0, 5.2, 2.0, 'Iris-virginica'],
    [6.2, 3.4, 5.4, 2.3, 'Iris-virginica'],
    [5.9, 3.0, 5.1, 1.8, 'Iris-virginica']
];

createChart(dataset);