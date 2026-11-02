async function renderChart() {

    // Configure the connector
    const performanceConnector =
        new HighchartsConnectors.Morningstar.PerformanceConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            requestSettings: {
                outputCurrency: 'USD',
                assetClassGroupConfigs: {
                    assetClassGroupConfig: [{
                        id: 'ACG-USBROAD'
                    }]
                }
            },
            portfolios: [{
                name: 'Portfolio',
                totalValue: 10000,
                currency: 'USD',
                holdings: [{
                    securityId: 'FOUSA05H5F',
                    type: 'FO',
                    weight: 50
                }, {
                    securityId: 'FOUSA04BCR',
                    type: 'FO',
                    weight: 50
                }],
                benchmark: {
                    type: 'Standard',
                    holdings: [{
                        securityId: 'XIUSA04G92',
                        type: 'XI',
                        weight: 100
                    }]
                }
            }]
        });

    // Load data
    await performanceConnector.load();

    Highcharts.chart('container', {
        dataTable: performanceConnector.getTable('CalendarYearReturn'),
        chart: {
            type: 'column',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'Portfolio Calendar Year Returns (%)'
        },
        subtitle: {
            text: 'You can zoom in by dragging across the chart area.'
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Year'
            }
        },
        yAxis: {
            title: {
                text: 'Returns'
            },
            labels: {
                format: '{value}%'
            }
        },
        tooltip: {
            shared: true,
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}<b> {point.y:.2f}%</b><br/>'
        },
        plotOptions: {
            series: {
                dataMapping: {
                    x: 'Id'
                },
                dataGrouping: {
                    enabled: true,
                    groupPixelWidth: 50
                }
            }
        },
        series: [{
            name: 'Portfolio',
            dataMapping: {
                y: 'Value'
            }
        }, {
            name: 'Benchmark',
            dataMapping: {
                y: 'Value_Benchmark'
            }
        }],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 500
                    },
                    plotOptions: {
                        column: {
                            pointMaxWidth: 4
                        }
                    },
                    yAxis: [{
                        title: null
                    }]
                }
            }]
        }
    });
}

renderChart();
