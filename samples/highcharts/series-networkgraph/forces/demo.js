Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Networkgraph with custom forces'
    },
    plotOptions: {
        networkgraph: {
            turboThreshold: 0,
            keys: ['from', 'to', 'color']
        }
    },

    series: [{
        type: 'networkgraph',
        layoutAlgorithm: {
            enableSimulation: true,
            initialPositions: 'random',
            // Applied only to links, should be 0
            attractiveForce: function () {
                return 0;
            },
            repulsiveForce: function () {
                return 50;
            },
            integration: 'euler',
            // Half of the repulsive force
            gravitationalConstant: 25
        },
        nodes: [{
            id: 0,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 0,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 1,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 100,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 2,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 200,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 3,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 300,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 4,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 400,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 5,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 500,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 6,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 600,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 7,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 700,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 8,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 800,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 9,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 900,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 10,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 1000,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 11,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 1100,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 12,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 1200,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 13,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 1300,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 14,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 1400,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 15,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 1500,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 16,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 1600,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 17,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 1700,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 18,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 1800,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 19,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 1900,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 20,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#90ed7d'
        }, {
            id: 2000,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#90ed7d'
        }, {
            id: 21,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#7cb5ec'
        }, {
            id: 2100,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#7cb5ec'
        }, {
            id: 22,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#434348'
        }, {
            id: 2200,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#434348'
        }, {
            id: 23,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#90ed7d'
        }, {
            id: 2300,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#90ed7d'
        }, {
            id: 24,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#7cb5ec'
        }, {
            id: 2400,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#7cb5ec'
        }, {
            id: 25,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#434348'
        }, {
            id: 2500,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#434348'
        }, {
            id: 26,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#90ed7d'
        }, {
            id: 2600,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#90ed7d'
        }, {
            id: 27,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#7cb5ec'
        }, {
            id: 2700,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#7cb5ec'
        }, {
            id: 28,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#434348'
        }, {
            id: 2800,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#434348'
        }, {
            id: 29,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#90ed7d'
        }, {
            id: 2900,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#90ed7d'
        }, {
            id: 30,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 3000,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 31,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 3100,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 32,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 3200,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 33,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 3300,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 34,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 3400,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 35,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 3500,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 36,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 3600,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 37,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 3700,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 38,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 3800,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 39,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 3900,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 40,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 4000,
            mass: 1,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 41,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 4100,
            mass: 1,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 42,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 4200,
            mass: 1,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 43,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 4300,
            mass: 1,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 44,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 4400,
            mass: 1,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 45,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 4500,
            mass: 1,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 46,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 4600,
            mass: 1,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 47,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 4700,
            mass: 1,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 48,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 4800,
            mass: 1,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 49,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 4900,
            mass: 1,
            marker: {
                radius: 10
            },
            color: '#434348'
        }],
        // No links, only nodes:
        data: []
    }]
});
