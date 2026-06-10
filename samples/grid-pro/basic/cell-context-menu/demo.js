Grid.grid('container', {
    data: {
        columns: {
            id: ['SKU-1', 'SKU-2', 'SKU-3', 'SKU-4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            stock: [100, 40, 25, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
                items: [
                    {
                        type: 'submenu',
                        label: 'Cell actions',
                        items: [{
                            label: 'Show cell value',
                            icon: 'checkmark',
                            onClick: function (cell) {
                                document.getElementById('status').textContent =
                                    cell.column.id + ': ' + String(cell.value);
                            }
                        }]
                    },
                    {
                        type: 'separator'
                    },
                    'pinning',
                    {
                        type: 'action',
                        actionId: 'pinRowTop',
                        label: 'Custom pin to top'
                    }
                ]
            }
        }
    },
    columns: [{
        id: 'id',
        enabled: false
    }],
    rendering: {
        rows: {
            pinning: {
                idColumn: 'id'
            }
        }
    }
});
