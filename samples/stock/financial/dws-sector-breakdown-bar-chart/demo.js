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
    const table = connector.getTable('EqSectors'),
        data = table.getRows(0, table.getRowCount(), ['Type', 'PercLong']);

    // Create chart
    Highcharts.chart('container', {
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
            categories: data,
            labels: {
                format: '{translateSectors value.0}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data,
            labels: {
                format:
                    '{#if (eq value.1 undefined)}N/A{else}{value.1:.2f}%{/if}',
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
                '<span style="color:{point.color}">\u25CF</span>' +
                '{translate point.key}<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Capital Group Global Equity Fund (LUX) B',
            color: '#274FE0',
            data
        }]
    });
}

renderChart();
