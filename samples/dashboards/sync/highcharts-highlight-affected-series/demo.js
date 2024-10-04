const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'csv',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerText
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: [{
            id: 'csv',
            columnAssignment: [{
                seriesId: 'Y2020',
                data: ['Name', 'Y2020']
            }, {
                seriesId: 'Y2021',
                data: ['Name', 'Y2021']
            }, {
                seriesId: 'Y2022',
                data: ['Name', 'Y2022']
            }]
        }],
        sync: {
            highlight: true
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            series: [{
                type: 'column',
                name: '2020',
                id: 'Y2020'
            }, {
                type: 'column',
                name: '2021',
                id: 'Y2021'
            }, {
                type: 'column',
                name: '2022',
                id: 'Y2022'
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'DataGrid',
        title: {
            text: 'csv 1'
        },
        connector: {
            id: 'csv'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            credits: {
                enabled: false
            }
        }
    }]
});


/**
 * Custom code
 **/

const radioButtons = document.querySelectorAll('.option');

radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;

        board.mountedComponents[0].component.update({
            sync: {
                highlight: {
                    enabled: true,
                    affectedSeriesId: value
                }
            }
        });
    });
});
