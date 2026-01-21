// Create initial dashboard
let board = Dashboards.board('container', {
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
        type: 'HTML',
        renderTo: 'dashboard-col-0',
        elements: [{
            tagName: 'h1',
            textContent: 'Your first dashboard'
        }]
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        id: 'chart-component',
        chartOptions: {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Initial Data'
            },
            series: [{
                name: 'Sales',
                data: [10, 20, 30, 40]
            }]
        }
    }]
});

// Update button handler
document.getElementById('update-btn').addEventListener('click', function () {
    // Update the dashboard with new options
    // Note: update() returns a new Board instance
    board.update({
        components: [{
            type: 'HTML',
            renderTo: 'dashboard-col-0',
            id: 'html-component',
            elements: [{
                tagName: 'h1',
                textContent: 'Updated Dashboard'
            }]
        }, {
            renderTo: 'dashboard-col-1',
            type: 'Highcharts',
            id: 'chart-component',
            chartOptions: {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Updated Data'
                },
                series: [{
                    name: 'Revenue',
                    data: [50, 60, 70, 80, 90]
                }]
            }
        }]
    });

    console.log(board);
});
