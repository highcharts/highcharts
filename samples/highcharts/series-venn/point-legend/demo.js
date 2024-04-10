Highcharts.chart('container', {
    series: [{
        showInLegend: true,
        type: 'venn',
        name: 'The Unattainable Triangle',
        data: [{
            sets: ['Good'],
            value: 2,
            name: 'Good'
        }, {
            sets: ['Fast'],
            value: 2,
            name: 'Fast'
        }, {
            sets: ['Cheap'],
            value: 2,
            name: 'Cheap'
        }, {
            sets: ['Good', 'Fast'],
            value: 1,
            name: 'More expensive'
        }, {
            sets: ['Good', 'Cheap'],
            value: 1,
            name: 'Will take time to deliver'
        }, {
            sets: ['Fast', 'Cheap'],
            value: 1,
            name: 'Not the best quality'
        }, {
            sets: ['Fast', 'Cheap', 'Good'],
            value: 1,
            name: 'They\'re dreaming'
        }]
    }],

    title: {
        text: 'The Unattainable Triangle'
    },

    subtitle: {
        text: 'A venn diagram with legend enabled'
    }
});