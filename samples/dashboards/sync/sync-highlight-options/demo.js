const gridOptions = {
    type: 'Grid',
    connector: {
        id: 'vegetables'
    },
    sync: {
        highlight: true
    },
    gridOptions: {
        credits: {
            enabled: false
        }
    }
};
const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'vegetables',
            type: 'CSV',
            csv: document.querySelector('#csv').innerHTML
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'chart'
                }]
            }, {
                cells: [{
                    id: 'grid-0'
                }, {
                    id: 'grid-1'
                }]
            }]
        }]
    },
    components: [{
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
    }, {
        renderTo: 'grid-0',
        ...gridOptions
    }, {
        renderTo: 'grid-1',
        ...gridOptions
    }]
});


/**
 * Custom code
 **/

const optionsCbx = document.querySelectorAll('.option');

optionsCbx.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const { checked, dataset } = checkbox;
        const checkboxDataValue = dataset.value;

        if (checkboxDataValue === 'enabled') {
            optionsCbx.forEach(cbx => {
                if (cbx.dataset.value !== 'enabled') {
                    cbx.disabled = !checked;
                }
            });
        }

        const componentIndices =
            checkbox.id === 'cbx-grid-enabled' ? [1, 2] : [0];
        componentIndices.forEach(index => {
            board.mountedComponents[index].component.update({
                sync: {
                    highlight: {
                        [checkboxDataValue]: checked
                    }
                }
            });
        });
    });
});
