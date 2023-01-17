const dashboard = new Dashboard.Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-4'
                }]
            }]
        }]
    },
    components: [{
        type: 'html',
        cell: 'dashboard-col-4',
        elements: [
            {
                tagName: 'div',
                style: { 'text-align': 'center' },
                textContent: 'Placeholder text'
            }
        ]
    }]
});