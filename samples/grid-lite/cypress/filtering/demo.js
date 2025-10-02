window.grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
                '13', '14', '15', '16', '17', '18', '19', '20'
            ],
            active: [
                true, null, false, true, true, false, null, true, false, true,
                null, false, true, true, false, null, true, false, true, false
            ],
            product: [
                'apples', 'pears', 'lums', 'apricots', 'bananas', 'oranges',
                'grapes', 'strawberries', 'blueberries', 'mangoes',
                'pineapples', 'kiwis', 'peaches', 'cherries', 'watermelons',
                'cantaloupe', 'raspberries', null, 'lemons', 'limes'
            ],
            weight: [
                100, 40, 5, 200, 120, null, 3, 25, 15, 350, 1200, 8, 150, 20,
                5000, 2000, 12, 18, 140, 110
            ],
            price: [
                1.5, 2.53, 5, 4.5, 0.89, 3.20, 6.75, 8.99, 12.50, 2.99, 4.25,
                1.89, 3.75, 7.20, 8.50, null, 9.25, 10.75, 2.15, 1.95
            ],
            url: [
                'http://path1.to', 'http://path2.to', 'http://path2.to',
                'http://path3.to', 'http://path4.to', 'http://path5.to',
                null, 'http://path7.to', 'http://path8.to',
                'http://path9.to', 'http://path10.to', 'http://path11.to',
                'http://path12.to', 'http://path13.to', 'http://path14.to',
                'http://path15.to', 'http://path16.to', 'http://path17.to',
                'http://path18.to', 'http://path19.to'
            ],
            icon: [
                'Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL',
                'Bananas URL', 'Oranges URL', 'Grapes URL', 'Strawberries URL',
                null, 'Mangoes URL', 'Pineapples URL', 'Kiwis URL',
                'Peaches URL', 'Cherries URL', 'Watermelons URL',
                'Cantaloupe URL', 'Raspberries URL', 'Blackberries URL',
                'Lemons URL', 'Limes URL'
            ],
            date: [
                '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04',
                '2025-10-05', '2025-10-06', '2025-10-07', '2025-10-08',
                '2025-10-09', '2025-10-10', '2025-10-11', '2025-10-12',
                '2025-10-13', '2025-10-14', null, '2025-10-16',
                '2025-10-17', '2025-10-18', '2025-10-19', '2025-10-20'
            ]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    header: [
        'id',
        'active',
        'date',
        {
            format: 'Product',
            columns: [{
                format: 'Product name',
                columnId: 'product'
            }, {
                format: 'Units',
                columns: [{
                    columnId: 'weight'
                }, {
                    format: 'Custom Price',
                    columnId: 'price'
                }]
            }]
        },
        {
            format: 'Product info',
            columns: [{
                format: 'Meta',
                columns: [{
                    columnId: 'url'
                }, {
                    columnId: 'icon'
                }]
            }]
        }
    ],
    columns: [{
        id: 'id'
    }, {
        id: 'weight',
        filtering: {
            condition: 'greaterThan',
            value: 1000
        }
    }, {
        id: 'url',
        filtering: {
            inline: true
        }
    }]
});
