const csvData = document.getElementById('csv').innerHTML;

const minYear = 1961;
const maxYear = 2022;


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
        type: 'line',
        animation: false
    },
    yAxis: {
        max: 5,
        min: -1
    },
    xAxis: {
        min: minYear,
        max: maxYear
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
        columnAssignment: getColumnAssignment(
            ['China', 'Japan', 'India', 'Indonesia']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'Asia'
        },
        chart: {
            animation: false
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
        },
        chart: {
            animation: false
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


Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'population-growth',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true,
                beforeParse: function (csv) {
                    // Convert rows to columns.
                    // TBD: retry with InvertedTableModifier
                    const rows = csv.split('\n');
                    const columns = [];

                    rows.forEach((row, i) => {
                        if (!row) {
                            return;
                        }
                        console.log('row', i);
                        const values = row.split(',');
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
                    return columns.map(function (column) {
                        return column.join(',');
                    }).join('\n');
                },
                dataModifier: {
                    type: 'Range',
                    ranges: [{
                        column: 'x',
                        minValue: minYear,
                        maxValue: maxYear
                    }]
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
        // dataGrid,
        asiaChart,
        northAmericaChart,
        southAmericaChart,
        legendChart
    ]
}, true);
