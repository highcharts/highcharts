const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20
            ],
            active: [
                true, null, false, true, true, false, null, true, false, true,
                null, false, true, true, false, null, true, false, true, false
            ],
            product: [
                'Apples', 'Pears', 'Plums', 'Apricots', 'Bananas', 'Oranges',
                'Grapes', 'Strawberries', 'Blueberries', 'Mangoes',
                'Pineapples', 'Kiwis', 'Peaches', 'Cherries', 'Watermelons',
                'Cantaloupe', 'Raspberries', null, 'Lemons', 'Limes'
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
                Date.UTC(2025, 9, 1), Date.UTC(2025, 9, 2),
                Date.UTC(2025, 9, 3), Date.UTC(2025, 9, 4),
                Date.UTC(2025, 9, 5), Date.UTC(2025, 9, 6),
                Date.UTC(2025, 9, 7), Date.UTC(2025, 9, 8),
                Date.UTC(2025, 9, 9), Date.UTC(2025, 9, 10),
                Date.UTC(2025, 9, 11), Date.UTC(2025, 9, 12),
                Date.UTC(2025, 9, 13), Date.UTC(2025, 9, 14),
                null, Date.UTC(2025, 9, 16),
                Date.UTC(2025, 9, 17), Date.UTC(2025, 9, 18),
                Date.UTC(2025, 9, 19), Date.UTC(2025, 9, 20)
            ]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    columns: [{
        id: 'id',
        width: 60
    }, {
        id: 'date',
        dataType: 'datetime',
        cells: {
            format: '{value:%Y-%m-%d}'
        }
    }, {
        id: 'weight',
        filtering: {
            condition: 'greaterThan',
            value: 100
        }
    }]
});

// Add event listener for inline toggle checkbox
document.getElementById('inlineToggle').addEventListener('change', e => {
    grid.update({
        columnDefaults: {
            filtering: {
                inline: e.target.checked
            }
        }
    });
});
