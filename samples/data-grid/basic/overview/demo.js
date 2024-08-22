DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes',
                'Strawberries', 'Blueberries', 'Cherries', 'Mangoes'
            ],
            weight: [100, 40, 0.5, 200, 150, 120, 50, 30, 25, 200],
            price: [1.5, 2.53, 5, 4.5, 3, 2.8, 6, 4.2, 7, 3.5],
            metaData: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
            icon: [
                'Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL',
                'Oranges URL', 'Grapes URL', 'Strawberries URL',
                'Blueberries URL', 'Cherries URL', 'Mangoes URL'
            ]
        }
    },
    settings: {
        caption: {
            text: 'Fruit market'
        }
    },
    defaults: {
        columns: {
            editable: false
        }
    },
    columns: {
        product: {
            cellFormat: '{value} No. 1',
            headerFormat: '{id} name'
        },
        weight: {
            cellFormat: '{value} kg',
            headerFormat: '{id} (kg)'
        },
        price: {
            cellFormat: '{value} $',
            headerFormat: '($) {id}'
        },
        metaData: {
            enabled: false
        }
    }
});
