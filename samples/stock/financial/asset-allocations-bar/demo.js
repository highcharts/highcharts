const assetAllocationTypes = {
    1: 'Stock',
    2: 'Bond',
    3: 'Cash',
    4: 'Other',
    99: 'Not classified'
};

// Helper functions
Highcharts.Templating.helpers.translateAssetAllocation = value =>
    assetAllocationTypes[value];


async function renderWidget(orientation) {

    Dashboards.board(`${orientation}-container`, {
        dataPool: {
            // Fetch data with the Morningstar connector
            connectors: [{
                id: 'asset-allocations',
                type: 'MorningstarSecurityDetails',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                converter: {
                    type: 'AssetAllocations'
                },
                security: {
                    id: 'F00001GPCX',
                    idType: 'MSID'
                },
                dataModifier: {
                    type: 'Chain',
                    chain: [{
                        type: 'Sort',
                        direction: 'desc',
                        orderByColumn: 'MorningstarEUR3_N'
                    }, {
                        type: 'Math',
                        columnFormulas: [{
                            column: 'negative',
                            formula: 'PRODUCT(C1, -1)'
                        }]
                    }]
                }
            }]
        },
        gui: {
            layouts: orientation === 'horizontal' ? [{
                rows: [{
                    cells: [{
                        id: 'datagrid'
                    }, {
                        id: 'pie-chart'
                    }]
                }]
            }] : [{
                rows: [{
                    cells: [{
                        id: 'pie-chart'
                    }]
                }, {
                    cells: [{
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
                id: 'asset-allocations',
                columnAssignment: [{
                    seriesId: 'asset_net',
                    data: ['MorningstarEUR3_Type', 'MorningstarEUR3_N']
                }, {
                    seriesId: 'asset_short',
                    data: ['MorningstarEUR3_Type', 'negative']
                }, {
                    seriesId: 'asset_long',
                    data: ['MorningstarEUR3_Type', 'MorningstarEUR3_L']
                }]
            },
            renderTo: 'pie-chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'bar',
                    backgroundColor: 'transparent'
                },
                title: {
                    text: '',
                    verticalAlign: 'middle',
                    y: 30,
                    style: {
                        fontSize: '28px',
                        fontWeight: 'bold'
                    }
                },
                plotOptions: {
                    series: {
                        innerSize: '90%',
                        borderWidth: 2,
                        borderRadius: 2,
                        colors: [
                            '#014CE5',
                            '#29D36A',
                            '#EA293C',
                            '#000000',
                            '#ABABAB'
                        ],
                        dataLabels: {
                            enabled: false
                        },
                        colorByPoint: true,
                        grouping: false
                    }
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        format: '{translateAssetAllocation value}'
                    }
                },
                yAxis: {
                    labels: {
                        format: '{value}%'
                    },
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    format:
                        '<strong><span style="color:{point.color};">▬ </span>' +
                        '{translateAssetAllocation point.name} ' +
                        '{series.options.assetType} ' +
                        '<span style="color: #8A8A8A;">' +
                        '{point.y:,.2f}%</span></strong>'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                series: [{
                    id: 'asset_net',
                    assetType: 'Net',
                    zIndex: 1,
                    borderColor: 'white'
                }, {
                    id: 'asset_short',
                    assetType: 'Short',
                    opacity: 0.75
                }, {
                    id: 'asset_long',
                    assetType: 'Long',
                    opacity: 0.75
                }]
            }
        }, {
            renderTo: 'datagrid',
            connector: {
                id: 'asset-allocations'
            },
            type: 'Grid',
            sync: {
                highlight: true,
                visibility: true
            },
            title: {
                text: 'Aviva Investors - Emerging Markets Bond Fund K USD Acc',
                align: 'right',
                style: {
                    fontSize: '17px'
                }
            },
            gridOptions: {
                rendering: {
                    theme: 'theme-custom'
                },
                credits: {
                    enabled: false
                },
                header: [{
                    columnId: 'MorningstarEUR3_Type',
                    format: 'Asset Class'
                }, {
                    columnId: 'MorningstarEUR3_N',
                    format: 'Net'
                }, {
                    columnId: 'MorningstarEUR3_L',
                    format: 'Long'
                }, {
                    columnId: 'MorningstarEUR3_S',
                    format: 'Short'
                }],
                columnDefaults: {
                    resizing: false,
                    cells: {
                        editable: false
                    }
                },
                columns: [{
                    id: 'MorningstarEUR3_Type',
                    cells: {
                        formatter: function () {
                            const points =
                                    Highcharts.charts[0].series[0].points,
                                color = points.find(
                                    point => point.name === this.value
                                ).color;
                            return `<span style='color:${color};'>▬</span>
                                ${assetAllocationTypes[this.value]}`;
                        }
                    }
                }, {
                    id: 'MorningstarEUR3_N',
                    cells: {
                        format:
                            '<b>{value:.2f}</b> ' +
                            '<span style="color: #75738C;">%</span>'
                    }
                }, {
                    id: 'MorningstarEUR3_L',
                    cells: {
                        format: '<b>{value:.2f}</b> ' +
                        '<span style="color: #75738C;">%</span>'
                    }
                }, {
                    id: 'MorningstarEUR3_S',
                    cells: {
                        format: '<b>{value:.2f}</b> ' +
                        '<span style="color: #75738C;">%</span>'
                    }
                }]
            }
        }]
    }, true);
}

renderWidget('horizontal');
renderWidget('vertical');
