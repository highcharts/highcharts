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
                    id: 'F00000ZY5F',
                    idType: 'MSID'
                },
                dataModifier: {
                    type: 'Sort',
                    direction: 'desc',
                    orderByColumn: 'MorningstarEUR3_N'
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
                    seriesId: 'asset allocations',
                    data: ['MorningstarEUR3_Type', 'MorningstarEUR3_N']
                }]
            },
            renderTo: 'pie-chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'pie',
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
                subtitle: {
                    text: 'Total assets',
                    y: -10,
                    verticalAlign: 'middle',
                    style: {
                        fontSize: '14px',
                        color: '#767676'
                    }
                },
                plotOptions: {
                    pie: {
                        innerSize: '90%',
                        borderWidth: 4,
                        borderRadius: '50%',
                        colors: [
                            '#014CE5',
                            '#29D36A',
                            '#EA293C',
                            '#000',
                            '#ABABAB'
                        ],
                        dataLabels: {
                            enabled: false
                        },
                        states: {
                            hover: {
                                halo: {
                                    size: -30
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    format:
                        '<strong><span style="color:{point.color};">▬</span> ' +
                        '{translateAssetAllocation point.name} ' +
                        '<span style="color: #8A8A8A;">{point.y:,.2f}%' +
                        '</span></strong>'
                },
                credits: {
                    enabled: false
                }
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
                text: 'M&G (Lux) Income Allocation Fund EUR A Acc.',
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
                        format: '<b>{value:.2f}</b> ' +
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
    }, true)
        // After the dashboard is mounted and data is fetched,
        // count the number of asset types and update the chart title.
        .then(dash => {
            function setAssetsCount() {
                Highcharts.charts.forEach(chart => chart.update({
                    title: {
                        text: chart.series[0].data.filter(
                            obj => obj.y >= 0.01
                        ).length
                    }
                }));
            }

            dash.mountedComponents[0].component.on(
                'afterSetConnectors',
                setAssetsCount()
            );
        });
}

renderWidget('horizontal');
renderWidget('vertical');
