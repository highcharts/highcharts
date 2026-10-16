// Category names can be retrieved from the Morningstar Security Details API
// dictionary, under "Data Points" section
const globalStockSectorBreakdown = {
    101: 'Basic Materials',
    102: 'Consumer Cyclical',
    103: 'Financial Services',
    104: 'Real Estate',
    205: 'Consumer Defensive',
    206: 'Healthcare',
    207: 'Utilities',
    308: 'Communication Services',
    309: 'Energy',
    310: 'Industrials',
    311: 'Technology'
};

// Parse data from two connectors and return a chart-ready DataTable
function buildDataTable(source) {
    const valuesByType = (typeColumn, valueColumn) => source
        .getRows(0, source.getRowCount(), [typeColumn, valueColumn])
        .reduce((map, row) => {
            if (row[0] !== undefined) {
                map[row[0]] = row[1];
            }
            return map;
        }, {});

    const categoryByType = valuesByType('Type_EUCA000550', 'L_EUCA000550'),
        targetByType = valuesByType('Type_F0GBR052QA', 'L_F0GBR052QA'),
        name = [],
        category = [],
        target = [];

    for (const [type, sector] of Object.entries(globalStockSectorBreakdown)) {
        name.push(sector);
        category.push(categoryByType[type] || '-');
        target.push(targetByType[type] || '-');
    }

    return new Highcharts.DataTable({
        columns: {
            name,
            category,
            target
        }
    });
}

async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.Morningstar.SecurityCompareConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                ids: ['F0GBR052QA', 'EUCA000550'],
                idType: 'MSID'
            },
            converter: {
                type: 'GlobalStockSectorBreakdown'
            }
        });

    await connector.load();
    const dataTable = buildDataTable(connector.getTable());

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Sector Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        dataTable,
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataTable.getColumn('name')
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataTable.getColumn('target'),
            labels: {
                format:
                    '{#if (eq value "-")}N/A{else}{value:.2f}%{/if}',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataTable.getColumn('category'),
            labels: {
                format:
                    '{#if (eq value "-")}N/A{else}{value:.2f}%{/if}',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        legend: {
            enabled: true,
            align: 'right',
            verticalAlign: 'top'
        },
        yAxis: {
            title: {
                text: 'Sector weight'
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                minPointLength: 3
            }
        },
        tooltip: {
            followPointer: true,
            shared: true,
            valueDecimals: 2,
            valueSuffix: '%',
            headerFormat:
                '<span style="font-size:10px;">{point.key}</span></br>'
        },
        series: [{
            name: 'Category',
            color: '#E1E1E6',
            dataMapping: {
                y: 'category'
            }
        }, {
            name: 'BlackRock Income and Growth Ord',
            color: '#274FE0',
            dataMapping: {
                y: 'target'
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 700
                },
                chartOptions: {
                    xAxis: [{
                        grid: {
                            enabled: false
                        }
                    }]
                }
            }, {
                condition: {
                    maxWidth: 550
                },
                chartOptions: {
                    chart: {
                        inverted: true
                    }
                }
            }]
        }
    });
}

renderChart();
