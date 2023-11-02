Highcharts.chart('container', {

    series: [{
        type: 'sankey',
        keys: ['from', 'to', 'weight'],
        linkOpacity: 1,
        linkColorMode: 'gradient',
        data: [{
            from: 'A',
            to: 'B',
            weight: 0.3,
            linkColorMode: 'from' // Color from 'from' node (fromNode)
        }, {
            from: 'A',
            to: 'C',
            weight: 0.5
            // Gradient color based on 'from' and 'to' nodes
        }, {
            from: 'B',
            to: 'D',
            weight: 0.3,
            linkColorMode: 'to' // Color from 'to' node (toNode)
        }, {
            from: 'C',
            to: 'D',
            weight: 0.3,
            color: { // Custom gradient color
                linearGradient: {
                    x1: 1,
                    x2: 0,
                    y1: 0,
                    y2: 0
                },
                stops: [
                    [0, 'black'],
                    [1, 'pink']
                ]
            }
        }
        ]
    }]

});
