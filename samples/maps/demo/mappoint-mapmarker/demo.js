(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            margin: 1
        },

        title: {
            text: 'Categories of European capitals',
            floating: true,
            style: {
                textOutline: '5px contrast'
            }
        },

        subtitle: {
            text: 'Map markers in Highcharts',
            floating: true,
            y: 36,
            style: {
                textOutline: '5px contrast'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            padding: [0, 0, 85, 0]
        },

        legend: {
            floating: true,
            backgroundColor: '#ffffffcc'
        },

        plotOptions: {
            mappoint: {
                keys: ['id', 'lat', 'lon', 'name', 'y'],
                marker: {
                    lineWidth: 1,
                    lineColor: '#000',
                    symbol: 'mapmarker',
                    radius: 8
                },
                dataLabels: {
                    enabled: false
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="color:{point.color}">\u25CF</span> {point.key}<br/>',
            pointFormat: '{series.name}'
        },

        series: [{
            allAreas: true,
            name: 'Coastline',
            states: {
                inactive: {
                    opacity: 0.2
                }
            },
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: false,
            showInLegend: false,
            borderColor: 'blue',
            opacity: 0.3,
            borderWidth: 10,
            linecap: 'round'
        }, {
            allAreas: true,
            name: 'Countries',
            states: {
                inactive: {
                    opacity: 1
                }
            },
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: false,
            showInLegend: false,
            borderColor: 'rgba(0, 0, 0, 0.25)'
        }, {
            name: 'Coastal',
            color: 'rgb(124, 181, 236)',
            data: [
                [
                    'is',
                    64.15,
                    -21.95,
                    'Reykjavik',
                    -6
                ],
                [
                    'fo',
                    62,
                    -6.79,
                    'Torshavn',
                    1
                ],
                [
                    'fi',
                    60.16,
                    24.93,
                    'Helsinki',
                    -6
                ],
                [
                    'no',
                    59.91,
                    10.75,
                    'Oslo',
                    -8
                ],
                [
                    'ee',
                    59.43,
                    24.71,
                    'Tallinn',
                    -4
                ],
                [
                    'se',
                    59.33,
                    18.05,
                    'Stockholm',
                    -4
                ],
                [
                    'lv',
                    56.95,
                    24.1,
                    'Riga',
                    -2
                ],
                [
                    'dk',
                    55.66,
                    12.58,
                    'Copenhagen',
                    0
                ],
                [
                    'ie',
                    53.31,
                    -6.23,
                    'Dublin',
                    3
                ],
                [
                    'nl',
                    52.35,
                    4.91,
                    'Amsterdam',
                    -4
                ],
                [
                    'pt',
                    38.71,
                    -9.13,
                    'Lisbon',
                    15
                ],
                [
                    'gr',
                    37.98,
                    23.73,
                    'Athens',
                    13
                ],
                [
                    'mt',
                    35.88,
                    14.5,
                    'Valetta',
                    19
                ]


            ],
            type: 'mappoint'
        }, {
            name: 'Landlocked',
            color: 'rgb(241, 92, 128)',
            data: [
                [
                    'ru',
                    55.75,
                    37.6,
                    'Moscow',
                    -5
                ],
                [
                    'lt',
                    54.68,
                    25.31,
                    'Vilnius',
                    -3
                ],
                [
                    'by',
                    53.9,
                    27.56,
                    'Minsk',
                    -3
                ],
                [
                    'de',
                    52.51,
                    13.4,
                    'Berlin',
                    -5
                ],
                [
                    'pl',
                    52.25,
                    21,
                    'Warsaw',
                    -10
                ],
                [
                    'gb',
                    51.5,
                    -0.08,
                    'London',
                    -1
                ],
                [
                    'be',
                    50.83,
                    4.33,
                    'Brussels',
                    -2
                ],
                [
                    'ua',
                    50.43,
                    30.51,
                    'Kyiv',
                    -3
                ],
                [
                    'cz',
                    50.08,
                    14.46,
                    'Prague',
                    -3
                ],
                [
                    'lu',
                    49.6,
                    6.11,
                    'Luxembourg',
                    -2
                ],
                [
                    'fr',
                    48.86,
                    2.33,
                    'Paris',
                    -1
                ],
                [
                    'at',
                    48.2,
                    16.36,
                    'Vienna',
                    0
                ],
                [
                    'sk',
                    48.15,
                    17.11,
                    'Bratislava',
                    -1
                ],
                [
                    'hu',
                    47.5,
                    19.08,
                    'Budapest',
                    -1
                ],
                [
                    'li',
                    47.13,
                    9.51,
                    'Vaduz',
                    4
                ],
                [
                    'md',
                    47,
                    28.85,
                    'Chisinau',
                    0
                ],
                [
                    'ch',
                    46.91,
                    7.46,
                    'Bern',
                    2
                ],
                [
                    'si',
                    46.05,
                    14.51,
                    'Ljubljana',
                    0
                ],
                [
                    'hr',
                    45.8,
                    16,
                    'Zagreb',
                    0
                ],
                [
                    'rs',
                    44.83,
                    20.5,
                    'Belgrade',
                    2
                ],
                [
                    'ro',
                    44.43,
                    26.1,
                    'Bucharest',
                    1
                ],
                [
                    'sm',
                    43.93,
                    12.41,
                    'San Marino',
                    3
                ],
                [
                    'ba',
                    43.86,
                    18.41,
                    'Sarajevo',
                    7
                ],
                [
                    'mc',
                    43.73,
                    7.41,
                    'Monaco',
                    8
                ],
                [
                    'bg',
                    42.68,
                    23.31,
                    'Sofia',
                    1
                ],
                [
                    'me',
                    42.43,
                    19.26,
                    'Podgorica',
                    9
                ],
                [
                    'ad',
                    42.2,
                    1.24,
                    'Andorra la Vella',
                    7
                ],
                [
                    'mk',
                    42,
                    21.43,
                    'Skopje',
                    4
                ],
                [
                    'it',
                    41.9,
                    12.48,
                    'Rome',
                    12
                ],
                [
                    'va',
                    41.9,
                    12.45,
                    'Vatican',
                    12
                ],
                [
                    'al',
                    41.31,
                    19.81,
                    'Tirana',
                    11
                ],
                [
                    'es',
                    40.4,
                    -3.68,
                    'Madrid',
                    11
                ],
                [
                    'tr',
                    39.93,
                    32.86,
                    'Ankara',
                    9
                ],
                [
                    'nc',
                    35.18,
                    33.36,
                    'North Nicosia',
                    16
                ],
                [
                    'cy',
                    35.16,
                    33.36,
                    'Nicosia',
                    16
                ]
            ],
            type: 'mappoint'
        }]
    });

})();
