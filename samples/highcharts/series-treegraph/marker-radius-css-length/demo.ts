Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>plotOptions.treegraph.marker.radius</em>'
    },
    plotOptions: {
        treegraph: {
            marker: {
                radius: '1.5rem'
            }
        }
    },
    series: [
        {
            data: [
                {
                    id: 'root'
                },
                {
                    id: 'A',
                    parent: 'root'
                },
                {
                    id: 'B',
                    parent: 'root'
                },
                {
                    id: 'A1',
                    parent: 'A'
                },
                {
                    id: 'A2',
                    parent: 'A'
                },
                {
                    id: 'B1',
                    parent: 'B'
                }
            ],
            type: 'treegraph'
        }
    ]
});
