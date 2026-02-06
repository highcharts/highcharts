Highcharts.chart('container', {
    title: {
        text: 'Sankey node disable toggle (countries)'
    },
    subtitle: {
        text: 'Click a node to disable/enable.'
    },
    plotOptions: {
        sankey: {
            allowNodeToggle: true,
            disabledNodeHeight: 20,
            disabledNodeColor: 'gray'
        }
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        type: 'sankey',
        name: 'Country flow',
        nodes: [{
            id: 'Canada',
            color: '#7cb5ec'
        }, {
            id: 'Germany',
            color: '#8085e9'
        }, {
            id: 'Japan',
            color: '#90ed7d'
            // disabled: true
        }, {
            id: 'Australia',
            color: '#f15c80'
        }, {
            id: 'Brazil',
            color: '#f45b5b'
        }, {
            id: 'India',
            color: '#91e8e1'
        }, {
            id: 'Norway',
            color: '#2b908f'
        }, {
            id: 'Other',
            color: '#e4d354'
        }, {
            id: 'Spain',
            color: '#a6c8ff'
        }],
        data: [
            ['Canada', 'Germany', 12],
            ['Canada', 'Spain', 3],
            ['Germany', 'Japan', 4],
            ['Germany', 'Brazil', 2],
            ['Germany', 'India', 1],
            ['Germany', 'Norway', 1],
            ['Germany', 'Other', 1],
            ['Spain', 'Japan', 3],
            ['Spain', 'Norway', 2],
            ['Japan', 'Brazil', 1],
            ['Japan', 'India', 1],
            ['Japan', 'Other', 1],
            ['Brazil', 'Australia', 1],
            ['India', 'Australia', 1],
            ['Norway', 'Australia', 1]
        ]
    }],
    tooltip: {
        nodeFormat: '{point.name}: <b>{point.sum}</b><br/>',
        pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: ' +
            '<b>{point.weight}</b><br/>'
    }
});
