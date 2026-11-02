async function renderChart() {

    // Configure the connector
    const securityCompareConnector =
        new HighchartsConnectors.Morningstar.SecurityCompareConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                ids: ['F0GBR050DD', 'EUCA000527'],
                idType: 'MSID'
            },
            converters: ['HistoricalPerformanceSeries']
        });

    // Load data
    await securityCompareConnector.load();

    // Get data table. It also holds the quarterly series, which are one row
    // longer, so remove the trailing row without yearly data.
    const dataTable = securityCompareConnector.getTable(
        'HistoricalPerformanceSeries'
    );
    dataTable.deleteRows(dataTable.getRowCount() - 1);

    Highcharts.chart('container', {
        dataTable,
        chart: {
            type: 'column',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'Yearly Returns (%)'
        },
        subtitle: {
            text: 'You can zoom in by dragging across the chart area.'
        },
        xAxis: {
            type: 'datetime',
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
                '{series.name} <b>{point.y:.2f}%</b><br/>'
        },
        series: [{
            name:
                'NAV M12 Yearly Returns for ' +
                '<b>Aviva Investors UK Lstd Eq Uncons2GBPAcc</b>',
            dataMapping: {
                x: 'Nav_M12_Y_Date_F0GBR050DD',
                y: 'Nav_M12_Y_Value_F0GBR050DD'
            },
            color: '#274FE0'
        }, {
            name:
                'NAV M12 Yearly Returns for ' +
                '<b>iShares NASDAQ 100 UCITS ETF USD (Acc) EUR</b>',
            dataMapping: {
                x: 'Nav_M12_Y_Date_EUCA000527',
                y: 'Nav_M12_Y_Value_EUCA000527'
            },
            color: '#E1E1E6'
        }]
    });
}

renderChart();
