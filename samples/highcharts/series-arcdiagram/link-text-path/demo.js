Highcharts.chart('container', {

    title: {
        text: 'Highcharts Arc Diagram'
    },
    subtitle: {
        text: 'Arc Diagram with linkTextPath'
    },
    series: [{
        linkWeight: 1,
        keys: ['from', 'to', 'weight'],
        type: 'arcdiagram',
        centeredLinks: true,
        dataLabels: {
            format: '{point.fromNode.name} → {point.toNode.name}',
            nodeFormat: '{point.name}',
            color: 'black',
            linkTextPath: {
                enabled: true
            }
        },
        data: [
            ['Brazil', 'Portugal', 5],
            ['Brazil', 'France', 1],
            ['Brazil', 'Spain', 1],
            ['Brazil', 'England', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 5],
            ['Canada', 'England', 1]
        ]
    }]

});
