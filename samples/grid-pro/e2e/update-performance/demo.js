Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs',
                'Grapes', 'Kiwis', 'Mangoes', 'Oranges', 'Peaches',
                'Strawberries', 'Blueberries', 'Raspberries', 'Blackberries',
                'Watermelons', 'Cantaloupes', 'Honeydews', 'Pineapples',
                'Papayas', 'Guavas', 'Pomegranates', 'Persimmons', 'Lychees',
                'Dragonfruit', 'Starfruit', 'Passionfruit', 'Coconuts', 'Dates',
                'Apricots', 'Nectarines', 'Tangerines', 'Clementines',
                'Grapefruits', 'Lemons', 'Limes', 'Avocados', 'Cranberries',
                'Gooseberries', 'Mulberries', 'Elderberries', 'Currants',
                'Quinces', 'Kumquats', 'Loquats', 'Rambutan', 'Durian',
                'Jackfruit', 'Breadfruit', 'Ackee'
            ],
            weight: [
                100, 40, 0.5, 200, 10, 20, 5, 75, 300, 150, 120, 15, 2, 5, 4,
                5000, 2000, 1800, 900, 500, 90, 250, 170, 15, 400, 120, 35,
                1500, 8, 45, 140, 88, 75, 400, 58, 67, 200, 1, 3, 2, 1.5, 0.8,
                300, 20, 25, 30, 2000, 10000, 2500, 450
            ],
            price: [
                1.5, 2.53, 5, 4.5, 3.7, 2.1, 2.8, 3.2, 4.8, 1.9, 2.7, 4.5, 5.5,
                6.2, 5.8, 8.5, 6.0, 5.5, 3.9, 3.5, 2.8, 4.2, 3.6, 7.5, 6.8, 4.9,
                5.2, 2.5, 8.5, 2.9, 2.4, 2.2, 2.0, 2.1, 0.8, 0.9, 3.5, 4.8, 3.2,
                4.1, 3.9, 4.5, 3.0, 3.8, 3.3, 8.2, 15.5, 12.0, 9.5, 7.8
            ]
        }
    },
    columns: [{
        id: 'product',
        // Make sure the filter icon is visible.
        width: 200,
        filtering: {
            condition: 'contains',
            value: 'berries',
            enabled: true
        }
    }]
});
