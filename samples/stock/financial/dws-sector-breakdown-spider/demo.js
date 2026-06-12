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
    const table = connector.getTable('EqSectors'),
        data = table.getRows(0, table.getRowCount(), ['Type', 'PercLong']);

    // Create chart
    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'line',
            ignoreHiddenSeries: false
        },
        title: {
            text: 'Sector Breakdown Chart'
        },
        xAxis: {
            type: 'category',
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            labels: {
                format: '{value}%'
            },
            min: 0
        },
        tooltip: {
            followPointer: true,
            shared: true,
            animation: {
                duration: 0
            },
            pointFormat:
            '<span style="color:{point.color}">\u25CF</span>' +
            ' {point.name}<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Capital Group Global Equity Fund (LUX) B',
            data,
            color: '#274FE0'
        }]
    });
}

renderChart();
