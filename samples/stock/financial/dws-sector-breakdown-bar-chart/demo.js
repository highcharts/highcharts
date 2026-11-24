// Helper function to translate sectors
Highcharts.Templating.helpers.translateSectors =
    key => key.replace(/([a-z])([A-Z])/gu, '$1 $2');

async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                id: '0P00000FIA'
            },
            converters: {
                EquitySectorsBreakdown: {}
            }
        });

    // Load data
    await connector.load();

    // Get data table
    const table = connector.getTable('EqSectors');

    // Create chart
    Highcharts.chart('container', {
        dataTable: table,
        chart: {
            type: 'column'
        },
        title: {
            text: 'Sector Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            type: 'category',
            labels: {
                format: '{translateSectors value}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            type: 'category',
            categories: table.getRows(void 0, void 0, ['PercLong']),
            labels: {
                format:
                    '{#if (eq value.0 undefined)}N/A{else}{value.0:.2f}%{/if}',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        legend: {
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
                minPointLength: 3,
                borderWidth: 1,
                borderColor: '#0000001C'
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat:
                '<span style="font-size:10px;">{series.name}</span></br>',
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '{translateSectors point.key}<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Capital Group Global Equity Fund (LUX) B',
            color: '#274FE0',
            dataMapping: {
                name: 'Type',
                y: 'PercLong'
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
