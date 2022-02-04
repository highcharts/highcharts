const dataLabelsColor = '#C3CEDA';
const expeditionColor = '#738FA7';
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
        text: 'Dwarfs participating in a Quest to Lonley Mountain marked green'
    },

    plotOptions: {
        treegraph: {
            dataLabels: {
                color: dataLabelsColor
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
                    name: 'Durin the Deathless'
                },
                {
                    id: 'Thorin II Oakenshield',
                    name: 'Thorin II Oakenshield',
                    title: '2746 - 2941',

                    marker: {
                        fillColor: expeditionColor
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
                    title: '2859 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Kili',
                    name: 'Kili',
                    title: '2864 - 2941',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Balin',
                    name: 'Balin',
                    title: '2763 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Dwalin',
                    name: 'Dwalin',
                    title: '2772 - 3112',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Oin II',
                    name: 'Oin II',
                    title: '2774 - 2994',
                    marker: {
                        fillColor: expeditionColor
                    }
                },
                {
                    id: 'Gloin II',
                    name: 'Gloin II',
                    title: '2783 - 15 F.A.',
                    marker: {
                        fillColor: expeditionColor
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
