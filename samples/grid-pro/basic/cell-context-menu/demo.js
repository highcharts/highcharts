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
    getLabel: function () {
        return 'Cell actions';
    },
    icon: 'checkmark',
    isActive: function () {
        return true;
    },
    items: ['showCellValue']
});

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
                    'sampleActions',
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
