const dg = DataGrid.dataGrid2('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    }
});

document.getElementById('destroy-btn').addEventListener('click', () => {
    dg.destroy();
    console.log(dg);
});

document.getElementById('load-btn').addEventListener('click', () => {
    dg.load();
    console.log(dg);
});
