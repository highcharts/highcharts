const options = {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    }
};
const grid = Grid.grid('container', options);

document.getElementById('delete-rows-btn').addEventListener('click', () => {
    if (grid.dataTable) {
        grid.dataTable.deleteRows(0, 4);
        grid.viewport.updateRows();
    }
    console.log('deleted rows:', grid.dataTable);
});

document.getElementById('destroy-grid-btn').addEventListener('click', () => {
    grid.destroy(true);
    console.log('destroyed:', grid);
});

document.getElementById('destroy-ultimately-btn').addEventListener(
    'click',
    () => {
        grid.destroy();
        console.log('destroyed ultimately:', grid);
    }
);

document.getElementById('reload-btn').addEventListener('click', () => {
    grid.render();
    console.log('rendered:', grid);
});
