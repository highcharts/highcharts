let board;

/**
 * Demo UI section
 */
const statusSpan = document.getElementById('ls-status-content');
const exportBtn = document.getElementById('export');
const importBtn = document.getElementById('import');
const destroyBtn = document.getElementById('destroy');

const saveOptionsInLocalStorage = () => {
    const config = JSON.stringify(board.getOptions(), null, 2);

    // Add config to preview box
    document.querySelectorAll('#output')[0].value = config;

    localStorage.setItem('highcharts-dashboards-config', config);
    destroyBtn.disabled = false;
    statusSpan.innerHTML = 'saved dashboard configuration in local storage';
    statusSpan.style.color = '#191';
};

// Save dashboards options in local storage
exportBtn.addEventListener('click', saveOptionsInLocalStorage);

// Destroy dashboard
destroyBtn.addEventListener('click', () => {
    board.destroy();
    importBtn.disabled = false;
    exportBtn.disabled = destroyBtn.disabled = true;
    statusSpan.innerHTML = 'destroyed existing dashboard';
    statusSpan.style.color = '#971';
});

// Create dashboard
importBtn.addEventListener('click', () => {
    const dashboardsConfig =
        localStorage.getItem('highcharts-dashboards-config');
    board = Dashboards.board('container', JSON.parse(dashboardsConfig));
    exportBtn.disabled = destroyBtn.disabled = false;
    importBtn.disabled = true;
    statusSpan.innerHTML =
        'created new dashboard using the configuration from local storage';
    statusSpan.style.color = '#179';
});

/**
 * Dashboard
 */
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            firstRowAsNames: false,
            columnIds: ['Food', 'Vitamin A',  'Iron'],
            data: [
                ['Beef Liver', 6421, 6.5],
                ['Lamb Liver', 2122, 6.5],
                ['Cod Liver Oil', 1350, 0.9],
                ['Mackerel', 388, 1],
                ['Tuna', 214, 0.6]
            ]
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                type: 'button',
                events: {
                    click: saveOptionsInLocalStorage
                }
            }]
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
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
            id: 'micro-element',
            columnAssignment: [{
                seriesId: 'Vitamin A',
                data: ['Food', 'Vitamin A']
            }]
        },
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Groceries'
                }
            },
            yAxis: {
                title: {
                    text: 'mcg'
                },
                plotLines: [{
                    value: 900,
                    zIndex: 7,
                    dashStyle: 'shortDash',
                    label: {
                        text: 'RDA',
                        align: 'right',
                        style: {
                            color: '#B73C28'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 6
                    }
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'top'
            },
            chart: {
                animation: false,
                type: 'column',
                spacing: [30, 30, 30, 20]
            },
            title: {
                text: ''
            },
            tooltip: {
                valueSuffix: ' mcg',
                stickOnContact: true
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Vitamin A in food. Highcharts ' +
                        'Interactive Chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Vitamin A amount in
                micrograms for some groceries. There is a plotLine demonstrating
                the daily Recommended Dietary Allowance (RDA) of 900
                micrograms.`,
                point: {
                    valueSuffix: ' mcg'
                }
            }
        }
    }, {
        renderTo: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'micro-element',
            columnAssignment: [{
                seriesId: 'Iron',
                data: ['Food', 'Iron']
            }]
        },
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Groceries'
                }
            },
            yAxis: {
                title: {
                    text: 'mcg'
                },
                max: 8,
                plotLines: [{
                    value: 8,
                    dashStyle: 'shortDash',
                    label: {
                        text: 'RDA',
                        align: 'right',
                        style: {
                            color: '#B73C28'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 6
                    }
                }
            },
            title: {
                text: ''
            },
            legend: {
                enabled: true,
                verticalAlign: 'top'
            },
            chart: {
                animation: false,
                type: 'column',
                spacing: [30, 30, 30, 20]
            },
            tooltip: {
                valueSuffix: ' mcg',
                stickOnContact: true
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Iron in food. Highcharts ' +
                        'Interactive Chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Iron amount in
                micrograms for some groceries. There is a plotLine demonstrating
                the daily Recommended Dietary Allowance (RDA) of 8
                micrograms.`,
                point: {
                    valueSuffix: ' mcg'
                }
            }
        }
    }, {
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'micro-element'
        },
        type: 'Grid',
        sync: {
            highlight: true,
            visibility: true
        },
        gridOptions: {
            credits: {
                enabled: false
            }
        }
    }]
});
