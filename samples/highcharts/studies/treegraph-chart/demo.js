const dataLabelColor = '#C3CEDA';
const expeditionColor = '#071330';
const markerColor = '#0C4160';
const kingBorderColor = '#cf9700';

Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    title: {
        text: 'Durin Family Tree',
        align: 'left'
    },
    subtitle: {
        text: 'Dwarfs participating in the Quest to the Lonely Mountain marked in darker color. <br> Dwarf kings marked with golden border.',
        align: 'left'
    },
    plotOptions: {
        treegraph: {
            marker: {
                symbol: 'rect',
                height: '10%',
                width: '6%',
                fillColor: markerColor,
                radius: '5%'
            },

            link: {
                lineWidth: 4,
                color: markerColor
            },
            dataLabels: {
                color: dataLabelColor,
                format: '{point.id} <br> {point.description}',
                linkFormat: '',
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
            data: [
                {
                    id: 'Durin the Deathless',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Thrain I',
                    parent: 'Durin the Deathless',
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
                {
                    id: 'Borin',
                    parent: 'Nain II'
                },
                {
                    id: 'Thror',
                    parent: 'Dain I',
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Fror',
                    parent: 'Dain I'
                },
                {
                    id: 'Gror',
                    parent: 'Dain I'
                },
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
                            width: 80
                        }
                    },
                    marker: {
                        lineWidth: 3,
                        height: '14%',
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Dis',
                    parent: 'Thrain II'
                },
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
                {
                    id: 'Nain',
                    parent: 'Gror'
                },
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
                    level: 13,
                    color: kingBorderColor,
                    marker: {
                        lineWidth: 3
                    }
                },
                {
                    id: 'Farin',
                    parent: 'Borin'
                },
                {
                    id: 'Fundin',
                    parent: 'Farin'
                },
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
                        symbol: 'circle'
                    }
                }
            ]
        }
    ],
    exporting: {
        sourceWidth: 800,
        sourceHeight: 1000
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 630
                },
                chartOptions: {
                    plotOptions: {
                        treegraph: {
                            link: {
                                lineWidth: 1
                            },
                            dataLabels: {
                                style: {
                                    width: '40px',
                                    textOverflow: 'ellipsis'
                                },
                                format: '{point.id}'
                            },
                            marker: {
                                symbol: 'rect',
                                height: 40,
                                width: 30
                            }
                        }
                    }
                }
            }
        ]
    }
});
