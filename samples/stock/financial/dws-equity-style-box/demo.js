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
                id: '0P00006W6Q'
            },
            converters: {
                EquityStyleBox: {}
            }
        });

    // Load data
    await connector.load();

    // Get data table
    const dataTable = connector.getTable('StockStyle');

    // Create chart
    Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        title: {
            text: 'Equity Style Box',
            align: 'left'
        },
        subtitle: {
            text: 'Stock Style',
            align: 'left'
        },
        xAxis: {
            categories: ['Value', 'Core', 'Growth'],
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
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `
                Effective Date: <b>{series.options.custom.effectiveDate}</b>
                <br/>
                Weight: <b>{point.value:.0f}%</b><br/>
                Growth Score: <b>{series.options.custom.growthScore:.2f}</b>
                <br/>
                Size Score: <b>{series.options.custom.sizeScore:.2f}</b><br/>
                Style Score: <b>{series.options.custom.styleScore:.2f}</b><br/>
                Value Score: <b>{series.options.custom.valueScore:.2f}</b>
            `
        },
        series: [{
            name: 'Equity Style Box',
            borderWidth: 1,
            borderColor: '#e5e7e9',
            custom: {
                ...dataTable.metadata
            },
            data: dataTable.getRows(),
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
