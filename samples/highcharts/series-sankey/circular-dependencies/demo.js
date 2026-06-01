Highcharts.chart('container', {
    chart: {
        type: 'sankey'
    },
    title: {
        text: 'Highcharts Sankey Diagram'
    },
    subtitle: {
        text: 'Circular dependencies and self-referencing links'
    },
    accessibility: {
        description: 'An abstract Sankey diagram where the flow loops back ' +
            'on itself: the links b → a and c → b return to earlier nodes, ' +
            'and node d links to itself.'
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
            ['a', 'b', 5],
            ['b', 'c', 10],
            // Loops back to an earlier column (circular links)
            ['b', 'a', 5],
            ['c', 'd', 5],
            ['c', 'b', 5],
            // Self-referencing link
            ['d', 'd', 5]
        ],
        type: 'sankey',
        name: 'Sankey demo series'
    }],
    tooltip: {
        // Appended to a node tooltip when the node has a self-referencing link
        nodeSelfLinkFormat: 'Loops back to itself: ' +
            '<b>{selfLinkWeight}</b><br/>'
    }
});
