// Medals per Games. Data parsed with olympic-medals.node.js, with the 2026
// Games added from the final medal table.
const columns = {
    Finland: [
        0, 11, 4, 3, 6, 0, 0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7, 7, 6, 12, 7, 9,
        5, 5, 6, 8, 6
    ],
    Austria: [
        0, 3, 4, 2, 4, 0, 0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10, 21, 9, 17, 17,
        23, 16, 17, 14, 18, 18
    ],
    Sweden: [
        0, 2, 5, 3, 7, 0, 0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4, 3, 3, 7, 14,
        11, 15, 14, 18, 18
    ],
    Norway: [
        0, 17, 15, 10, 15, 0, 0, 10, 16, 4, 6, 15, 14, 12, 7, 10, 9, 5, 20, 26,
        25, 25, 19, 23, 26, 39, 37, 41
    ],
    'U.S.': [
        0, 4, 6, 12, 4, 0, 0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6, 11, 13, 13,
        34, 25, 37, 28, 23, 25, 33
    ],
    'East Germany': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 14, 19, 23, 24, 25, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0
    ],
    'West Germany': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 5, 10, 5, 4, 8, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Germany: [
        0, 0, 1, 2, 6, 0, 0, 0, 7, 2, 8, 9, 0, 0, 0, 0, 0, 0, 26, 24, 29, 36,
        29, 30, 19, 31, 27, 26
    ],
    Netherlands: [
        0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 9, 9, 6, 4, 0, 7, 4, 4, 11, 8, 9, 8,
        24, 20, 17, 20
    ],
    Italy: [
        0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 4, 4, 5, 4, 2, 2, 5, 14, 20, 10, 13,
        11, 5, 8, 10, 17, 30
    ],
    Canada: [
        0, 1, 1, 7, 1, 0, 0, 3, 2, 3, 4, 3, 3, 1, 3, 2, 4, 5, 7, 13, 15, 17, 24,
        26, 25, 29, 26, 21
    ],
    Switzerland: [
        0, 3, 1, 1, 3, 0, 0, 10, 2, 6, 2, 0, 6, 10, 5, 5, 5, 15, 3, 9, 7, 11,
        14, 9, 11, 15, 15, 23
    ],
    'Great Britain': [
        0, 4, 1, 0, 3, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 2, 1, 2, 1, 1,
        4, 5, 2, 5
    ],
    France: [
        0, 3, 1, 1, 1, 0, 0, 5, 1, 0, 3, 7, 9, 3, 1, 1, 3, 2, 9, 5, 8, 11, 9,
        11, 15, 15, 14, 23
    ],
    Hungary: [
        0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 3, 0
    ],
    'Soviet Union': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 21, 25, 13, 16, 27, 22, 25, 29, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
    ],
    'Unified Team': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Russia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 18, 13, 22,
        15, 33, 0, 0, 0
    ],
    ROC: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 17, 32, 0
    ],
    Japan: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 1, 1, 7, 5, 10, 2, 1, 5,
        8, 13, 18, 24
    ],
    Czechoslovakia: [
        0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 3, 1, 1, 6, 3, 3, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Poland: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 6,
        6, 2, 1, 4
    ],
    Spain: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 2, 1, 3
    ],
    China: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 8, 8, 11,
        11, 9, 9, 15, 15
    ],
    'South Korea': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 6, 4, 11,
        14, 8, 17, 9, 10
    ],
    'Czech Republic': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 6,
        8, 7, 2, 5
    ],
    Belarus: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 3,
        6, 3, 2, 0
    ],
    Kazakhstan: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 1,
        1, 1, 0, 1
    ],
    Bulgaria: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 3, 1, 0,
        0, 0, 0, 2
    ],
    Denmark: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1
    ],
    Ukraine: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 2, 0,
        2, 1, 1, 0
    ],
    Australia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3,
        3, 3, 4, 6
    ],
    Belgium: [
        0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 1, 2, 1
    ],
    Romania: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Liechtenstein: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0
    ],
    Yugoslavia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Luxembourg: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    'New Zealand': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 2, 3, 3
    ],
    'North Korea': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Slovakia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3,
        1, 3, 2, 0
    ],
    Croatia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 3,
        1, 0, 0, 0
    ],
    Slovenia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 3,
        8, 2, 7, 4
    ],
    Latvia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2,
        4, 1, 1, 2
    ],
    Estonia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1,
        0, 0, 1, 1
    ],
    Uzbekistan: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    Brazil: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1
    ],
    Georgia: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1
    ]
};

