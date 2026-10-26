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

    // Create chart
    Highcharts.chart('container', {
        dataTable: connector.getTable('EqSectors'),
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
            headerFormat: null
        },
        series: [{
            name: 'Capital Group Global Equity Fund (LUX) B',
            dataMapping: {
                name: 'Type',
                y: 'PercLong'
            },
            color: '#274FE0'
        }]
    });
}

renderChart();
