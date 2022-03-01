const dataLabelColor = '#C3CEDA';
const expeditionColor = '#071330';
const markerColor = '#0C4160';
const kingBorderColor = '#cf9700';

Highcharts.chart('container', {
    chart: {
        inverted: true,
        borderWidth: 1,
        width: 800,
        height: 1200
    },

    title: {
        text: 'Durin Family Tree'
    },
    subtitle: {
        text: 'Dwarfs participating in a Quest to the Lonely Mountain marked in brighter color. <br> Drarf kings marked with golden border.'
    },

    plotOptions: {
        treegraph: {
            marker: {
                symbol: 'rect',
                height: 70,
                width: 50,
                fillColor: markerColor
            },

            link: {
                lineWidth: 4,
                color: markerColor
            },
            dataLabels: {
                color: dataLabelColor,
                format: '{point.id} \n {point.description}',
                style: {
                    width: 70,
                    textOverflow: 'clip'
                }
            }
        }
    },

    series: [
        {
            type: 'treegraph',
            keys: ['id', 'parent'],

            data: [
                {
                    id: 'Durin the Deathless',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Durin VI',
                    parent: 'Durin the Deathless',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Nain I',
                    parent: 'Durin VI',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thrain I',
                    parent: 'Nain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin I',
                    parent: 'Thrain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Gloin',
                    parent: 'Thorin I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Oin',
                    parent: 'Gloin',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Nain II',
                    parent: 'Oin',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Dain I',
                    parent: 'Nain II',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                ['Borin', 'Nain II'],
                {
                    id: 'Thror',
                    parent: 'Dain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                ['Fror', 'Dain I'],
                ['Gror', 'Dain I'],
                {
                    id: 'Thrain II',
                    parent: 'Thror',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin II Oakenshield',
                    parent: 'Thrain II',
                    name: 'Thorin II Oakenshield',
                    description: '2746 - 2941',

                    color: kingBorderColor,
                    dataLabels: {
                        style: {
                            width: 100
                        }
                    },
                    marker: {
                        lineWidth: 3,

                        height: 100,
                        fillColor: expeditionColor
                    }
                },
                ['Frerin', 'Thrain II'],
                ['Dis', 'Thrain II'],
                {
                    id: 'Kili',
                    parent: 'Dis',
                    name: 'Kili',
                    description: '2864 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Fili',
                    parent: 'Dis',
                    name: 'Fili',
                    description: '2859 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                ['Nain', 'Gror'],
                {
                    id: 'Dain II IronFoot',
                    parent: 'Nain',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin II Stonehelm',
                    parent: 'Dain II IronFoot',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Durin VII',
                    parent: 'Thorin II Stonehelm',
                    level: 15,
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                ['Farin', 'Borin'],
                ['Fundin', 'Farin'],
                {
                    id: 'Balin',
                    parent: 'Fundin',
                    name: 'Balin',
                    description: '2763 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Dwalin',
                    parent: 'Fundin',
                    name: 'Dwalin',
                    description: '2772 - 3112',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                { id: 'Groin', parent: 'Farin' },
                {
                    id: 'Oin II',
                    parent: 'Groin',
                    name: 'Oin II',
                    description: '2774 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Gloin II',
                    parent: 'Groin',
                    name: 'Gloin II',
                    description: '2783 - 15 F.A.',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Gimli',
                    parent: 'Gloin II',
                    name: 'Gimli',
                    description: '2879 - 120FA?',
                    marker: {
                        symbol: 'circle',
                        radius: 35
                    }
                }
            ]
        }
    ],
    exporting: {
        sourceWidth: 800,
        sourceHeight: 1000
    }
});
