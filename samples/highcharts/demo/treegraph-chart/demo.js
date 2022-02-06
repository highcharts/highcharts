const expeditionColor = '#C3CEDA';
const linkColor = '#738FA7';
const plotBackgroundColor = '#071330';
const markerColor = '#0C4160';

Highcharts.chart('container', {
    chart: {
        inverted: true,
        plotBackgroundColor: plotBackgroundColor,
        borderWidth: 1,
        width: 800,
        height: 1000
    },

    title: {
        text: 'Durin Family Tree'
    },
    subtitle: {
        text: 'Dwarfs participating in a Quest to Lonley Mountain marked.'
    },

    plotOptions: {
        treegraph: {
            dataLabels: {
                nodeFormatter: function () {
                    return this.point.description ?
                        `${this.point.name}<br>${this.point.description}` :
                        `${this.point.name}`;
                },
                color: expeditionColor,
                crop: false,
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
                lineWidth: 1,
                lineColor: 'white',
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
                    name: 'Durin the Deathless'
                },
                {
                    id: 'Thorin II Oakenshield',
                    name: 'Thorin II Oakenshield',
                    description: '2746 - 2941',

                    marker: {
                        height: 100,
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Gimli',
                    name: 'Gimli',
                    marker: {
                        symbol: 'circle',
                        radius: 30
                    }
                },
                {
                    id: 'Fili',
                    name: 'Fili',
                    description: '2859 - 2941',
                    marker: {
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Kili',
                    name: 'Kili',
                    description: '2864 - 2941',
                    marker: {
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Balin',
                    name: 'Balin',
                    description: '2763 - 2994',
                    marker: {
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Dwalin',
                    name: 'Dwalin',
                    description: '2772 - 3112',
                    marker: {
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Oin II',
                    name: 'Oin II',
                    description: '2774 - 2994',
                    marker: {
                        fillColor: linkColor
                    }
                },
                {
                    id: 'Gloin II',
                    name: 'Gloin II',
                    description: '2783 - 15 F.A.',
                    marker: {
                        fillColor: linkColor
                    }
                }
            ],
            keys: ['from', 'to', 'link.color'],

            data: [
                ['Durin the Deathless', 'Durin VI', 'gold'],
                ['Durin VI', 'Nain I', 'gold'],
                ['Nain I', 'Thrain I', 'gold'],
                ['Thrain I', 'Thorin I', 'gold'],
                ['Thorin I', 'Gloin', 'gold'],
                ['Gloin', 'Oin', 'gold'],
                ['Oin', 'Nain II', 'gold'],
                ['Nain II', 'Dain I', 'gold'],
                ['Nain II', 'Borin'],
                ['Dain I', 'Thror', 'gold'],
                ['Dain I', 'Fror'],
                ['Dain I', 'Gror'],
                ['Thror', 'Thrain II', 'gold'],
                ['Thrain II', 'Thorin II Oakenshield', 'gold'],
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
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
