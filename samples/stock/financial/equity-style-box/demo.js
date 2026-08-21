async function renderChart() {

    // Configure the connector
    const securityDetailsConnector =
        new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            converter: {
                type: 'StyleBoxBreakdown'
            },
            security: {
                id: 'F0GBR050DD',
                idType: 'MSID'
            }
        });

    // Load data
    await securityDetailsConnector.load();

    // Create chart
    Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        title: {
            text:
                'Aviva Investors UK Listed Equity Unconstrained Fund 2 GBP Acc',
            align: 'left'
        },
        subtitle: {
            text: 'Stock Style',
            align: 'left'
        },
        xAxis: {
            categories: ['Value', 'Blend', 'Growth'],
            lineWidth: 0,
            gridLineWidth: 0,
            opposite: true,
            labels: {
                style: {
                    fontSize: '1rem',
                    color: '#6e7481'
                }
            }
        },
        yAxis: {
            categories: ['Small', 'Medium', 'Large'],
            gridLineWidth: 0,
            title: {
                text: ''
            },
            labels: {
                rotation: -90,
                style: {
                    fontSize: '1rem',
                    color: '#6e7481'
                }
            }
        },
        legend: {
            layout: 'vertical',
            verticalAlign: 'top',
            align: 'right',
            y: 75,
            symbolRadius: 0,
            itemMarginTop: 9,
            itemMarginBottom: 9
        },
        colorAxis: {
            dataClasses: [{
                from: 49,
                color: '#014ce5',
                name: '50+'
            }, {
                from: 24,
                to: 49,
                color: '#487cea',
                name: '25-49'
            }, {
                from: 9,
                to: 24,
                color: '#acc2f3',
                name: '10-24'
            }, {
                from: 0,
                to: 9,
                color: '#fafafa',
                name: '0-9'
            }]
        },
        tooltip: {
            pointFormat:
                '<b> {series.yAxis.categories.(point.y)} ' +
                '{series.xAxis.categories.(point.x)}</b>: {point.value}%'
        },
        series: [{
            name: 'Portfolio Weight',
            borderWidth: 1,
            borderColor: '#e5e7e9',
            keys: ['Type', 'NotClassified', 'L', 'S', 'value', 'x', 'y'],
            data: securityDetailsConnector
                .getTable('StyleBoxBreakdown').getRows(
                    0,
                    9
                ),
            dataLabels: {
                enabled: true,
                format: '{value:.0f}%',
                style: {
                    fontSize: '1rem',
                    textOutline: 'none'
                }
            }
        }]
    });
}

renderChart();
