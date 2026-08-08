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

    const {
        Nav_M12_Y_Date_F0GBR050DD: fundDates,
        Nav_M12_Y_Value_F0GBR050DD: fundValues,
        Nav_M12_Y_Date_EUCA000527: benchmarkDates,
        Nav_M12_Y_Value_EUCA000527: benchmarkValues
    } = securityCompareConnector.getTable('HistoricalPerformanceSeries')
        .getColumns();

    const fundData = fundDates
        .map((date, index) => [date, fundValues[index]])
        .filter(([, value]) => value !== undefined);

    const benchmarkData = benchmarkDates
        .map((date, index) => [date, benchmarkValues[index]])
        .filter(([, value]) => value !== undefined);

    Highcharts.chart('container', {
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
            data: fundData,
            color: '#274FE0'
        }, {
            name:
                'NAV M12 Yearly Returns for ' +
                '<b>iShares NASDAQ 100 UCITS ETF USD (Acc) EUR</b>',
            data: benchmarkData,
            color: '#E1E1E6'
        }]
    });
}

renderChart();
