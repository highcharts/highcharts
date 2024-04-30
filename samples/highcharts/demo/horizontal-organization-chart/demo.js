Highcharts.chart('container', {
    chart: {
        height: 600,
        inverted: false
    },

    title: {
        text: 'Carnivora Phylogeny'
    },

    subtitle: {
        text: 'Tracing the Evolutionary Relationship of Carnivores'
    },

    plotOptions: {
        series: {
            nodeWidth: '22%'
        }
    },

    accessibility: {
        point: {
            descriptionFormat: '{toNode.name} ' +
            '{#if (eq toNode.level 1 )} is a distinct family within the ' +
            'order of {fromNode.id}. {toNode.custom.info}{/if}' +
            '{#if (eq toNode.level 2 )} is a genus within the {fromNode.id}. ' +
            '{toNode.custom.info} {/if}' +
            '{#if (eq toNode.level 3 )} is a species within the ' +
            '{fromNode.id}. {toNode.custom.info} {/if}'
        }
    },

    series: [{
        type: 'organization',
        name: 'Carnivora Phyologeny',
        keys: ['from', 'to'],
        data: [
            ['Carnivora', 'Felidae'],
            ['Carnivora', 'Mustelidae'],
            ['Carnivora', 'Canidae'],
            ['Felidae', 'Panthera'],
            ['Mustelidae', 'Taxidea'],
            ['Mustelidae', 'Lutra'],
            ['Panthera', 'Panthera pardus'],
            ['Taxidea', 'Taxidea taxus'],
            ['Lutra', 'Lutra lutra'],
            ['Canidae', 'Canis'],
            ['Canis', 'Canis latrans'],
            ['Canis', 'Canis lupus']
        ],
        levels: [{
            level: 0,
            color: '#DEDDCF',
            dataLabels: {
                color: 'black'
            }
        }, {
            level: 1,
            color: '#DEDDCF',
            dataLabels: {
                color: 'black'
            },
            height: 25
        }, {
            level: 2,
            color: '#DEDDCF',
            dataLabels: {
                color: 'black'
            }
        }, {
            level: 3,
            dataLabels: {
                color: 'black'
            }
        }],
        nodes: [{
            id: 'Carnivora',
            title: null,
            name: 'Carnivora',
            custom: {
                info: 'Carnivora is a diverse scrotiferan order that ' +
                    'includes over 280 species of placental mammals.'
            }
        }, {
            id: 'Felidae',
            title: null,
            name: 'Felidae',
            color: '#fcc657',
            custom: {
                info: 'Felidae is a family of mammals in the order Carnivora,' +
                    ' colloquially referred to as cats, and constitute a clade.'
            }
        }, {
            id: 'Panthera',
            title: null,
            name: 'Panthera',
            color: '#fcc657',
            custom: {
                info: 'Panthera'
            }
        }, {
            id: 'Panthera pardus',
            title: null,
            name: 'Panthera pardus',
            color: '#fcc657',
            image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'panthera.png',
            custom: {
                info: 'Panthera is a genus within the Felidae family that ' +
                    'was named and described by Lorenz Oken in 1816 who ' +
                    'placed all the spotted cats in this group.'
            }
        }, {
            id: 'Mustelidae',
            title: null,
            name: 'Mustelidae',
            color: '#C4B1A0',
            custom: {
                info: 'The Mustelidae are a family of carnivorous mammals, ' +
                    'including weasels, badgers, otters, ferrets, martens, ' +
                    'mink, and wolverines, among others.'
            }
        }, {
            id: 'Taxidea',
            title: null,
            name: 'Taxidea',
            color: '#C4B1A0',
            custom: {
                info: 'Taxidea'
            }
        }, {
            id: 'Lutra',
            color: '#C4B1A0',
            custom: {
                info: 'Lutra'
            }
        }, {
            id: 'Taxidea taxus',
            name: 'Taxidea taxus',
            color: '#C4B1A0',
            image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/taxidea-taxus.png',
            custom: {
                info: 'Taxidea taxus is a North American badger, somewhat ' +
                    'similar in appearance to the European badger, although ' +
                    'not closely related. It is found in the western and ' +
                    'central United States, northern Mexico, and ' +
                    'south-central Canada to certain areas of southwestern ' +
                    'British Columbia.'
            }
        }, {
            id: 'Lutra lutra',
            name: 'Lutra lutra',
            color: '#C4B1A0',
            image:
                'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/lutra.png',
            custom: {
                info: 'Lutra is a semiaquatic mammal native to Eurasia. The ' +
                    'most widely distributed member of the otter subfamily ' +
                    '(Lutrinae) of the weasel family (Mustelidae), it is ' +
                    'found in the waterways and coasts of Europe, many parts ' +
                    'of Asia, and parts of northern Africa.'
            }
        }, {
            id: 'Canidae',
            name: 'Canidae',
            color: '#B0ACA2',
            custom: {
                info: 'The biological family Canidae is a lineage of ' +
                    'carnivorans that includes domestic dogs, wolves, ' +
                    'coyotes, foxes, jackals, dingoes, and many other extant ' +
                    'and extinct dog-like mammals. '
            }
        }, {
            id: 'Canis',
            name: 'Canis',
            color: '#B0ACA2',
            custom: {
                info: 'Canis'
            }
        }, {
            id: 'Canis latrans',
            name: 'Canis latrans',
            color: '#B0ACA2',
            image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'canis-latrans.png',
            custom: {
                info: 'Canis latrans, is a canine native to North America. ' +
                    'It is smaller than its close relative, the gray wolf, ' +
                    'and slightly smaller than the closely related eastern ' +
                    'wolf and red wolf.'
            }
        }, {
            id: 'Canis lupus',
            name: 'Canis lupus',
            color: '#B0ACA2',
            image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'canis-lupus.png',
            custom: {
                info: 'Canis lupus is a canine native to the wilderness and ' +
                    'remote areas of Eurasia and North America. It is the ' +
                    'largest extant member of its family, with males ' +
                    'averaging 43–45 kg (95–99 lb) and females 36–38.5 kg ' +
                    '(79–85 lb).'
            }
        }],
        colorByPoint: false,
        borderColor: 'black',
        borderWidth: 2
    }],

    tooltip: {
        outside: true,
        format: '{point.custom.info}',
        style: {
            width: '320px'
        }
    },

    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
