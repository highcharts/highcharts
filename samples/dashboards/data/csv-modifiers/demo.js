const csvData = document.getElementById('csv').innerHTML;

const firstYear = 1961;
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
        zoomType: 'x'
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
    sync: {
        visibility: true,
        extremes: true
    },
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
    type: 'Highcharts',
    renderTo: 'north-america-chart',
    sync: {
        visibility: true,
        extremes: true
    },
    connector: {
        id: 'population-growth',
        columnAssignment: createColumnAssignment(
            ['Mexico', 'Guatemala', 'Canada', 'United States']
        )
    },
    chartOptions: {
        title: {
            text: 'North America'
        }
    }
};

const southAmericaChart = {
    type: 'Highcharts',
    renderTo: 'south-america-chart',
    sync: {
        visibility: true,
        extremes: true
    },
    connector: {
        id: 'population-growth',
        columnAssignment: createColumnAssignment(
            ['Brazil', 'Argentina', 'Uruguay', 'Paraguay']
        )
    },
    chartOptions: {
        title: {
            text: 'South America'
        }
    }
};

const legendChart = {
    type: 'Highcharts',
    renderTo: 'legend',
    sync: {
        visibility: true
    },
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


function beforeParse(csv) {
    // Convert rows to columns and throw away empty rows
    const rows = csv.split('\n');
    const columns = [];

    rows.forEach((row, i) => {
        if (!row) {
            return;
        }
        const values = row.split(',');
        // Replace name row name 'Country Name' with column name 'Year'
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
    // Convert back to CSV
    return columns.map(column =>
        column.join(',')
    ).join('\n');
}


Dashboards.board('container', {
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
