Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Networkgraph with styled links and nodes'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to']
        }
    },
    series: [{
        name: 'K3',
        color: '#A53E32',
        link: {
            width: 2,
            color: '#A53E32',
            length: 80,
            dashStyle: 'dash'
        },
        marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: '#A53E32'
        },
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['B', 'C']
        ]
    }, {
        name: 'K4',
        color: '#131313',
        link: {
            width: 2,
            color: '#131313',
            length: 80,
            dashStyle: 'dash'
        },
        marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: '#131313'
        },
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],
            ['B', 'C'],
            ['B', 'D'],
            ['C', 'D']
        ]
    }, {
        name: 'K8',
        color: '#B5B5B5',
        link: {
            width: 2,
            color: '#B5B5B5',
            length: 80,
            dashStyle: 'dash'
        },
        marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: '#B5B5B5'
        },
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],
            ['A', 'E'],
            ['A', 'F'],
            ['A', 'G'],

            ['B', 'C'],
            ['B', 'D'],
            ['B', 'E'],
            ['B', 'F'],
            ['B', 'G'],

            ['C', 'D'],
            ['C', 'E'],
            ['C', 'F'],
            ['C', 'G'],

            ['D', 'E'],
            ['D', 'F'],
            ['D', 'G'],

            ['E', 'F'],
            ['E', 'G'],

            ['F', 'G']
        ]
    }]
});
