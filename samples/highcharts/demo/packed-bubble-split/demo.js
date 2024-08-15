Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Carbon emissions around the world (2022)',
        align: 'left'
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions" target="_blank">Wikipedia</a>',
        align: 'left'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 250
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'Europe',
        data: [{
            name: 'Germany',
            value: 673.6
        }, {
            name: 'Croatia',
            value: 17.2
        },
        {
            name: 'Belgium',
            value: 90.4
        },
        {
            name: 'Czech Republic',
            value: 111.5
        },
        {
            name: 'Netherlands',
            value: 134.7
        },
        {
            name: 'Spain',
            value: 254.4
        },
        {
            name: 'Ukraine',
            value: 132.5
        },
        {
            name: 'Poland',
            value: 322.0
        },
        {
            name: 'France',
            value: 315.5
        },
        {
            name: 'Romania',
            value: 77.3
        },
        {
            name: 'United Kingdom',
            value: 340.6
        }, {
            name: 'Turkey',
            value: 481.2
        }, {
            name: 'Italy',
            value: 322.9
        },
        {
            name: 'Greece',
            value: 56.8
        },
        {
            name: 'Austria',
            value: 61.2
        },
        {
            name: 'Belarus',
            value: 57.4
        },
        {
            name: 'Serbia',
            value: 56.9
        },
        {
            name: 'Finland',
            value: 37.3
        },
        {
            name: 'Bulgaria',
            value: 50.1
        },
        {
            name: 'Portugal',
            value: 41.3
        },
        {
            name: 'Norway',
            value: 42.2
        },
        {
            name: 'Sweden',
            value: 37.8
        },
        {
            name: 'Hungary',
            value: 47.3
        },
        {
            name: 'Switzerland',
            value: 36.1
        },
        {
            name: 'Denmark',
            value: 29.2
        },
        {
            name: 'Slovakia',
            value: 35.2
        },
        {
            name: 'Ireland',
            value: 37.8
        },
        {
            name: 'Croatia',
            value: 17.2
        },
        {
            name: 'Estonia',
            value: 10.8
        },
        {
            name: 'Slovenia',
            value: 13.9
        },
        {
            name: 'Lithuania',
            value: 13.3
        },
        {
            name: 'Luxembourg',
            value: 7.6
        },
        {
            name: 'Macedonia',
            value: 8.3
        },
        {
            name: 'Moldova',
            value: 8.7
        },
        {
            name: 'Latvia',
            value: 6.7
        },
        {
            name: 'Cyprus',
            value: 7.5
        }]
    }, {
        name: 'Africa',
        data: [{
            name: 'Senegal',
            value: 12.1
        },
        {
            name: 'Cameroon',
            value: 10.1
        },
        {
            name: 'Zimbabwe',
            value: 10.2
        },
        {
            name: 'Ghana',
            value: 24.5
        },
        {
            name: 'Kenya',
            value: 21.5
        },
        {
            name: 'Sudan',
            value: 24.5
        },
        {
            name: 'Tunisia',
            value: 35.9
        },
        {
            name: 'Angola',
            value: 20.2
        },
        {
            name: 'Libya',
            value: 62.7
        },
        {
            name: 'Ivory Coast',
            value: 14.5
        },
        {
            name: 'Morocco',
            value: 72.6
        },
        {
            name: 'Ethiopia',
            value: 21.1
        },
        {
            name: 'United Republic of Tanzania',
            value: 17.0
        },
        {
            name: 'Nigeria',
            value: 122.8
        },
        {
            name: 'South Africa',
            value: 405.0
        }, {
            name: 'Egypt',
            value: 266.0
        }, {
            name: 'Algeria',
            value: 177.1
        }]
    }, {
        name: 'Oceania',
        data: [{
            name: 'Australia',
            value: 393.2
        },
        {
            name: 'New Zealand',
            value: 32.4
        },
        {
            name: 'Papua New Guinea',
            value: 4.7
        }]
    }, {
        name: 'North America',
        data: [{
            name: 'Costa Rica',
            value: 8.6
        },
        {
            name: 'Honduras',
            value: 10.6
        },
        {
            name: 'Jamaica',
            value: 6.1
        },
        {
            name: 'Panama',
            value: 11.4
        },
        {
            name: 'Guatemala',
            value: 20.1
        },
        {
            name: 'Dominican Republic',
            value: 23.5
        },
        {
            name: 'Cuba',
            value: 24.8
        },
        {
            name: 'USA',
            value: 4853.8
        }, {
            name: 'Canada',
            value: 582.1
        }, {
            name: 'Mexico',
            value: 487.8
        }]
    }, {
        name: 'South America',
        data: [{
            name: 'El Salvador',
            value: 8.0
        },
        {
            name: 'Uruguay',
            value: 8.5
        },
        {
            name: 'Bolivia',
            value: 22.0
        },
        {
            name: 'Trinidad and Tobago',
            value: 29.2
        },
        {
            name: 'Ecuador',
            value: 46.1
        },
        {
            name: 'Chile',
            value: 92.9
        },
        {
            name: 'Peru',
            value: 61.6
        },
        {
            name: 'Colombia',
            value: 88.5
        },
        {
            name: 'Brazil',
            value: 466.8
        }, {
            name: 'Argentina',
            value: 184.0
        },
        {
            name: 'Venezuela',
            value: 96.9
        }]
    }, {
        name: 'Asia',
        data: [{
            name: 'Nepal',
            value: 15.8
        },
        {
            name: 'Georgia',
            value: 12.0
        },
        {
            name: 'Brunei Darussalam',
            value: 9.4
        },
        {
            name: 'Kyrgyzstan',
            value: 10.3
        },
        {
            name: 'Afghanistan',
            value: 5.7
        },
        {
            name: 'Myanmar',
            value: 37.4
        },
        {
            name: 'Mongolia',
            value: 22.1
        },
        {
            name: 'Sri Lanka',
            value: 18.5
        },
        {
            name: 'Bahrain',
            value: 38.0
        },
        {
            name: 'Yemen',
            value: 12.3
        },
        {
            name: 'Jordan',
            value: 23.6
        },
        {
            name: 'Lebanon',
            value: 23.8
        },
        {
            name: 'Azerbaijan',
            value: 37.1
        },
        {
            name: 'Singapore',
            value: 53.4
        },
        {
            name: 'Hong Kong',
            value: 32.4
        },
        {
            name: 'Syria',
            value: 28.2
        },
        {
            name: 'DPR Korea',
            value: 54.4
        },
        {
            name: 'Israel',
            value: 61.8
        },
        {
            name: 'Turkmenistan',
            value: 69.9
        },
        {
            name: 'Oman',
            value: 91.6
        },
        {
            name: 'Qatar',
            value: 102.6
        },
        {
            name: 'Philippines',
            value: 155.4
        },
        {
            name: 'Kuwait',
            value: 110.1
        },
        {
            name: 'Uzbekistan',
            value: 132.4
        },
        {
            name: 'Iraq',
            value: 193.8
        },
        {
            name: 'Pakistan',
            value: 199.3
        },
        {
            name: 'Vietnam',
            value: 327.9
        },
        {
            name: 'United Arab Emirates',
            value: 218.8
        },
        {
            name: 'Malaysia',
            value: 277.5
        },
        {
            name: 'Kazakhstan',
            value: 245.9
        },
        {
            name: 'Thailand',
            value: 282.4
        },
        {
            name: 'Taiwan',
            value: 275.6
        },
        {
            name: 'Indonesia',
            value: 692.2
        },
        {
            name: 'Saudi Arabia',
            value: 607.9
        },
        {
            name: 'Japan',
            value: 1082.6
        },
        {
            name: 'China',
            value: 12667.4
        },
        {
            name: 'India',
            value: 2693.0
        },
        {
            name: 'Russia',
            value: 1909.0
        },
        {
            name: 'Iran',
            value: 686.4
        },
        {
            name: 'Korea',
            value: 635.5
        }]
    }]
});
