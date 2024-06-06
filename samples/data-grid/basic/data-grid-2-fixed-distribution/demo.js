const dg = new DataGrid.DataGrid2('container', {
    dataTable: new DataGrid.DataTable({
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    }),
    rows: {
        bufferSize: 5
    },
    columns: {
        distribution: 'fixed'
    }
});

console.log(dg);
