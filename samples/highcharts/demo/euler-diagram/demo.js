Highcharts.chart('container', {
    accessibility: {
        point: {
            valueDescriptionFormat: '{point.name}: {point.longDescription}.'
        }
    },
    series: [{
        type: 'venn',
        data: [{
            sets: ['A'],
            value: 4,
            name: 'Euler diagrams',
            longDescription: 'An Euler diagram is a diagrammatic means of representing sets and their ' +
                'relationships. Unlike Venn diagrams, which show all possible relations ' +
                'between different sets, the Euler diagram shows only relevant ' +
                'relationships.'
        }, {
            sets: ['B'],
            value: 1,
            name: 'Venn diagrams',
            longDescription: 'In Venn diagrams the curves are overlapped in every possible way, ' +
                'showing all possible relations between the sets. They are thus a ' +
                'special case of Euler diagrams, which do not necessarily show all ' +
                'relations'
        }, {
            sets: ['A', 'B'],
            value: 1
        }]
    }],
    tooltip: {
        headerFormat:
            '<span style="color:{point.color}">\u2022</span> ' +
            '<span style="font-size: 14px"> {point.point.name}</span><br/>',
        pointFormat: '{point.longDescription}<br><span style="font-size: 10px">Source: Wikipedia</span>'
    },
    title: {
        text: 'Relationship between Euler and Venn diagrams',
        align: 'left'
    }
});
