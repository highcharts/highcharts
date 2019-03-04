Highcharts.chart('container', {

    chart: {
        type: 'networkgraph'
    },

    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: true
            }
        }
    },

    series: [{
        link: {
            width: 2
        },
        dataLabels: {
            enabled: true
        },
        data: [{
            from: 'Europe',
            to: 'UK'
        }, {
            from: 'Europe',
            to: 'Poland',
            color: 'red',
            width: 4,
            dashStyle: 'dot'
        }, {
            from: 'Europe',
            to: 'Italy'
        }, {
            from: 'UK',
            to: 'London'
        }, {
            from: 'UK',
            to: 'Bristol'
        }, {
            from: 'London',
            to: 'London Centre'
        }, {
            from: 'Poland',
            to: 'Warsaw'
        }, {
            from: 'Poland',
            to: 'Krakow',
            color: 'green'
        }, {
            from: 'Italy',
            to: 'Roma'
        }, {
            from: 'Italy',
            to: 'Piza'
        }],
        nodes: [{
            id: 'Krakow',
            color: 'orange'
        }, {
            id: 'Italy',
            color: 'black'
        }]
    }]

});
