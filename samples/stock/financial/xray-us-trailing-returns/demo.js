async function renderChart() {

    // Configure the connector
    const xRayConnector = new HighchartsConnectors.Morningstar.XRayUSConnector({
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        },
        viewId: 'All',
        configId: 'Default',
        requestSettings: {
            outputCurrency: 'USD',
            outputReturnsFrequency: 'MonthEnd',
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
                securityId: 'F00000VCTT',
                weight: 20
            }, {
                securityId: '0P00002NW8',
                weight: 10
            }, {
                tradingSymbol: 'AAPL',
                weight: 15
            }, {
                isin: 'US09251T1034',
                weight: 35
            }, {
                cusip: '256219106',
                weight: 20
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
    await xRayConnector.load();

    // Create chart
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Trailing Returns (%)'
        },
        yAxis: {
            title: {
                text: 'Returns'
            },
            labels: {
                format: '{value}%'
            }
        },
        xAxis: {
            categories: [
                'YTD',
                '3M',
                '6M',
                '1Y',
                '2Y',
                '3Y',
                '5Y',
                '10Y',
                'Since Inception'
            ],
            title: {
                text: 'Period'
            }
        },
        tooltip: {
            shared: true,
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name} <b>{point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Portfolio Value',
            data: xRayConnector.getTable('TrailingReturns').getRows(
                void 0,
                void 0,
                ['Value']
            ),
            color: '#274FE0'
        }, {
            name: 'Benchmark',
            data: xRayConnector.getTable('TrailingReturns').getRows(
                void 0,
                void 0,
                ['Value_Benchmark']
            ),
            color: '#E1E1E6'
        }]
    });
}

renderChart();
