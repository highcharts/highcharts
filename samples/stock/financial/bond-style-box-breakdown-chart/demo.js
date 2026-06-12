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
            security: {
                id: 'F00001GPCX',
                idType: 'MSID'
            },
            converter: {
                type: 'BondStyleBoxBreakdown'
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
            text: 'Aviva Investors - Emerging Markets Bond Fund K USD Acc',
            align: 'left'
        },
        subtitle: {
            text: 'Bond Style',
            align: 'left'
        },
        xAxis: {
            categories: ['Short', 'Intermediate', 'Long'],
            lineWidth: 0,
            gridLineWidth: 0,
            opposite: true,
            title: {
                text: 'Term'
            },
            labels: {
                style: {
                    fontSize: '1rem',
                    color: '#6e7481'
                }
            }
        },
        yAxis: {
            categories: ['Low', 'Medium', 'High'],
            gridLineWidth: 0,
            title: {
                text: 'Quality'
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
            keys: ['Type', 'value', 'x', 'y'],
            data: securityDetailsConnector.getTable('BondStyleBoxBreakdown')
                .getRows(0, 9),
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '1rem',
                    textOutline: 'none'
                }
            }
        }]
    });
}

renderChart();
