function createChart(container, integration, linkLength) {
    Highcharts.chart(container, {
        chart: {
            type: 'networkgraph',
            plotBorderWidth: 1
        },
        title: {
            text: 'Phrasal verbs'
        },
        subtitle: {
            text: 'Integration: ' + integration
        },
        plotOptions: {
            networkgraph: {
                layoutAlgorithm: {
                    enableSimulation: true,
                    integration: integration,
                    linkLength: linkLength
                },
                keys: ['from', 'to'],
                marker: {
                    radius: 5,
                    lineWidth: 1
                }
            }
        },
        series: [{
            nodes: [{
                id: 'for',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 2,
                    fillColor: 'red'
                }
            }, {
                id: 'up',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 15,
                    fillColor: 'red'
                }
            }, {
                id: 'back',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 2.5,
                    fillColor: 'red'
                }
            }, {
                id: 'away',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 2.5,
                    fillColor: 'red'
                }
            }, {
                id: 'down',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 5.5,
                    fillColor: 'red'
                }
            }, {
                id: 'on',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 7.5,
                    fillColor: 'red'
                }
            }, {
                id: 'out',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 13.5,
                    fillColor: 'red'
                }
            }, {
                id: 'off',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 6.5,
                    fillColor: 'red'
                }
            }, {
                id: 'break',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 3
                }
            }, {
                id: 'into',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 2,
                    fillColor: 'red'
                }
            }, {
                id: 'in',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 4,
                    fillColor: 'red'
                }
            }, {
                id: 'get',
                marker: {
                    radius: 8.5
                }
            }, {
                id: 'over',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'look',
                marker: {
                    radius: 3
                }
            }, {
                id: 'put',
                marker: {
                    radius: 2
                }
            }, {
                id: 'run',
                marker: {
                    radius: 1.5
                }
            }, {
                id: 'take',
                marker: {
                    radius: 2.5
                }
            }, {
                id: 'down on',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'keep',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'fun of',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'care of',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'by',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }, {
                id: 'out of',
                dataLabels: {
                    enabled: true
                },
                marker: {
                    radius: 1.5,
                    fillColor: 'red'
                }
            }],
            data: [
                ['abide', 'by'],
                ['account', 'for'],
                ['add', 'up'],
                ['allow', 'for'],
                ['apply', 'for'],
                ['back', 'away'],
                ['back', 'down'],
                ['back', 'up'],
                ['bank', 'on'],
                ['black', 'out'],
                ['block', 'off'],
                ['blow', 'up'],
                ['boot', 'up'],
                ['break', 'away'],
                ['break', 'down'],
                ['break', 'into'],
                ['break', 'out'],
                ['break', 'up'],
                ['bring', 'up'],
                ['brush', 'up'],
                ['bump', 'into'],
                ['burn', 'out'],
                ['call', 'back'],
                ['call', 'off'],
                ['calm', 'down'],
                ['carry', 'on'],
                ['carry', 'out'],
                ['check', 'in'],
                ['check', 'out'],
                ['clam', 'up'],
                ['clamp', 'down on'],
                ['count', 'on'],
                ['cut', 'down on'],
                ['cut', 'out'],
                ['die', 'down'],
                ['drag', 'on'],
                ['draw', 'up'],
                ['dress', 'up'],
                ['ease', 'off'],
                ['end', 'in'],
                ['end', 'up'],
                ['figure', 'out'],
                ['fill', 'out'],
                ['find', 'out'],
                ['focus', 'on'],
                ['get', 'along'],
                ['get', 'at'],
                ['get', 'away'],
                ['get', 'by'],
                ['get', 'in'],
                ['get', 'into'],
                ['get', 'off'],
                ['get', 'on'],
                ['get', 'out'],
                ['get', 'over'],
                ['get', 'rid of'],
                ['get', 'together'],
                ['get', 'up'],
                ['give', 'in'],
                ['give', 'up'],
                ['grow', 'up'],
                ['hand', 'in'],
                ['hand', 'out'],
                ['hang', 'out'],
                ['hang', 'up'],
                ['hold', 'on'],
                ['hurry', 'up'],
                ['iron', 'out'],
                ['join', 'in'],
                ['join', 'up'],
                ['keep', 'on'],
                ['keep', 'up with'],
                ['kick', 'off'],
                ['leave', 'out'],
                ['let', 'down'],
                ['look', 'after'],
                ['look', 'down on'],
                ['look', 'on'],
                ['look', 'for'],
                ['look', 'forward to'],
                ['look', 'up to'],
                ['make', 'fun of'],
                ['make', 'up'],
                ['mix', 'up'],
                ['move', 'in'],
                ['move', 'out'],
                ['nod', 'off'],
                ['own', 'up'],
                ['pass', 'away'],
                ['pass', 'out'],
                ['pay', 'back'],
                ['put', 'off'],
                ['put', 'on'],
                ['put', 'out'],
                ['put', 'up'],
                ['pick', 'up'],
                ['point', 'out'],
                ['rely', 'on'],
                ['rule', 'out'],
                ['run', 'away'],
                ['run', 'into'],
                ['run', 'out of'],
                ['set', 'off'],
                ['set', 'up'],
                ['show', 'off'],
                ['show', 'up'],
                ['shut', 'up'],
                ['sit', 'down'],
                ['stand', 'up'],
                ['take', 'after'],
                ['take', 'care of'],
                ['take', 'off'],
                ['take', 'on'],
                ['take', 'out'],
                ['tell', 'off'],
                ['think', 'over'],
                ['try', 'on'],
                ['turn', 'down'],
                ['use', 'up'],
                ['watch', 'out'],
                ['wear', 'out'],
                ['work', 'out'],
                ['wipe', 'off']
            ]
        }]
    });
}

createChart('container-1', 'euler', 10);
createChart('container-2', 'verlet', 30);