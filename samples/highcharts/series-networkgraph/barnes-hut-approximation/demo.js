Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Trans-Siberian Railway'
    },
    subtitle: {
        text: 'Barnes-Hut approximation'
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: true,
                linkLength: 33,
                integration: 'verlet',
                approximation: 'barnes-hut',
                gravitationalConstant: 0.8
            }
        }
    },
    series: [{
        marker: {
            radius: 3,
            lineWidth: 1
        },
        dataLabels: {
            enabled: true,
            linkFormatter: function () {
                return '';
            }
        },
        nodes: [{
            id: 'Moscow',
            marker: {
                radius: 10
            }
        }, {
            id: 'Beijing',
            marker: {
                radius: 10
            }
        }, {
            id: 'Bangkok',
            marker: {
                radius: 10
            }
        }],
        data: [
            { from: 'Brussels', to: 'Paris', color: 'blue' },
            { from: 'London', to: 'Paris', color: 'blue' },
            { from: 'London', to: 'Brussels', color: 'blue' },
            { from: 'Brussels', to: 'Cologne', color: 'blue' },
            { from: 'Amsterdam', to: 'Cologne', color: 'blue' },
            { from: 'Berlin', to: 'Cologne', color: 'blue' },
            { from: 'Berlin', to: 'Warsaw', color: 'blue' },
            { from: 'Warsaw', to: 'Minsk', color: 'blue' },
            { from: 'Minsk', to: 'Moscow', color: 'blue' },
            { from: 'Minsk', to: 'St Pteresburg', color: 'blue' },
            { from: 'Moscow', to: 'St Pteresburg', color: 'blue' },
            { from: 'N. Novogorod', to: 'Moscow', color: 'red' },
            { from: 'N. Novogorod', to: 'Perm', color: 'red' },
            { from: 'Perm', to: 'St Pteresburg', color: 'red' },
            { from: 'Perm', to: 'Ekaterinberg', color: 'red' },
            { from: 'Omsk', to: 'Ekaterinberg', color: 'red' },
            { from: 'Omsk', to: 'Novosibirsk', color: 'red' },
            { from: 'Krasnoyarsk', to: 'Novosibirsk', color: 'red' },
            { from: 'Krasnoyarsk', to: 'Irkutsk', color: 'red' },
            { from: 'Ulan Ude', to: 'Irkutsk', color: 'red' },
            { from: 'Ulan Ude', to: 'Ulan Bator', color: 'red' },
            { from: 'Ulan Bator', to: 'Beijing', color: 'red' },
            { from: 'Ulan Ude', to: 'Chita', color: 'red' },
            { from: 'Khavarovsk', to: 'Chita', color: 'red' },
            { from: 'Khavarovsk', to: 'Vladivostok', color: 'red' },
            { from: 'Harbin', to: 'Chita', color: 'red' },
            { from: 'Harbin', to: 'Beijing', color: 'red' },
            { from: 'Xian', to: 'Beijing', color: 'green' },
            { from: 'Shanghai', to: 'Beijing', color: 'green' },
            { from: 'Shanghai', to: 'Xian', color: 'green' },
            { from: 'Gol Mud', to: 'Xian', color: 'green' },
            { from: 'Lhasa', to: 'Gol Mud', color: 'green' },
            { from: 'Guilin', to: 'Beijing', color: 'green' },
            { from: 'Guilin', to: 'Nanning', color: 'green' },
            { from: 'Guilin', to: 'Guangzhou', color: 'green' },
            { from: 'Hong Kong', to: 'Guangzhou', color: 'green' },
            { from: 'Hanoi', to: 'Nanning', color: 'green' },
            { from: 'Hanoi', to: 'Saigon', color: 'green' },
            { from: 'Bangkok', to: 'Saigon', color: 'green' },
            { from: 'Bangkok', to: 'Penang', color: 'green' },
            { from: 'Penang', to: 'Kuala Lumpur', color: 'green' },
            { from: 'Singapore', to: 'Kuala Lumpur', color: 'green' }
        ]
    }]
});