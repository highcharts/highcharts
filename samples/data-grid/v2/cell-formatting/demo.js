DataGrid.dataGrid2('container', {
    table: {
        columns: {
            date: [1640995200000, 1641081600000, 1641168000000, 1641254400000],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    defaults: {
        columns: {
            editable: true,
            useHTML: true
        }
    },
    columns: {
        date: {
            headFormat: 'Date of purchase',
            cellFormatter: function () {
                return new Date(this.value)
                    .toISOString()
                    .substring(0, 10);
            }
        },
        product: {
            headFormat: '{id} name'
        },
        weight: {
            className: 'custom-column-class-name',
            cellFormatter: function () {
                return `${this.value} kg`;
            }
        },
        price: {
            cellFormat: '$ {value:.2f}'
        },
        icon: {
            cellFormatter: function () {
                return `<a href="#">${this.value}</a>`;
            }
        },
        metaData: {
            enabled: false
        }
    }
});
