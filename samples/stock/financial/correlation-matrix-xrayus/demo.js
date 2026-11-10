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
        view: { id: 'All' },
        config: { id: 'Default' },
        requestSettings: {
            returnDataSections: ['CorrelationMatrix', 'RollingReturns'],
            outputCurrency: 'USD',
            analysisDateTimePeriod: 'MonthEnd',
            assetClassGroupConfigs: {
                assetClassGroupConfig: [{ id: 'ACG-USBROAD' }]
            }
        },
        portfolios: [
            {
                name: 'Portfolio',
                totalValue: 10000,
                currency: 'USD',
                holdings: [
                    { securityId: 'F00000VCTT', weight: 20 },
                    { securityId: '0P00002NW8', weight: 10 },
                    { tradingSymbol: 'AAPL', weight: 15 },
                    { isin: 'US09251T1034', weight: 35 },
                    { cusip: '256219106', weight: 20 }
                ],
                benchmark: {
                    type: 'Standard',
                    holdings: [{
                        securityId: 'XIUSA04G92',
                        type: 'XI',
                        weight: 100
                    }]
                }
            }
        ]
    });

    // Load data
    await xRayConnector.load();

    const securityReference = xRayConnector.metadata.securityReference,
        dataTable = xRayConnector.getTable('CorrelationMatrix');

    // Retrieve all column names for 'Year3' period
    const columnIds = dataTable.getColumnIds().filter(
        n => n.includes('Year3_')
    );

    // Map SecurityId into human readable name
    const categories = columnIds.map(name => {
        name = name.replace('Year3_', '');
        const security = securityReference.find(s => s.SecurityId === name);
        return security ? security.Name : name;
    });

    // Create a chart
    const chart = Highcharts.chart('container', {
        dataTable,
        chart: {
            type: 'heatmap',
            marginTop: 70,
            plotBorderWidth: 0
        },
        title: {
            text: 'Correlation Matrix'
        },
        subtitle: {
            text: '3 years period'
        },
        xAxis: {
            categories,
            lineWidth: 0,
            gridLineWidth: 0
        },
        yAxis: {
            categories,
            reversed: true,
            gridLineWidth: 0,
            title: {
                text: ''
            }
        },
        colorAxis: {
            min: -1,
            max: 1,
            dataClasses: [{
                from: 0.75,
                to: 1,
                color: '#2171b5',
                name: '0.75 to 1.00'
            }, {
                from: 0.5,
                to: 0.75,
                color: '#6baed6',
                name: '0.50 to 0.75'
            }, {
                from: 0.25,
                to: 0.5,
                color: '#9ecae1',
                name: '0.25 to 0.50'
            }, {
                from: 0.0,
                to: 0.25,
                color: '#dbe9f6',
                name: '0.00 to 0.25'
            }, {
                from: -0.25,
                to: 0.0,
                color: '#fee6ce',
                name: '-0.25 to 0.00'
            }, {
                from: -0.5,
                to: -0.25,
                color: '#fdae6b',
                name: '-0.50 to -0.25'
            }, {
                from: -0.75,
                to: -0.5,
                color: '#fd8d3c',
                name: '-0.75 to -0.50'
            }, {
                from: -1.0,
                to: -0.75,
                color: '#e6550d',
                name: '-1.00 to -0.75'
            }]
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'top',
            y: 25,
            symbolRadius: 0
        },
        tooltip: {
            pointFormat: '<b>{point.value:.2f}</b><br/>' +
            '{series.yAxis.categories.(point.y)} ↔ ' +
            '{series.xAxis.categories.(point.x)}'
        },
        series: [{
            name: 'Correlation',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            dataMapping: {
                x: 'x',
                y: 'y',
                value: 'Year3'
            },
            dataLabels: {
                enabled: true,
                format: '{point.value:.2f}',
                style: {
                    fontSize: '1em',
                    textOutline: 'none'
                }
            }
        }],
        responsive: {
            rules: [{
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal',
                        y: 0
                    },
                    yAxis: {
                        labels: {
                            style: {
                                width: '90px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }
                        }
                    }
                },
                condition: {
                    maxWidth: 500
                }
            }]
        }
    });

    function updateChart(timePeriod) {
        const periodIndex = timePeriod.slice(1);

        if (!periodIndex) {
            return;
        }

        chart.series[0].update({
            dataMapping: { value: `Year${periodIndex}` }
        }, false);
        chart.series[0].setData(void 0, false, void 0, false);

        chart.update({
            subtitle: {
                text: `${periodIndex} years period`
            }
        }, false);

        chart.redraw();
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const selectedPeriod = tab.getAttribute('data-period');
                updateChart(selectedPeriod);
            });
        });
    }

    setupTabs();
}

renderChart();
