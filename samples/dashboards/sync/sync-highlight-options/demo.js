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

document.querySelectorAll('.option').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const { checked, id } = checkbox;
        const chartComponent = board.mountedComponents[1].component;

        chartComponent.update({
            sync: {
                highlight: {
                    [id]: checked
                }
            }
        });
        console.log(chartComponent.options.sync.highlight);
    });
});
