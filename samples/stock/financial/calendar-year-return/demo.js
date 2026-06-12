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
                '{series.name}<b>{point.y:.2f}%</b><br/>'
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true,
                    groupPixelWidth: 50
                }
            }
        },
        series: [{
            name: 'Portfolio',
            data: performanceConnector.getTable('CalendarYearReturn').getRows(
                void 0,
                void 0,
                ['Id', 'Value']
            )
        }, {
            name: 'Benchmark',
            data: performanceConnector.getTable('CalendarYearReturn').getRows(
                void 0,
                void 0,
                ['Id', 'Value_Benchmark']
            )
        }],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        }
    });
}

renderChart();
