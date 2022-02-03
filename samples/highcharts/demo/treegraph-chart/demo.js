Highcharts.chart('container', {
    chart: {
        inverted: true,
        height: 1000,
        width: 1000,
        borderWidth: 1
    },

    title: {
        text: 'Durin Family Tree'
    },
    subtitle: {
        text: 'Dwarfs participating in a Quest to Single Mountain marked green'
    },

    series: [
        {
            type: 'treegraph',
            marker: {
                symbol: 'rect',
                width: 60,
                height: 40,
                fillColor: 'gold'
            },
            dataLabels: {
                color: '#222'
            },
            link: {
                type: 'curved'
            },
            nodes: [
                {
                    id: 'Durin the Deathless',
                    name: 'Durin the Deathless',
                    title: '(First Age)'
                },
                {
                    id: 'Durin VI',
                    name: 'Durin VI',
                    title: '1731 - 1980'
                },
                {
                    id: 'Nain I',
                    name: 'Nain I',
                    title: '1832 - 1981'
                },
                {
                    id: 'Thrain I',
                    name: 'Thrain I',
                    title: '1934 - 2190'
                },
                {
                    id: 'Thorin I',
                    name: 'Thorin I',
                    title: '2035 - 2289'
                },
                {
                    id: 'Gloin',
                    name: 'Gloin',
                    title: '2136 - 2385'
                },
                {
                    id: 'Oin',
                    name: 'Oin',
                    title: '2238 - 2585'
                },
                {
                    id: 'Nain II',
                    name: 'Nain II',
                    title: '2338 - 2585'
                },
                {
                    id: 'Dain I',
                    name: 'Dain I',
                    title: '2440 - 2589'
                },
                {
                    id: 'Borin',
                    name: 'Borin',
                    title: '2450 - 2711'
                },
                {
                    id: 'Farin',
                    name: 'Farin',
                    title: '2560 - 2803'
                },
                {
                    id: 'Fundin',
                    name: 'Fundin',
                    title: '2662 - 2799'
                },
                {
                    id: 'Thorin II Oakenshield',
                    name: 'Thorin II Oakenshield',
                    title: '2746 - 2941',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Gorin',
                    name: 'Gorin',
                    title: '2671 - 2923'
                },
                {
                    id: 'Gimli',
                    name: 'Gimli',
                    title: '2879 - 120 FA?'
                },
                {
                    id: 'Fili',
                    name: 'Fili',
                    title: '2859 - 2941',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Kili',
                    name: 'Kili',
                    title: '2864 - 2941',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Balin',
                    name: 'Balin',
                    title: '2763 - 2994',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Dwalin',
                    name: 'Dwalin',
                    title: '2772 - 3112',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Oin II',
                    name: 'Oin II',
                    title: '2774 - 2994',
                    marker: {
                        fillColor: 'green'
                    }
                },
                {
                    id: 'Gloin II',
                    name: 'Gloin II',
                    title: '2783 - 15 F.A.',
                    marker: {
                        fillColor: 'green'
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