Highcharts.chart('container', {

    dataTable: {
        columns
    },

    chart: {
        type: 'streamgraph',
        marginBottom: 30,
        zooming: {
            type: 'x'
        }
    },

    // Make sure connected countries have similar colors
    colors: [
        'var(--highcharts-color-0)',
        'var(--highcharts-color-1)',
        'var(--highcharts-color-2)',
        'var(--highcharts-color-3)',
        'var(--highcharts-color-4)',
        // East Germany, West Germany and Germany
        'color-mix(in srgb, var(--highcharts-color-5), white 20%)',
        'color-mix(in srgb, var(--highcharts-color-5), white 10%)',
        'var(--highcharts-color-5)',
        'var(--highcharts-color-6)',
        'var(--highcharts-color-7)',
        'var(--highcharts-color-8)',
        'var(--highcharts-color-9)',
        'var(--highcharts-color-0)',
        'var(--highcharts-color-1)',
        'var(--highcharts-color-3)',
        // Soviet Union, Unified Team, Russia and ROC
        'color-mix(in srgb, var(--highcharts-color-2), black 10%)',
        'color-mix(in srgb, var(--highcharts-color-2), black 20%)',
        'color-mix(in srgb, var(--highcharts-color-2), black 30%)',
        'color-mix(in srgb, var(--highcharts-color-2), black 40%)'
    ],

    title: {
        floating: true,
        align: 'left',
        text: 'Winter Olympic Medal Wins'
    },
    subtitle: {
        floating: true,
        align: 'left',
        y: 30,
        text: 'Source: <a href="https://www.olympedia.org/statistics">olympedia.org</a>'
    },

    xAxis: {
        maxPadding: 0,
        type: 'category',
        crosshair: true,
        categories: [
            '',
            '1924 Chamonix',
            '1928 St. Moritz',
            '1932 Lake Placid',
            '1936 Garmisch-Partenkirchen',
            '1940 <i>Cancelled (Sapporo)</i>',
            '1944 <i>Cancelled (Cortina d\'Ampezzo)</i>',
            '1948 St. Moritz',
            '1952 Oslo',
            '1956 Cortina d\'Ampezzo',
            '1960 Squaw Valley',
            '1964 Innsbruck',
            '1968 Grenoble',
            '1972 Sapporo',
            '1976 Innsbruck',
            '1980 Lake Placid',
            '1984 Sarajevo',
            '1988 Calgary',
            '1992 Albertville',
            '1994 Lillehammer',
            '1998 Nagano',
            '2002 Salt Lake City',
            '2006 Turin',
            '2010 Vancouver',
            '2014 Sochi',
            '2018 PyeongChang',
            '2022 Beijing',
            '2026 Milan Cortina'
        ],
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 270
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0
    },

    yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false,
        minPadding: 0.1,
        maxPadding: 0.15
    },

    legend: {
        enabled: false
    },

    annotations: [{
        labels: [{
            point: {
                x: 5.5,
                xAxis: 0,
                y: 30,
                yAxis: 0
            },
            text: 'Cancelled<br>during<br>World War II'
        }, {
            point: {
                x: 18,
                xAxis: 0,
                y: 90,
                yAxis: 0
            },
            text: 'Soviet Union fell,<br>Germany united'
        }, {
            point: {
                x: 24.25,
                xAxis: 0,
                y: 140,
                yAxis: 0
            },
            text: 'Russia banned from<br>the Olympic Games<br> in 2017'
        }],
        labelOptions: {
            backgroundColor: 'color-mix(in srgb, ' +
                'var(--highcharts-background-color) 50%, transparent)',
            borderColor: 'var(--highcharts-neutral-color-20)',
            style: {
                color: 'var(--highcharts-neutral-color-80)'
            }
        }
    }],

    plotOptions: {
        series: {
            label: {
                minFontSize: 5,
                maxFontSize: 15,
                style: {
                    color: 'rgba(255,255,255,0.75)'
                }
            },
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
    },

    series: Object.keys(columns).map(y => ({
        dataMapping: { y }
    })),

    exporting: {
        sourceWidth: 800,
        sourceHeight: 600
    }

});
