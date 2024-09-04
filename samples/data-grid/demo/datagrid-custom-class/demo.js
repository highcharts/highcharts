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
        cellClassName: '{#if (gt value 100)}underline{/if}',
        headerCellClassName: 'header-cell-custom-class-{column.id}'
    },
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name'
    }]
});
