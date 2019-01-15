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
            linkLength: 50,
            // Applied only to links, should be 0
            attractiveForce: function () {
                return 0;
            },
            repulsiveForce: function (d, k) {
                return k;
            },
            integration: 'euler',
            gravitationalConstant: 25
        },
        nodes: [{
            id: 0,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 0,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 1,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 100,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 2,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 200,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 3,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 300,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 4,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 400,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 5,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 500,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 6,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 600,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 7,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 700,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 8,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 800,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 9,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 900,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 10,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 1000,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 11,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 1100,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 12,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 1200,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 13,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 1300,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 14,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 1400,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 15,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 1500,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 16,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 1600,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 17,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 1700,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 18,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 1800,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 19,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 1900,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 20,
            marker: {
                radius: 1
            },
            color: '#90ed7d'
        }, {
            id: 2000,
            marker: {
                radius: 1
            },
            color: '#90ed7d'
        }, {
            id: 21,
            marker: {
                radius: 2
            },
            color: '#7cb5ec'
        }, {
            id: 2100,
            marker: {
                radius: 2
            },
            color: '#7cb5ec'
        }, {
            id: 22,
            marker: {
                radius: 3
            },
            color: '#434348'
        }, {
            id: 2200,
            marker: {
                radius: 3
            },
            color: '#434348'
        }, {
            id: 23,
            marker: {
                radius: 4
            },
            color: '#90ed7d'
        }, {
            id: 2300,
            marker: {
                radius: 4
            },
            color: '#90ed7d'
        }, {
            id: 24,
            marker: {
                radius: 5
            },
            color: '#7cb5ec'
        }, {
            id: 2400,
            marker: {
                radius: 5
            },
            color: '#7cb5ec'
        }, {
            id: 25,
            marker: {
                radius: 6
            },
            color: '#434348'
        }, {
            id: 2500,
            marker: {
                radius: 6
            },
            color: '#434348'
        }, {
            id: 26,
            marker: {
                radius: 7
            },
            color: '#90ed7d'
        }, {
            id: 2600,
            marker: {
                radius: 7
            },
            color: '#90ed7d'
        }, {
            id: 27,
            marker: {
                radius: 8
            },
            color: '#7cb5ec'
        }, {
            id: 2700,
            marker: {
                radius: 8
            },
            color: '#7cb5ec'
        }, {
            id: 28,
            marker: {
                radius: 9
            },
            color: '#434348'
        }, {
            id: 2800,
            marker: {
                radius: 9
            },
            color: '#434348'
        }, {
            id: 29,
            marker: {
                radius: 10
            },
            color: '#90ed7d'
        }, {
            id: 2900,
            marker: {
                radius: 10
            },
            color: '#90ed7d'
        }, {
            id: 30,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 3000,
            marker: {
                radius: 1
            },
            color: '#7cb5ec'
        }, {
            id: 31,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 3100,
            marker: {
                radius: 2
            },
            color: '#434348'
        }, {
            id: 32,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 3200,
            marker: {
                radius: 3
            },
            color: '#90ed7d'
        }, {
            id: 33,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 3300,
            marker: {
                radius: 4
            },
            color: '#7cb5ec'
        }, {
            id: 34,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 3400,
            marker: {
                radius: 5
            },
            color: '#434348'
        }, {
            id: 35,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 3500,
            marker: {
                radius: 6
            },
            color: '#90ed7d'
        }, {
            id: 36,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 3600,
            marker: {
                radius: 7
            },
            color: '#7cb5ec'
        }, {
            id: 37,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 3700,
            marker: {
                radius: 8
            },
            color: '#434348'
        }, {
            id: 38,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 3800,
            marker: {
                radius: 9
            },
            color: '#90ed7d'
        }, {
            id: 39,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 3900,
            marker: {
                radius: 10
            },
            color: '#7cb5ec'
        }, {
            id: 40,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 4000,
            marker: {
                radius: 1
            },
            color: '#434348'
        }, {
            id: 41,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 4100,
            marker: {
                radius: 2
            },
            color: '#90ed7d'
        }, {
            id: 42,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 4200,
            marker: {
                radius: 3
            },
            color: '#7cb5ec'
        }, {
            id: 43,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 4300,
            marker: {
                radius: 4
            },
            color: '#434348'
        }, {
            id: 44,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 4400,
            marker: {
                radius: 5
            },
            color: '#90ed7d'
        }, {
            id: 45,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 4500,
            marker: {
                radius: 6
            },
            color: '#7cb5ec'
        }, {
            id: 46,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 4600,
            marker: {
                radius: 7
            },
            color: '#434348'
        }, {
            id: 47,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 4700,
            marker: {
                radius: 8
            },
            color: '#90ed7d'
        }, {
            id: 48,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 4800,
            marker: {
                radius: 9
            },
            color: '#7cb5ec'
        }, {
            id: 49,
            marker: {
                radius: 10
            },
            color: '#434348'
        }, {
            id: 4900,
            marker: {
                radius: 10
            },
            color: '#434348'
        }],
        // No links, only nodes:
        data: []
    }]
});
