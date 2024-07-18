const csvData = document.getElementById('csv').innerHTML;

const firstYear = 2002;
const lastYear = 2022;

const dataModifier = {
    type: 'Range',
    ranges: [{
        column: 'Year',
        minValue: firstYear,
        maxValue: lastYear
    }]
};


function createColumnAssignment(columnNames) {
    return columnNames.map(function (column) {
        return {
            seriesId: column,
            data: ['Year', column]
        };
    });
}


Highcharts.setOptions({
    chart: {
        type: 'line'
    },
    yAxis: {
        max: 5,
        min: -1
    },
    xAxis: {
        min: firstYear,
        max: lastYear
    },
    tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.2f}%</b><br/> ' +
            'population growth in {point.x}'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    }
});

const asiaChart = {
    type: 'Highcharts',
    renderTo: 'asia-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: createColumnAssignment(
            ['China', 'Japan', 'India', 'Indonesia']
        )
    },
    chartOptions: {
        title: {
            text: 'Asia'
        }
    }
};

const northAmericaChart = {
    renderTo: 'north-america-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: createColumnAssignment(
            ['Mexico', 'Guatemala', 'Canada', 'United States']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'North America'
        }
    }
};

const southAmericaChart = {
    renderTo: 'south-america-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: createColumnAssignment(
            ['Brazil', 'Argentina', 'Uruguay', 'Paraguay']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'South America'
        }
    }
};

const legendChart = {
    type: 'Highcharts',
    renderTo: 'legend',
    connector: {
        id: 'population-growth'
    },
    columnAssignment: {
        Brazil: 'y',
        Argentina: 'y',
        Uruguay: 'y',
        Paraguay: 'y',
        'United States': 'y',
        Canada: 'y',
        Mexico: 'y',
        Guatemala: 'y',
        China: 'y',
        Japan: 'y',
        India: 'y',
        Indonesia: 'y'
    },
    chartOptions: {
        chart: {
            height: 200
        },
        title: {
            text: 'Countries population growth by year'
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 0,
                states: {
                    hover: {
                        enabled: false
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'middle',
            width: 1000,
            align: 'center',
            visible: false
        },
        xAxis: {
            width: 0,
            visible: false
        },
        yAxis: {
            height: 0,
            visible: false
        }
    }
};


// For debugging purposes
// eslint-disable-next-line no-unused-vars
const dataGrid =
{
    renderTo: 'data-grid',
    connector: {
        id: 'population-growth'
    },
    type: 'DataGrid',
    chartOptions: {
        title: {
            text: 'Countries population growth by year'
        }
    }
};

function beforeParse(csv) {
    // Convert rows to columns and throw away empty rows
    const rows = csv.split('\n');
    const columns = [];

    rows.forEach((row, i) => {
        if (!row) {
            return;
        }
        const values = row.split(',');
        // Replace name of first column: 'Country Name' -> 'Year'
        if (i === 0) {
            values[0] = 'Year';
        }
        values.forEach((value, j) => {
            if (!columns[j]) {
                columns[j] = [];
            }
            columns[j][i] = value;
        });
    });
    return columns.map(column =>
        column.join(',')
    ).join('\n');
}


async function setupBoard() {
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'population-growth',
                type: 'CSV',
                options: {
                    csv: csvData,
                    firstRowAsNames: true,
                    dataModifier: dataModifier,
                    beforeParse: beforeParse
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'south-america-chart'
                    }, {
                        id: 'north-america-chart'
                    }, {
                        id: 'asia-chart'
                    }]
                }, {
                    cells: [{
                        id: 'legend'
                    }]
                }, {
                    cells: [{
                        id: 'data-grid'
                    }]
                }]
            }]
        },
        components: [
            asiaChart,
            northAmericaChart,
            southAmericaChart,
            legendChart
        ]
    }, true);

    return board;
}

setupBoard();
