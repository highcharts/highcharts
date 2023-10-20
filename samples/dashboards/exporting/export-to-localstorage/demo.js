const csvData = document.getElementById('csv').innerText;
let board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [
            {
                id: 'layout-1',
                rowClassName: 'custom-row',
                cellClassName: 'custom-cell',
                rows: [
                    {
                        cells: [
                            {
                                id: 'dashboard-col-0',
                                width: '50%'
                            },
                            {
                                id: 'dashboard-col-1'
                            },
                            {
                                id: 'dashboard-col-12'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    components: [{
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    },
    {
        cell: 'dashboard-col-12',
        connector: {
            id: 'Vitamin'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true
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
    localStorage.setItem(
        'highcharts-dashboards-config',
        JSON.stringify(
            board.getOptions(),
            null,
            2
        )
    );
    destroyBtn.disabled = false;
    statusSpan.innerHTML = 'saved dashboards options in the local storage';
    statusSpan.style.color = '#191';
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
