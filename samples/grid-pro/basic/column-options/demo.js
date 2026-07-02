Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columnDefaults: {
        width: 80,
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'product',
        width: 'auto'
    }, {
        id: 'weight',
        className: 'custom-column-class-name',
        width: '40%',
        cells: {
            formatter: function () {
                return 'V: ' + this.value;
            }
        }
    }, {
        id: 'metaData',
        enabled: false
    }]
});
