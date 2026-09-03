const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        },
        updateOnChange: true
    },
    rendering: {
        rows: {
            virtualization: false
        }
    }
});

document.getElementById('add-row').addEventListener('click', () => {
    const dt = grid.dataProvider.getDataTable();
    dt.setRow([dt.rowCount + 1, 'Oranges', 150, 3.5]);
});
