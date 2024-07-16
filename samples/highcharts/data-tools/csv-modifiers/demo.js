const csvData = document.getElementById('csv').innerHTML;

// Set to true to use the Invert modifier,
// otherwise flip table using beforeParse
const useInvertMod = true;

const chainModifier = {
    type: 'Chain',
    chain: [{
        type: 'Invert'
    }, {
        type: 'Range',
        ranges: [{
            column: 'columnNames',
            minValue: 1974,
            maxValue: 1978
        }]
    }]
};


const rangeModifier = {
    type: 'Range',
    ranges: [{
        column: 'x',
        minValue: 1961,
        maxValue: 2021
    }]
};

const dataModifier = useInvertMod ? chainModifier : rangeModifier;


function getColumnAssignment(columnNames) {
    return columnNames.map(function (column) {
        return {
            seriesId: column,
            data: ['x', column]
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
        min: 1960,
        max: 2022
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
    renderTo: 'asia-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: [
            {
                seriesId: '0',
                data: ['y', 'China']
            },
            {
                seriesId: '1',
                data: ['y', 'Japan']
            },
            {
                seriesId: '2',
                data: ['y', 'India']
            },
            {
                seriesId: '3',
                data: ['y', 'Indonesia']
            }
        ]
    },
    type: 'Highcharts',
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
        columnAssignment: getColumnAssignment(
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
        columnAssignment: getColumnAssignment(
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
    renderTo: 'legend',
    connector: {
        id: 'population-growth'
    },
    type: 'Highcharts',
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
    sync: {
        visibility: true
    }
};

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
                    beforeParse: function (csv) {
                        // console.log(csv);
                        if (useInvertMod) {
                            // Flip table using InvertModifier
                            return csv; // .replace(/Country Name/g, 'x');
                        }

                        // Convert rows to columns and throw away empty rows
                        const rows = csv.split('\n');
                        const columns = [];

                        rows.forEach((row, i) => {
                            if (!row) {
                                return;
                            }
                            const values = row.split(',');
                            // Replace name of first column: "Country Name" -> x
                            if (i === 0) {
                                values[0] = 'x';
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
            //northAmericaChart,
            //southAmericaChart,
            // legendChart,
            dataGrid
        ]
    }, true);

    const dataPool = board.dataPool;
    const conn = await dataPool.getConnector('population-growth');
    console.log(conn.table.modified.columns);

    return board;
}

setupBoard();
