/* eslint-disable max-len, quotes */
/** Super-sector colors (aligned with Morningstar-style reference palette). */
const SUPER_SECTOR_COLORS = {
    Government: '#2364B9',
    Municipal: '#6B4EA1',
    Corporate: '#F47206',
    Securitized: '#125B2F',
    CashAndEquivalents: '#039649',
    Derivative: '#0F86A3'
};

const connector = new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    },
    security: {
        id: '0P00002QN3'
    },
    converters: {
        FixedIncomeSectorsBreakdown: {}
    }
});

async function init() {
    await connector.load();

    Grid.grid('container', {
        data: {
            dataTable: connector.getTable('IncAllSectors'),
            idColumn: 'Fixed_Income_Path',
            treeView: {
                enabled: true,
                input: {
                    type: 'path',
                    pathColumn: 'Fixed_Income_Path'
                }
            }
        },
        caption: {
            text: 'Fixed Income Sector Allocation'
        },
        rendering: {
            rows: {
                strictHeights: true
            }
        },
        columnDefaults: {
            resizing: {
                enabled: true
            },
            filtering: {
                enabled: true
            }
        },
        header: [
            'Fixed_Income_Path',
            'Fixed_Income_PercLong',
            'Fixed_Income_PercShort',
            'Fixed_Income_PercNet',
            'Fixed_Income_PercLongRescaled'
        ],
        columns: [{
            id: 'Fixed_Income_Path',
            header: {
                format: 'Sector'
            },
            cells: {
                formatter: function () {
                    const name = this.value.split('/').pop();
                    return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                        .toLowerCase()
                        .replace(/^./, c => c.toUpperCase());
                }
            }
        },
        {
            id: 'Fixed_Income_PercLongRescaled',
            header: {
                format: 'Long (rescaled %)'
            },
            cells: {
                format: '{value:,.2f}%',
                renderer: {
                    type: 'sparkline',
                    chartOptions: function (cellValue) {
                        const path = String(
                            this.row?.data?.path ?? ''
                        );
                        const superKey = path.split('/')[0] || '';
                        const color =
                            SUPER_SECTOR_COLORS[superKey] ?? '#7cb5ec';

                        return {
                            chart: {
                                type: 'bar',
                                height: 30,
                                margin: [2, 6, 2, 6],
                                animation: false
                            },
                            yAxis: {
                                visible: false,
                                min: 0,
                                max: 100
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: 1,
                                    pointPadding: 0.2,
                                    groupPadding: 0,
                                    pointWidth: 4,
                                    dataLabels: {
                                        crop: false,
                                        overflow: 'allow',
                                        useHTML: true,
                                        enabled: true,
                                        format: `<span style="color:${color};">{y:.2f}%</span>`
                                    }
                                },
                                series: {
                                    animation: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                color: color,
                                data: [cellValue]
                            }]
                        };
                    }
                }
            }
        },
        {
            id: 'Fixed_Income_PercLong',
            header: {
                format: 'Long (%)'
            },
            cells: {
                format: '{value:,.2f}'
            }
        },
        {
            id: 'Fixed_Income_PercShort',
            header: {
                format: 'Short'
            },
            cells: {
                format: '{value:,.2f}'
            }
        },
        {
            id: 'Fixed_Income_PercNet',
            header: {
                format: 'Net'
            },
            cells: {
                format: '{value:,.2f}'
            }
        }]
    });
}

init();
