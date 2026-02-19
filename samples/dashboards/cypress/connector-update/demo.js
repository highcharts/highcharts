Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            data: [
                ['Product Name', 'Quantity'],
                ['Laptop', 100],
                ['Smartphone', 150]
            ]
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Grid',
        connector: {
            id: 'data'
        }
    }]
}, true).then(async board => {
    const connector = await board.dataPool.getConnector('data');
    document.getElementById('btn').addEventListener('click', () => {
        connector.update({
            data: [
                ['Product Name', 'Quantity'],
                ['Fridge', 50],
                ['Dishwasher', 75]
            ]
        });
    });
});
