Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey diagram'
    },

    subtitle: {
        text: 'Styled mode'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
            ['Oil', 'Transportation', 94],
            ['Natural Gas', 'Transportation', 3],
            ['Coal', 'Transportation', 0],
            ['Renewable', 'Transportation', 0],
            ['Nuclear', 'Transportation', 3],

            ['Oil', 'Industrial', 41],
            ['Natural Gas', 'Industrial', 40],
            ['Coal', 'Industrial', 7],
            ['Renewable', 'Industrial', 11],
            ['Nuclear', 'Industrial', 0],

            ['Oil', 'R&C', 17],
            ['Natural Gas', 'R&C', 76],
            ['Coal', 'R&C', 1],
            ['Renewable', 'R&C', 7],
            ['Nuclear', 'R&C', 0],

            ['Oil', 'Electric Power', 1],
            ['Natural Gas', 'Electric Power', 18],
            ['Coal', 'Electric Power', 48],
            ['Renewable', 'Electric Power', 11],
            ['Nuclear', 'Electric Power', 22]

        ],
        nodes: [{
            id: 'Oil',
            colorIndex: 0
        }, {
            id: 'Natural Gas',
            colorIndex: 1
        }, {
            id: 'Coal',
            colorIndex: 2
        }, {
            id: 'Renewable',
            colorIndex: 3
        }, {
            id: 'Nuclear',
            colorIndex: 4
        }, {
            id: 'R&C',
            name: 'Residential & Commercial'
        }],
        type: 'sankey',
        name: 'Energy in the United States'
    }]

});
