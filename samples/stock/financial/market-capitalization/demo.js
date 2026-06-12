const marketCapTypes = {
    1: 'Giant',
    2: 'Large',
    3: 'Medium',
    4: 'Small',
    5: 'Micro'
};

// Helper functions
Highcharts.Templating.helpers.translateMarketType = value =>
    marketCapTypes[value];

async function renderWidget(orientation) {

    Dashboards.board(`${orientation}-container`, {
        dataPool: {
            connectors: [{
                id: 'market-cap',
                type: 'MorningstarSecurityDetails',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                converter: {
                    type: 'MarketCap'
                },
                viewId: 'HSsnapshot',
                security: {
                    id: 'F0GBR052QA',
                    idType: 'MSID'
                },
                dataModifier: {
                    type: 'Sort',
                    direction: 'desc',
                    orderByColumn: 'N'
                }
            }]
        },
        gui: {
            layouts: orientation === 'horizontal' ? [{
                rows: [{
                    cells: [{
                        id: 'pie-chart'
                    }, {
                        id: 'datagrid'
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
                id: 'market-cap',
                columnAssignment: [{
                    seriesId: 'market cap',
                    data: ['Type', 'N']
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
                    text: 'Total types',
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
                        '<strong><span style="color:{point.color}; ' +
                        'font-size:13px;">▬ </span>' +
                        '{translateMarketType point.name} ' +
                        '<span style="color: #8A8A8A;">' +
                        '{point.y:.2f}%</span></strong>'
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            renderTo: 'datagrid',
            connector: {
                id: 'market-cap'
            },
            type: 'Grid',
            sync: {
                highlight: true,
                visibility: true
            },
            title: {
                text: 'BlackRock Market Capital Breakdown',
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
                    columnId: 'Type',
                    format: 'Stock Size'
                }, {
                    columnId: 'N',
                    format: 'Exposure'
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
                            const points =
                                    Highcharts.charts[0].series[0].points,
                                color = points.find(
                                    point => point.name === this.value
                                ).color;
                            return `
                                <span style='color:${color};'>▬</span>
                                ${marketCapTypes[this.value]}`;
                        }
                    }
                }, {
                    id: 'N',
                    cells: {
                        format:
                            '<b>{value:.2f}</b> ' +
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
