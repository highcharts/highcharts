Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

let board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Food', 'Vitamin A',  'Iron'],
                data: [
                    ['Beef Liver', 6421, 6.5],
                    ['Lamb Liver', 2122, 6.5],
                    ['Cod Liver Oil', 1350, 0.9],
                    ['Mackerel', 388, 1],
                    ['Tuna', 214, 0.6]
                ]
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
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
        type: 'DataGrid',
        sync: {
            highlight: true,
            visibility: true
        },
        dataGridOptions: {
            credits: {
                enabled: false
            }
        }
    }]
});


/**
 * Demo UI section
 */

const exportBtn = document.getElementById('export');
const importBtn = document.getElementById('import');
const destroyBtn = document.getElementById('destroy');
const statusSpan = document.getElementById('ls-status-content');

exportBtn.addEventListener('click', () => {
    const config = JSON.stringify(
        board.getOptions(),
        null,
        2
    );

    localStorage.setItem(
        'highcharts-dashboards-config',
        config
    );
    destroyBtn.disabled = false;
    statusSpan.innerHTML = 'saved dashboards options in the local storage';
    statusSpan.style.color = '#191';

    document.querySelectorAll('#output')[0].value = config;
});

destroyBtn.addEventListener('click', () => {
    board.destroy();
    importBtn.disabled = false;
    exportBtn.disabled = destroyBtn.disabled = true;
    statusSpan.innerHTML = 'destroyed existing dashboards';
    statusSpan.style.color = '#971';
});

importBtn.addEventListener('click', () => {
    const dashboardsConfig =
        localStorage.getItem('highcharts-dashboards-config');
    board = Dashboards.board('container', JSON.parse(dashboardsConfig));
    exportBtn.disabled = destroyBtn.disabled = false;
    importBtn.disabled = true;
    statusSpan.innerHTML =
        'created new dashboards using the options from the local storage';
    statusSpan.style.color = '#179';
});
