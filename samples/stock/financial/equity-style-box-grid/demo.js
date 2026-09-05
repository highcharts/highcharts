async function renderChart() {
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
                EquityStyleBox: {
                    startDate: '2025-01-01',
                    endDate: '2025-12-01'
                }
            }
        });

    // Load data
    await connector.load();

    // Get data tables
    const dataTable = connector.getTable('TimeSeries');

    // Get Stock Style data
    const stockStyleData = connector
        .getTable('StockStyle')
        .getRows()
        .map(row => [row[0], row[1], 0]);

    Grid.grid('container', {
        dataTable: {
            columns: {
                Date: dataTable.getColumn('Date'),
                Box: dataTable
                    .getColumn('StyleBoxCode')
                    .map(code => {
                        const data = stockStyleData.map(row => [...row]);
                        if (data[code - 1]) {
                            data[code - 1][2] = 100;
                        }
                        return JSON.stringify(data);
                    }),
                'Style Box': dataTable.getColumn('StyleBox'),
                'Growth Score': dataTable.getColumn('GrowthScore'),
                'Size Score': dataTable.getColumn('SizeScore'),
                'Style Score': dataTable.getColumn('StyleScore'),
                'Value Score': dataTable.getColumn('ValueScore'),
                Region: dataTable.getColumn('Region')
            }
        },
        columns: [{
            id: 'Box',
            width: 70,
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: {
                        chart: {
                            plotBorderWidth: 1,
                            plotBorderColor: '#000',
                            type: 'heatmap',
                            width: 70,
                            height: 70,
                            margin: 5,
                            spacing: 0
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            type: 'category'
                        },
                        colorAxis: {
                            dataClasses: [{
                                from: 100,
                                color: '#000'
                            }, {
                                to: 99,
                                color: '#fff'
                            }]
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 1,
                                borderColor: '#000',
                                marker: {
                                    enabled: true
                                }
                            }
                        }
                    }
                }
            }
        }]
    });
}

renderChart();
