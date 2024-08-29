DataGrid.dataGrid('container', {
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
    caption: {
        text: 'Open the console to see the events being logged.'
    },
    events: {
        cell: {
            click: function () {
                console.log('Cell click event', this);
            },
            mouseOver: function () {
                console.log('Cell mouse over event', this);
            },
            mouseOut: function () {
                console.log('Cell mouse out event', this);
            }
        }
    }
});
