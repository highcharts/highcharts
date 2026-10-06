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

async function renderWidget() {

    Dashboards.board('container', {
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
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'chart'
                    }, {
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
            renderTo: 'chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    styledMode: true,
                    type: 'pie'
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
                    formatter: function () {
                        const value =
                            Math.abs(this.point.y) < 0.005 ? 0 : this.point.y,
                            colIndex = this.point.colorIndex,
                            name = this.point.name;

                        return `
                        <strong>
                            <span class="highcharts-color-${colIndex}">▬</span>
                            ${marketCapTypes[name]}
                            <span style="color:#8A8A8A;">
                            ${Highcharts.numberFormat(value, 2)}%</span>
                        </strong>
                        `;
                    }
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
                                colIndex = points.find(
                                    point => point.name === this.value
                                ).colorIndex;
                            // eslint-disable-next-line max-len
                            return `<span class="highcharts-color-${colIndex}">▬</span>
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

renderWidget();
