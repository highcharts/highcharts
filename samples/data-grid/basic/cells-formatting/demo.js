const { DataTable } = Dashboards;

const columns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    weight: [100, 40, 0.5, 200],
    price: [1.5, 2.53, 5, 4.5],
    metaData: ['a', 'b', 'c', 'd']
};

const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataTable({ columns }),
    columns: {
        product: {
            cellFormat: '{text} No. 1',
            headerFormat: '{text} name'
        },
        weight: {
            cellFormat: '{value} kg',
            headerFormat: '{text} (kg)'
        },
        price: {
            cellFormat: '{value} $',
            headerFormat: '($) {text}'
        },
        metaData: {
            show: false
        }
    }
});
