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
        dataTable,
        chart: {
            type: 'column'
        },
        colors: ['#274FE0', '#E1E1E6'],
        tooltip: {
            shared: true
        },
        xAxis: {
            crosshair: true,
            categories: dataTable.getColumn('Type')
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
            dataMapping: {
                y: 'Alpha'
            }
        }, {
            name: 'Non Dividend Alpha',
            dataMapping: {
                y: 'NonDividendAlpha'
            }
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
            dataMapping: {
                y: 'Beta'
            }
        }, {
            name: 'Non Dividend Beta',
            dataMapping: {
                y: 'NonDividendBeta'
            }
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
            dataMapping: {
                y: 'AlphaCompanies'
            }
        }, {
            name: 'Non Dividend Companies',
            dataMapping: {
                y: 'NonDividendAlphaCompanies'
            }
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
            dataMapping: {
                y: 'BetaCompanies'
            }
        }, {
            name: 'Non Dividend Companies',
            dataMapping: {
                y: 'NonDividendBetaCompanies'
            }
        }]
    });
}

renderChart();
