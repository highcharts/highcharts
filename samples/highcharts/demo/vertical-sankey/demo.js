Highcharts.chart('container', {
    chart: {
        type: 'sankey',
        inverted: true,
        height: 1000
    },
    title: {
        text: 'Evaluating the energy consumed for water use in the United States'
    },
    subtitle: {
        text: 'Data source: <a href="https://iopscience.iop.org/article/10.1088/1748-9326/7/3/034034/pdf">The University of Texas at Austin</a>'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
        }
    },
    plotOptions: {
        sankey: {
            states: {
                inactive: {
                    enabled: false
                }
            },
            tooltip: {
                nodeFormat: '{point.name}: <b>{point.sum} quads</b><br/>'
            }
        }
    },
    tooltip: {
        valueSuffix: ' quads'
    },
    series: [{
        name: 'Energy consumed for water use in U.S.',
        dataLabels: {
            nodeFormatter() {
                const maxLetters = this.point.shapeArgs.height / 8,
                    name = this.point.name,
                    firstWord = name.slice(0, maxLetters);

                if (firstWord.length >= name.length) {
                    return firstWord.toUpperCase();
                }
                return name.toUpperCase();
            },
            style: {
                textOutline: 'none',
                color: '#4a4a4a'
            }
        },
        borderRadius: 0,
        nodeWidth: 50,
        linkOpacity: 1,
        linkColorMode: 'gradient',
        nodes: [{
            id: 'Total annual U.S. energy consumption',
            color: 'rgba(76, 175, 254,0.8)'
        }, {
            id: 'All non-water related energy consumption',
            color: 'rgba(199, 113, 243, 0.8)'
        }, {
            id: 'Water-related energy consumption',
            color: 'rgba(83, 82, 190, 0.8)'
        }, {
            id: 'Non-boiler water-related applications',
            offsetHorizontal: '200%',
            color: 'rgba(199, 113, 243, 0.8)',
            dataLabels: {
                enabled: false
            }
        }, {
            id: 'Steam boilers',
            offsetHorizontal: '60%',
            color: 'rgba(243, 172, 165, 0.8)'
        }, {
            id: 'Other (2)',
            color: 'rgba(112, 138, 185, 0.8)',
            dataLabels: {
                rotation: -90
            }
        }, {
            id: 'Non-electric water heating',
            color: 'rgba(108, 221, 202, 0.8)',
            dataLabels: {
                rotation: -85,
                x: -5,
                y: 60
            }
        }, {
            id: 'Steam-driven power generation',
            offsetHorizontal: '55%',
            color: 'rgba(232, 89, 75, 0.8)'
        }, {
            id: 'Non-electric steam applications',
            offsetHorizontal: '200%',
            color: 'rgba(136, 157, 197, 0.8)'
        }, {
            id: 'Other power (non-steam)',
            column: 4,
            offsetHorizontal: '700%',
            color: 'rgba(108, 221, 202, 0.8)'
        }, {
            id: 'To direct water services',
            offsetHorizontal: '320%',
            color: 'rgba(76, 175, 254, 0.8)',
            dataLabels: {
                rotation: -90
            }
        }, {
            id: 'Other electric devices',
            offsetHorizontal: '60%',
            color: 'rgba(250, 183, 118, 0.8)'
        }, {
            id: 'Space and process heating',
            offsetHorizontal: '300%',
            color: 'rgba(83, 82, 190, 0.8)',
            dataLabels: {
                rotation: -80
            }
        }, {
            id: 'Direct steam injection in industrial processes',
            offsetHorizontal: '450%',
            color: 'rgba(128, 135, 232, 0.8)',
            dataLabels: {
                rotation: -80
            }
        }, {
            id: 'Electric water-related applications',
            offsetHorizontal: '-250%',
            color: 'rgba(255, 141, 100, 0.8)',
            dataLabels: {
                rotation: -90,
                x: -10,
                style: {
                    width: '110px'
                }
            }
        }, {
            id: 'Electric water heating',
            offsetHorizontal: '-1100%',
            color: 'rgba(250, 183, 118, 0.8)'
        }, {
            id: 'Other',
            offsetHorizontal: '-480%',
            color: 'rgba(149, 155, 236, 0.8)',
            dataLabels: {
                rotation: -90
            }
        }, {
            id: 'Direct water services',
            offsetHorizontal: '-80%',
            color: 'rgba(76, 175, 254, 0.8)',
            dataLabels: {
                x: 43,
                style: {
                    textAnchor: 'middle',
                    width: '90px'
                }
            }
        }, {
            id: 'Indirect steam use',
            column: 7,
            color: 'rgba(181, 238, 228, 0.8)'
        }, {
            id: 'Direct steam use',
            column: 7,
            offsetHorizontal: '200%',
            color: 'rgba(219, 239, 255, 0.8)',
            dataLabels: {
                rotation: -90,
                x: 5,
                y: -32
            }
        }],
        keys: ['from', 'to', 'weight'],
        data: [
            [
                'Total annual U.S. energy consumption',
                'All non-water related energy consumption',
                51564
            ],
            [
                'Total annual U.S. energy consumption',
                'Water-related energy consumption',
                46436
            ],
            [
                'Water-related energy consumption',
                'Non-boiler water-related applications',
                2854
            ],
            [
                'Water-related energy consumption',
                'Other power (non-steam)',
                1314
            ],
            [
                'Water-related energy consumption',
                'Steam boilers',
                42268
            ],
            [
                'Non-boiler water-related applications',
                'Other (2)',
                854
            ],
            [
                'Non-boiler water-related applications',
                'Non-electric water heating',
                2000
            ],
            [
                'Electric water-related applications',
                'Electric water heating',
                1670
            ],
            [
                'Electric water-related applications',
                'Other',
                3694
            ],
            [
                'Other power (non-steam)',
                'Electric water-related applications',
                1314
            ],
            [
                'Steam boilers',
                'Steam-driven power generation',
                32334
            ],
            [
                'To direct water services',
                'Electric water-related applications',
                4050
            ],
            [
                'Steam-driven power generation',
                'To direct water services',
                4050
            ],
            [
                'Steam-driven power generation',
                'Other electric devices',
                28284
            ],
            [
                'Non-electric steam applications',
                'Space and process heating',
                5833
            ],
            [
                'Non-electric steam applications',
                'Direct steam injection in industrial processes',
                4101
            ],
            [
                'Steam boilers',
                'Non-electric steam applications',
                9934
            ],
            [
                'Other electric devices',
                'Indirect steam use',
                28284
            ],
            [
                'Space and process heating',
                'Indirect steam use',
                5833
            ],
            [
                'Direct steam injection in industrial processes',
                'Direct steam use',
                4101
            ],
            [
                'Other (2)',
                'Direct water services',
                854
            ],
            [
                'Non-electric water heating',
                'Direct water services',
                2000
            ],
            [
                'Electric water heating',
                'Direct water services',
                1670
            ],
            [
                'Other',
                'Direct water services',
                3694
            ]
        ]
    }]
});
