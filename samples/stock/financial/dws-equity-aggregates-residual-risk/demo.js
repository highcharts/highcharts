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
                id: '0P00006W6Q'
            },
            converters: {
                EquityAggregatesResidualRisk: {}
            }
        });

    // Load data
    await connector.load();

    // Get data table
    const dataTable = connector.getTable('EquityAggregatesResidualRisk');

    // Set global options
    Highcharts.setOptions({
        chart: {
            type: 'column'
        },
        colors: ['#274FE0', '#E1E1E6'],
        tooltip: {
            shared: true
        },
        xAxis: {
            crosshair: true,
            categories: dataTable.getRows(
                void 0,
                void 0,
                ['Type']
            )
                .flat()
                .map(item => item.replace(/(\d+)([A-Za-z]+)/u, '$1 $2'))
        }
    });

    // Create chart
    Highcharts.chart('container-values-alpha', {
        title: {
            text: 'Monthly Values - Alpha'
        },
        tooltip: {
            valueSuffix: '%'
        },
        yAxis: {
            title: {
                text: 'Alpha'
            },
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            name: 'Alpha',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['Alpha']
            )
        }, {
            name: 'Non Dividend Alpha',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['NonDividendAlpha']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-values-beta', {
        title: {
            text: 'Monthly Values - Beta'
        },
        yAxis: {
            title: {
                text: 'Beta'
            },
            plotLines: [{
                color: '#6B7280',
                value: 1,
                width: 2,
                label: {
                    text: 'Market<br>baseline',
                    align: 'left',
                    style: {
                        color: '#6B7280'
                    }
                }
            }]
        },
        series: [{
            name: 'Beta',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['Beta']
            )
        }, {
            name: 'Non Dividend Beta',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['NonDividendBeta']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-companies-alpha', {
        title: {
            text: 'Monthly Companies - Alpha'
        },
        yAxis: {
            title: {
                text: 'Number of eligible companies'
            }
        },
        series: [{
            name: 'All Companies',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['AlphaCompanies']
            )
        }, {
            name: 'Non Dividend Companies',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['NonDividendAlphaCompanies']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-companies-beta', {
        title: {
            text: 'Monthly Companies - Beta'
        },
        yAxis: {
            title: {
                text: 'Number of eligible companies'
            }
        },
        series: [{
            name: 'All Companies',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['BetaCompanies']
            )
        }, {
            name: 'Non Dividend Companies',
            data: dataTable.getRows(
                void 0,
                void 0,
                ['NonDividendBetaCompanies']
            )
        }]
    });
}

renderChart();
