/* eslint-disable max-len */
Grid.grid('container', {
    gridKey: 'YOUR-GRID-KEY-HERE', // TODO: replace with your grid key
    data: {
        connector: {
            type: 'MorningstarDWSInvestments',
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
        },
        dataTableKey: 'IncAllSectors',
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
                                    enabled: true,
                                    format: '{y:.2f}%'
                                }
                            },
                            series: {
                                animation: false
                            }
                        },
                        series: [{
                            type: 'bar',
                            data: [cellValue],
                            zones: [{
                                value: 10,
                                color: 'red'
                            }, {
                                value: 30,
                                color: 'yellow'
                            }, {
                                color: 'green'
                            }]
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
            format: 'Short (%)'
        },
        cells: {
            format: '{value:,.2f}'
        }
    },
    {
        id: 'Fixed_Income_PercNet',
        header: {
            format: 'Net (%)'
        },
        cells: {
            format: '{value:,.2f}'
        }
    }]
});
