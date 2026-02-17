Grid.grid('container', {
    data: {
        providerType: 'local',
        autogenerateColumns: false,
        dataTable: {
            columns: {
                product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                revenue: [120, 85, 200, 150],
                ignoredByConfig: ['A', 'B', 'C', 'D']
            }
        }
    },
    columns: [{
        id: 'actions',
        dataId: null,
        cells: {
            valueGetter: function (cell) {
                return `Row ${cell.row.index + 1}`;
            }
        }
    }, {
        id: 'sales',
        dataId: 'revenue'
    }, {
        id: 'product'
    }]
});
