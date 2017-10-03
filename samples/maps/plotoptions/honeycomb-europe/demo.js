Highcharts.chart('container', {
    chart: {
        type: 'tilemap',
        height: '115%',
        inverted: true
    },

    colors: [
        'rgba(103, 232, 99, 0.5)', 'rgba(135, 207, 233, 0.5)',
        'rgba(255, 241, 118, 0.5)', 'rgba(233, 135, 207, 0.5)'
    ],

    title: {
        text: 'European Countries'
    },

    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/File:European_sub-regions_(according_to_EuroVoc,_the_thesaurus_of_the_EU).png">Wikipedia.org</a>'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b> belongs to <b>{series.name}</b>'
    },

    plotOptions: {
        series: {
            pointPadding: 2,
            dataLabels: {
                enabled: true,
                format: '{point.hc-a2}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },

    series: [{
        name: 'Eastern Europe',
        data: [{
            'hc-a2': 'BY',
            name: 'Belarus',
            x: 3,
            y: 7
        }, {
            'hc-a2': 'BA',
            name: 'Bosnia and Herzegovina',
            x: 7,
            y: 5
        }, {
            'hc-a2': 'BG',
            name: 'Bulgaria',
            x: 6,
            y: 7
        }, {
            'hc-a2': 'HR',
            name: 'Croatia',
            x: 6,
            y: 5
        }, {
            'hc-a2': 'CZ',
            name: 'Czech Republic',
            x: 4,
            y: 5
        }, {
            'hc-a2': 'EE',
            name: 'Estonia',
            x: 1,
            y: 7
        }, {
            'hc-a2': 'HU',
            name: 'Hungary',
            x: 5,
            y: 6
        }, {
            'hc-a2': 'LV',
            name: 'Latvia',
            x: 2,
            y: 7
        }, {
            'hc-a2': 'LT',
            name: 'Lithuania',
            x: 2,
            y: 6
        }, {
            'hc-a2': 'MD',
            name: 'Moldova',
            x: 5,
            y: 8
        }, {
            'hc-a2': 'PL',
            name: 'Poland',
            x: 3,
            y: 6
        }, {
            'hc-a2': 'RO',
            name: 'Romania',
            x: 5,
            y: 7
        }, {
            'hc-a2': 'RU',
            name: 'Russia',
            x: 3,
            y: 8
        }, {
            'hc-a2': 'SK',
            name: 'Slovakia',
            x: 4,
            y: 6
        }, {
            'hc-a2': 'UA',
            name: 'Ukraine',
            x: 4,
            y: 7
        }, {
            'hc-a2': 'KV',
            name: 'Kosovo',
            x: 8,
            y: 6
        }, {
            'hc-a2': 'MK',
            name: 'Macedonia',
            x: 7,
            y: 7
        }, {
            'hc-a2': 'ME',
            name: 'Montenegro',
            x: 7,
            y: 6
        }, {
            'hc-a2': 'RS',
            name: 'Republic of Serbia',
            x: 6,
            y: 6
        }, {
            'hc-a2': 'SI',
            name: 'Slovenia',
            x: 6,
            y: 4
        }, {
            'hc-a2': 'TR',
            name: 'Turkey',
            x: 7,
            y: 8
        }]
    }, {
        name: 'Northern Europe',
        data: [{
            'hc-a2': 'DK',
            name: 'Denmark',
            x: 2,
            y: 4
        }, {
            'hc-a2': 'FO',
            name: 'Faroe Islands',
            x: 0,
            y: 2
        }, {
            'hc-a2': 'FI',
            name: 'Finland',
            x: 0,
            y: 6
        }, {
            'hc-a2': 'IS',
            name: 'Iceland',
            x: -1,
            y: 2
        }, {
            'hc-a2': 'NO',
            name: 'Norway',
            x: 0,
            y: 4
        }, {
            'hc-a2': 'SE',
            name: 'Sweden',
            x: 0,
            y: 5
        }]
    }, {
        name: 'Southern Europe',
        data: [{
            'hc-a2': 'IT',
            name: 'Italy',
            x: 6,
            y: 3
        }, {
            'hc-a2': 'GR',
            name: 'Greece',
            x: 9,
            y: 6
        }, {
            'hc-a2': 'MT',
            name: 'Malta',
            x: 7,
            y: 2
        }, {
            'hc-a2': 'AL',
            name: 'Albania',
            x: 8,
            y: 5
        }, {
            'hc-a2': 'PT',
            name: 'Portugal',
            x: 5,
            y: 1
        }, {
            'hc-a2': 'ES',
            name: 'Spain',
            x: 5,
            y: 2
        }, {
            'hc-a2': 'CY',
            name: 'Cyprus',
            x: 9,
            y: 8
        }]
    }, {
        name: 'Western Europe',
        data: [{
            'hc-a2': 'LI',
            name: 'Liechtenstein',
            x: 5,
            y: 4
        }, {
            'hc-a2': 'AT',
            name: 'Austria',
            x: 5,
            y: 5
        }, {
            'hc-a2': 'BE',
            name: 'Belgium',
            x: 3,
            y: 3
        }, {
            'hc-a2': 'FR',
            name: 'France',
            x: 4,
            y: 2
        }, {
            'hc-a2': 'DE',
            name: 'Germany',
            x: 3,
            y: 5
        }, {
            'hc-a2': 'IE',
            name: 'Ireland',
            x: 2,
            y: 0
        }, {
            'hc-a2': 'LU',
            name: 'Luxembourg',
            x: 4,
            y: 3
        }, {
            'hc-a2': 'NL',
            name: 'Netherlands',
            x: 3,
            y: 4
        }, {
            'hc-a2': 'CH',
            name: 'Switzerland',
            x: 4,
            y: 4
        }, {
            'hc-a2': 'GB',
            name: 'United Kingdom',
            x: 2,
            y: 1
        }]
    }]
});
