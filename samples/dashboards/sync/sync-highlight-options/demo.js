const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'vegetables',
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
        renderTo: 'datagrid',
        connector: {
            id: 'vegetables'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            credits: {
                enabled: false
            }
        }
    }, {
        type: 'Highcharts',
        renderTo: 'chart',
        connector: {
            id: 'vegetables'
        },
        sync: {
            highlight: {
                enabled: true
            }
        },
        chartOptions: {
            title: {
                text: 'Example chart'
            },
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

const optionsCbx = document.querySelectorAll('.option');

optionsCbx.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const value = checkbox.dataset.value;
        const { checked } = checkbox;

        if (value === 'enabled') {
            optionsCbx.forEach(cbx => {
                if (cbx.dataset.value !== 'enabled') {
                    cbx.disabled = !checked;
                }
            });
        }

        board.mountedComponents[1].component.update({
            sync: {
                highlight: {
                    [value]: checked
                }
            }
        });
    });
});
