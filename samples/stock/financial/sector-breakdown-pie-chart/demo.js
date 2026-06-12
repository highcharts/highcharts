const globalStockSectorBreakdown = {
    101: 'Basic Materials',
    308: 'Communication Services',
    102: 'Consumer Cyclical',
    205: 'Consumer Defensive',
    206: 'Healthcare',
    310: 'Industrials',
    104: 'Real Estate',
    311: 'Technology',
    309: 'Energy',
    103: 'Financial Services',
    207: 'Utilities'
};

// For accessing globalStockSectorBreakdown in the format string
Highcharts.Templating.helpers.translateGlobalSector = value =>
    globalStockSectorBreakdown[value];
Grid.Templating.helpers.translateGlobalSector = value =>
    globalStockSectorBreakdown[value];

async function renderChart() {

    // Create the dashboard.
    Dashboards.board('container', {
        dataPool: {
            // Fetch data with the Morningstar connector
            connectors: [{
                id: 'sector-breakdown',
                type: 'MorningstarSecurityDetails',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                converter: {
                    type: 'GlobalStockSectorBreakdown'
                },
                security: {
                    id: 'F0GBR052QA',
                    idType: 'MSID'
                },
                dataModifier: {
                    type: 'Sort',
                    direction: 'desc',
                    orderByColumn: 'L'
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        // Pie chart
                        id: 'pie-chart'
                    }]
                }, {
                    cells: [{
                        // Datagrid
                        id: 'datagrid'
                    }]
                }]
            }]
        },
        components: [{
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            connector: {
                id: 'sector-breakdown',
                columnAssignment: [{
                    seriesId: 'Sector breakdown',
                    data: ['Type', 'L']
                }]
            },
            renderTo: 'pie-chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'pie',
                    marginBottom: 0
                },
                title: {
                    align: 'left',
                    text: 'Sector Breakdown'
                },
                subtitle: {
                    align: 'left',
                    text:
                        'Distribution of investments across various industry ' +
                        'sectors, showing their relative weight in the ' +
                        'portfolio or index'
                },
                tooltip: {
                    backgroundColor: '#001A33',
                    shadow: false,
                    borderRadius: 8,
                    padding: 10,
                    useHTML: true,
                    animation: 0,
                    format: `
                        <span style="color: #9CA6B0; font-size: 1.1em;">
                            {translateGlobalSector point.name}
                        </span>
                        <br/>
                        <div style="height: 4px;"></div>
                        <b>
                            <span style="color: #fff; font-size: 1.3em;">
                                {point.y:.2f}%
                            </span>
                        </b>
                    `,
                    style: {
                        color: '#fff'
                    }
                },
                plotOptions: {
                    pie: {
                        size: '100%',
                        borderWidth: 1,
                        colors: [
                            '#818f96',
                            '#94A1A8',
                            '#ABB3BA',
                            '#BCC3C8',
                            '#C9CFD3',
                            '#D6DBDE',
                            '#E5E7E9',
                            '#EBEDEE',
                            '#F2F3F4',
                            '#F8F9F9',
                            '#fff'
                        ],
                        states: {
                            hover: {
                                color: '#014CE5',
                                borderColor: '#014CE5'
                            }
                        },
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            renderTo: 'datagrid',
            connector: {
                id: 'sector-breakdown'
            },
            type: 'Grid',
            sync: {
                highlight: true,
                visibility: true
            },
            gridOptions: {
                rendering: {
                    header: {
                        enabled: false
                    },
                    theme: 'theme-custom'
                },
                credits: {
                    enabled: false
                },
                // Display only the columns in the header array.
                header: [{
                    columnId: 'Type'
                }, {
                    columnId: 'L'
                }],
                columns: [{
                    id: 'Type',
                    cells: {
                        className: 'name-col',
                        format: '{translateGlobalSector value}'
                    }
                }, {
                    id: 'L',
                    cells: {
                        className: 'net-value-col',
                        format: '{value:.2f}%'
                    }
                }]
            }
        }]
    });
}

renderChart();
