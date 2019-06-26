Highcharts.chart('container', {
    accessibility: {
        description: 'A Venn diagram constructed from three intersecting circles illustrates the Unattainable Triangle. The three circles are labeled, in a clockwise direction, Fast, Cheap and Good. The intersections are as follows: Fast and Cheap equals Not the Best Quality. Cheap and Good equals Will Take Time to Deliver. Good and Fast equals More Expensive. Fast, Cheap and Good equals They’re Dreaming.'
    },
    series: [{
        type: 'venn',
        name: 'The Unattainable Triangle',
        data: [{
            sets: ['Good'],
            value: 2
        }, {
            sets: ['Fast'],
            value: 2
        }, {
            sets: ['Cheap'],
            value: 2
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
    }
});
