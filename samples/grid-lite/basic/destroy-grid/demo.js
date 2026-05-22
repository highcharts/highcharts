const options = {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    }
};
let grid = Grid.grid('container', options);

document.getElementById('delete-rows-btn').addEventListener('click', () => {
    const dataTable = grid.dataProvider.getDataTable();

    if (dataTable) {
        dataTable.deleteRows(0, 4);
        grid.viewport.updateRows();
    }
    console.log('deleted rows:', dataTable);
});

document.getElementById('destroy-grid-btn').addEventListener('click', () => {
    grid.destroy();
    console.log('destroyed:', grid);
});

document.getElementById('reload-btn').addEventListener('click', () => {
    grid.destroy();
    grid = Grid.grid('container', options);
    console.log('created:', grid);
});
