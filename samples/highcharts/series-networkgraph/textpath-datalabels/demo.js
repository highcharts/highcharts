Highcharts.addEvent(
    Highcharts.Series,
    'afterSetOptions',
    function (e) {
        var colors = Highcharts.getOptions().colors,
            i = 0,
            nodes = {};
        if (
            this instanceof Highcharts.Series.types.networkgraph &&
            e.options.id === 'language-tree'
        ) {
            e.options.data.forEach(function (link) {

                if (link[0] === 'Proto Indo-European') {
                    nodes['Proto Indo-European'] = {
                        id: 'Proto Indo-European',
                        marker: {
                            radius: 28
                        }
                    };
                    nodes[link[1]] = {
                        id: link[1],
                        marker: {
                            radius: 18
                        },
                        color: colors[i++]
                    };
                } else if (nodes[link[0]] && nodes[link[0]].color) {
                    nodes[link[1]] = {
                        id: link[1],
                        color: nodes[link[0]].color
                    };
                }
            });

            e.options.nodes = Object.keys(nodes).map(function (id) {
                return nodes[id];
            });
        }
    }
);

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        marginTop: 80
    },
    title: {
        text: 'The Indo-European Language Tree'
    },
    subtitle: {
        text: 'A Force-Directed Network Graph in Highcharts'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
                enableSimulation: true,
                integration: 'verlet',
                linkLength: 100
            }
        }
    },
    series: [{
        id: 'language-tree',
        marker: {
            radius: 13
        },
        dataLabels: {
            enabled: true,
            textPath: {
                enabled: true
            },
            linkFormat: '',
            allowOverlap: true
        },
        data: [
            ['Proto Indo-European', 'Balto-Slavic'],
            ['Proto Indo-European', 'Germanic'],
            ['Proto Indo-European', 'Celtic'],
            ['Proto Indo-European', 'Italic'],
            ['Proto Indo-European', 'Hellenic'],
            ['Proto Indo-European', 'Anatolian'],
            ['Proto Indo-European', 'Indo-Iranian'],
            ['Proto Indo-European', 'Tocharian'],
            ['Indo-Iranian', 'Dardic'],
            ['Indo-Iranian', 'Indic'],
            ['Indo-Iranian', 'Iranian'],
            ['Iranian', 'Old Persian'],
            ['Old Persian', 'Middle Persian'],
            ['Indic', 'Sanskrit'],
            ['Italic', 'Osco-Umbrian'],
            ['Italic', 'Latino-Faliscan'],
            ['Latino-Faliscan', 'Latin'],
            ['Celtic', 'Brythonic'],
            ['Celtic', 'Goidelic']
        ]
    }]
});