const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columns: [{
        id: 'product',
        sorting: {
            order: 'asc'
        }
    }]
});

document.getElementById('add-row').addEventListener('click', () => {
    grid.dataTable.setRow([grid.dataTable.rowCount + 1, 'Oranges', 100,  3.5]);
    grid.viewport.updateRows();
});
