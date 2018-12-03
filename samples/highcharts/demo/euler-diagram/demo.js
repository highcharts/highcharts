// Description of euler and venn diagram. Source: Wikipedia.
var description = {
    euler: [
        'An Euler diagram is a diagrammatic means of representing sets and their',
        'relationships. Unlike Venn diagrams, which show all possible relations',
        'between different sets, the Euler diagram shows only relevant',
        'relationships.'
    ].join(' '),
    venn: [
        'In Venn diagrams the curves are overlapped in every possible way,',
        'showing all possible relations between the sets. They are thus a',
        'special case of Euler diagrams, which do not necessarily show all',
        'relations'
    ].join(' ')
};

Highcharts.chart('container', {
    series: [{
        type: 'venn',
        data: [{
            sets: ['A'],
            value: 4,
            name: 'Euler diagrams'
        }, {
            sets: ['B'],
            value: 2,
            name: 'Venn diagrams'
        }, {
            sets: ['A', 'B'],
            value: 2
        }]
    }],
    tooltip: {
        formatter: function () {
            var point = this.point,
                name = point.name;
            return (
                (name === 'Euler diagrams') ?
                description.euler :
                description.venn
            ) + '</br>Source: Wikipedia';
        },
        useHTML: true
    },
    title: {
        text: 'Relationship between Euler and Venn diagrams'
    }
});
