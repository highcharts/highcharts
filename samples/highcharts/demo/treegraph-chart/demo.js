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
            dataLabels: {
                nodeFormatter: function () {
                    return this.point.description ?
                        `${this.point.name}<br>${this.point.description}` :
                        `${this.point.name}`;
                },
                color: dataLabelColor,
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
            marker: {
                symbol: 'rect',
                height: 70,
                width: 50,
                fillColor: markerColor
            },

            link: {
                type: 'curved',
                lineWidth: 2,
                color: markerColor
            },

            nodes: [
                {
                    id: 'Durin the Deathless',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Durin VI',
                    color: kingBorderColor,
                    level: 2,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Nain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thrain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Gloin',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Oin',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Nain II',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Dain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thror',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thrain II',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Dain II IronFoot',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin II Stonehelm',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Durin VII',
                    level: 15,
                    marker: {
                        color: kingBorderColor,
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thorin II Oakenshield',
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
                {
                    id: 'Gimli',
                    name: 'Gimli',
                    description: '2879 - 120FA?',
                    marker: {
                        symbol: 'circle',
                        radius: 35
                    }
                },
                {
                    id: 'Fili',
                    name: 'Fili',
                    description: '2859 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Kili',
                    name: 'Kili',
                    description: '2864 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Balin',
                    name: 'Balin',
                    description: '2763 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Dwalin',
                    name: 'Dwalin',
                    description: '2772 - 3112',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Oin II',
                    name: 'Oin II',
                    description: '2774 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Gloin II',
                    name: 'Gloin II',
                    description: '2783 - 15 F.A.',
                    marker: {
                        fillColor: expeditionColor
                    }
                }
            ],
            keys: ['from', 'to'],

            data: [
                ['Durin the Deathless', 'Durin VI'],
                ['Durin VI', 'Nain I'],
                ['Nain I', 'Thrain I'],
                ['Thrain I', 'Thorin I'],
                ['Thorin I', 'Gloin'],
                ['Gloin', 'Oin'],
                ['Oin', 'Nain II'],
                ['Nain II', 'Dain I'],
                ['Nain II', 'Borin'],
                ['Dain I', 'Thror'],
                ['Dain I', 'Fror'],
                ['Dain I', 'Gror'],
                ['Thror', 'Thrain II'],
                ['Thrain II', 'Thorin II Oakenshield'],
                ['Thrain II', 'Frerin'],
                ['Thrain II', 'Dis'],
                ['Dis', 'Kili'],
                ['Dis', 'Fili'],
                ['Gror', 'Nain'],
                ['Nain', 'Dain II IronFoot'],
                ['Dain II IronFoot', 'Thorin II Stonehelm'],
                ['Thorin II Stonehelm', 'Durin VII'],
                ['Borin', 'Farin'],
                ['Farin', 'Fundin'],
                ['Fundin', 'Balin'],
                ['Fundin', 'Dwalin'],
                ['Farin', 'Groin'],
                ['Groin', 'Oin II'],
                ['Groin', 'Gloin II'],
                ['Gloin II', 'Gimli']
            ]
        }
    ],
    exporting: {
        sourceWidth: 800,
        sourceHeight: 1000
    }
});
