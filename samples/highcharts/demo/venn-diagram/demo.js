Highcharts.chart('container', {
    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. Intersection: {sets}. ' +
                '{#if (gt sets.length 1)}{name}. {/if}' +
                'Value {value}'
        }
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
