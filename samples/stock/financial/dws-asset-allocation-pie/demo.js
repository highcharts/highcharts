const assetAllocationTypes = {
    Stock: 'Stock',
    Bond: 'Bond',
    Cash: 'Cash',
    ConvBond: 'Conv Bond',
    Equity: 'Equity',
    Other: 'Other',
    CanadianEquity: 'Canadian Equity',
    InternationalEquity: 'International Equity',
    USEquity: 'US Equity',
    FixedIncome: 'Fixed Income'
};

// Helper functions
Highcharts.Templating.helpers.translateAssetAllocation = value =>
    assetAllocationTypes[value];

const pieChartOptions = {
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
            '<strong><span style="color:{point.color};">▬</span>' +
            ' {translateAssetAllocation point.name}' +
            '<span style="color: #8A8A8A;">{point.y:,.2f}%</span></strong>'
    },
    credits: {
        enabled: false
    }
};

const getGridOptionsForChart = num => ({
    rendering: {
        theme: 'theme-custom'
    },
    credits: {
        enabled: false
    },
    header: [{
        columnId: 'Type',
        format: 'Asset Class'
    }, {
        columnId: 'Net',
        format: 'Net'
    }, {
        columnId: 'Long',
        format: 'Long'
    }, {
        columnId: 'Short',
        format: 'Short'
    }],
    columnDefaults: {
        resizing: false,
        cells: {
            editable: false
        }
    },
    columns: [{
        id: 'Type',
        cells: {
            formatter: function () {
                const points = Highcharts.charts[num].series[0].points,
                    color = points.find(
                        point => point.name === this.value
                    ).color;
                return `<span style='color:${color};'>▬</span> ${
                    assetAllocationTypes[this.value]
                }`;
            }
        }
    }, {
        id: 'Net',
        cells: {
            format:
                '<b>{value:.2f}</b> <span style="color: #75738C;">%</span>'
        }
    }, {
        id: 'Long',
        cells: {
            format:
                '<b>{value:.2f}</b> <span style="color: #75738C;">%</span>'
        }
    }, {
        id: 'Short',
        cells: {
            format:
                '<b>{value:.2f}</b> <span style="color: #75738C;">%</span>'
        }
    }]
});

async function renderBoard() {

    Dashboards.board('container', {
        dataPool: { // Fetch data with the Morningstar connector
            connectors: [{
                id: 'asset-allocation-breakdown',
                type: 'MorningstarDWSInvestments',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                security: {
                    id: '0P00000FIA'
                },
                converters: {
                    AssetAllocationBreakdown: {}
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'basic-datagrid'
                    }, {
                        id: 'basic-pie-chart'
                    }]
                }, {
                    cells: [{
                        id: 'can-datagrid'
                    }, {
                        id: 'can-pie-chart'
                    }]
                }]
            }]
        },
        components: [{ // Asset Allocation Breakdown
            sync: {
                highlight: {
                    enabled: true,
                    group: 'basic-asset-alloc'
                }
            },
            connector: {
                id: 'asset-allocation-breakdown',
                dataTableKey: 'AssetAlloc',
                columnAssignment: [{
                    seriesId: 'asset allocations',
                    data: ['Type', 'Net']
                }]
            },
            renderTo: 'basic-pie-chart',
            type: 'Highcharts',
            chartOptions: pieChartOptions
        }, {
            renderTo: 'basic-datagrid',
            connector: {
                id: 'asset-allocation-breakdown',
                dataTableKey: 'AssetAlloc'
            },
            type: 'Grid',
            sync: {
                highlight: {
                    enabled: true,
                    group: 'basic-asset-alloc'
                }
            },
            title: {
                text: 'Capital Group Global Equity Fund (LUX) B',
                align: 'right',
                style: {
                    fontSize: '17px'
                }
            },
            gridOptions: getGridOptionsForChart(0)
        }, { // Canadian Asset Allocation Breakdown
            sync: {
                highlight: {
                    enabled: true,
                    group: 'can-asset-alloc'
                }
            },
            connector: {
                id: 'asset-allocation-breakdown',
                dataTableKey: 'CanadianAssetAlloc',
                columnAssignment: [{
                    seriesId: 'can asset allocations',
                    data: ['Type', 'Net']
                }]
            },
            renderTo: 'can-pie-chart',
            type: 'Highcharts',
            chartOptions: pieChartOptions
        }, {
            renderTo: 'can-datagrid',
            connector: {
                id: 'asset-allocation-breakdown',
                dataTableKey: 'CanadianAssetAlloc'
            },
            type: 'Grid',
            sync: {
                highlight: {
                    enabled: true,
                    group: 'can-asset-alloc'
                }
            },
            title: {
                text: 'Capital Group Global Equity Fund (LUX) B (Canadian)',
                align: 'right',
                style: {
                    fontSize: '17px'
                }
            },
            gridOptions: getGridOptionsForChart(1)
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

renderBoard();
