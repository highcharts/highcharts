const contextMenu = Grid.CellContextMenuBuiltInActions;

contextMenu.registerBuiltInAction('showCellValue', {
    getLabel: function () {
        return 'Show cell value';
    },
    icon: 'checkmark',
    onClick: function (context) {
        document.getElementById('status').textContent =
            context.columnId + ': ' + String(context.cell.value);
    }
});

contextMenu.registerBuiltInGroup('sampleActions', {
    items: ['showCellValue']
});

Grid.grid('container', {
    data: {
        idColumn: 'id',
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
                        label: 'Sample actions',
                        items: ['sampleActions']
                    },
                    {
                        type: 'separator'
                    },
                    'pinning',
                    {
                        label: 'Show row ID',
                        icon: 'checkmark',
                        onClick: function (cell) {
                            document.getElementById('status').textContent =
                                'Row ID: ' + String(cell.row.id);
                        }
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
                enabled: true
            }
        }
    }
});
