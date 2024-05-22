const columns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    weight: [100, 40, 0.5, 200],
    price: [1.5, 2.53, 5, 4.5],
    metaData: ['a', 'b', 'c', 'd'],
    icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
};

// eslint-disable-next-line
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({ columns }),
    useHTML: true,
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
        },
        icon: {
            cellFormatter() {
                return `<a href="#">${this.value}</a>`;
            }
        }
    }
});
