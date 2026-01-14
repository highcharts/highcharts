Grid.setOptions({
    lang: {
        locale: 'en-US'
    }
});

Grid.grid('container', {
    dataTable: {
        columns: {
            date: [1640995200000, 1641081600000, 1641168000000, 1641254400000],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            },
            formatter: function () {
                return `Default value: ${this.value}`;
            }
        },
        useHTML: true
    },
    columns: [{
        id: 'date',
        header: {
            format: 'Date of purchase'
        },
        cells: {
            format: '{value:%[dbY]}'
        }
    }, {
        id: 'product',
        header: {
            format: '{id} name'
        }
    }, {
        id: 'weight',
        className: 'custom-column-class-name',
        width: '40%',
        cells: {
            format: '{value:,.1f} kg'
        }
    }, {
        id: 'price',
        cells: {
            format: '$ {value:.2f}'
        }
    }, {
        id: 'icon',
        cells: {
            formatter: function () {
                return `<a href="#">${this.value}</a>`;
            }
        }
    }, {
        id: 'metaData',
        enabled: false
    }]
});
