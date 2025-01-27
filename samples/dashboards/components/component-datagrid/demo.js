Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['Product Name', 'Quantity', 'Revenue', 'Category'],
                    ['Laptop', 100, 2000, 'Electronics'],
                    ['Smartphone', 150, 3300, 'Electronics'],
                    ['Desk Chair', 120, 2160, 'Furniture'],
                    ['Coffee Maker', 90, 1890, 'Appliances'],
                    ['Headphones', 200, 3200, 'Electronics'],
                    ['Dining Table', 130, 2470, 'Furniture'],
                    ['Refrigerator', 170, 2890, 'Appliances']
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-id',
                    width: '30%'
                }, {
                    id: 'cell-id-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        renderTo: 'cell-id',
        elements: [{
            tagName: 'h1',
            textContent: 'Sales in the last 7 days'
        }]
    }, {
        type: 'DataGrid',
        renderTo: 'cell-id-2',
        connector: {
            id: 'data'
        },
        dataGridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                id: 'Revenue',
                header: {
                    format: '{id} (€)'
                }
            }, {
                id: 'Category',
                enabled: false
            }]
        }
    }]
});
