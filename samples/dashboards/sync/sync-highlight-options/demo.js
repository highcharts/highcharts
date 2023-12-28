const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'VegeTable',
            type: 'CSV',
            options: {
                csv: document.querySelector('#csv').innerHTML
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'datagrid'
                }, {
                    id: 'chart'
                }]
            }]
        }]
    },
    components: [{
        type: 'DataGrid',
        cell: 'datagrid',
        connector: {
            id: 'VegeTable'
        },
        sync: {
            highlight: true
        }
    }, {
        type: 'Highcharts',
        cell: 'chart',
        connector: {
            id: 'VegeTable'
        },
        sync: {
            highlight: {
                enabled: true
            }
        },
        chartOptions: {
            xAxis: {
                crosshair: true
            },
            yAxis: {
                crosshair: true
            }
        }
    }]
});


/**
 * Custom code
 **/

const enabledCbx = document.querySelector('#enabled');
const optionsCbx = document.querySelectorAll('.option');

enabledCbx.addEventListener('change', () => {
    const { checked } = enabledCbx;
    const options = {};

    optionsCbx.forEach(checkbox => {
        checkbox.disabled = !checked;
        options[checkbox.id] = checkbox.checked;
    });

    board.mountedComponents[1].component.update({
        sync: {
            highlight: {
                enabled: checked,
                ...options
            }
        }
    });
});

optionsCbx.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const { checked, id } = checkbox;

        board.mountedComponents[1].component.update({
            sync: {
                highlight: {
                    [id]: checked
                }
            }
        });
    });
});
