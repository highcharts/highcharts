const dataTable = new Grid.DataTable({
    columns: {
        product: ['Apples', 'Pears', 'Plums', 'Bananas'],
        weight: [100, 40, 0.5, 200],
        price: [1.5, 2.53, 5, 4.5]
    }
});

Grid.grid('container', {
    data: {
        dataTable
    }
});
