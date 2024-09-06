DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 120, 4.5]
        }
    },
    columnDefaults: {
        editable: true,
        cells: {
            className: '{#if (gt value 100)}greater-than-100{/if}'
        },
        header: {
            className: 'header-cell-custom-class-{column.id}'
        }
    },
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name'
    }]
});
