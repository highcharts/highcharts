Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                editMode: {
                    hiddenToolbarItems: ['destroy']
                },
                cells: [{
                    id: 'dashboard-col-0',
                    editMode: {
                        hiddenToolbarItems: ['settings', 'destroy']
                    }
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'HTML',
        html: `
            <div>
                <h1>Main component</h1>
                <span id="custom-html-div">Allow only to move and resize</span>
            </div>
        `
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
