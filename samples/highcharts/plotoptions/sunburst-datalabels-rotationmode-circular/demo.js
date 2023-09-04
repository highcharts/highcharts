const data = [{
    id: '0.0',
    parent: '',
    name: 'The World'
}, {
    id: '1.1',
    parent: '0.0',
    name: 'Europe'
}, {
    id: '1.2',
    parent: '0.0',
    name: 'Africa'
}, {
    id: '1.3',
    parent: '0.0',
    name: 'Asia'
}, {
    id: '1.4',
    parent: '0.0',
    name: 'North America'
}, {
    id: '1.5',
    parent: '0.0',
    name: 'South America'
}, {
    id: '1.6',
    parent: '0.0',
    name: 'Australia and Oceanic'
},

/* Europe */

{
    id: 'E.1',
    parent: '1.1',
    name: 'United Kingdom'
},
{
    parent: 'E.1',
    name: 'London',
    value: 19842800
},
{
    id: 'E.2',
    parent: '1.1',
    name: 'France'
},
{
    parent: 'E.2',
    name: 'Paris',
    value: 14263000
},
{
    parent: 'E.2',
    name: 'Nice',
    value: 2141000
},
{
    id: 'E.3',
    parent: '1.1',
    name: 'Italy'
},
{
    parent: 'E.3',
    name: 'Rome',
    value: 9565500
},
{
    parent: 'E.3',
    name: 'Milan',
    value: 6882500
},
{
    parent: 'E.3',
    name: 'Venice',
    value: 5227300
},
{
    parent: 'E.3',
    name: 'Florence',
    value: 4878500
},
{
    id: 'E.4',
    parent: '1.1',
    name: 'Czech Republic'
},
{
    parent: 'E.4',
    name: 'Prague',
    value: 8550700
},
{
    id: 'E.5',
    parent: '1.1',
    name: 'Spain'
},
{
    parent: 'E.5',
    name: 'Barcelona',
    value: 7624100
},
{
    parent: 'E.5',
    name: 'Madrid',
    value: 5581000
},
{
    id: 'E.6',
    parent: '1.1',
    name: 'Netherlands'
},
{
    parent: 'E.6',
    name: 'Amsterdam',
    value: 6570400
},
{
    id: 'E.7',
    parent: '1.1',
    name: 'Austria'
},
{
    parent: 'E.7',
    name: 'Vienna',
    value: 6043700
},
{
    id: 'E.8',
    parent: '1.1',
    name: 'Germany'
},
{
    parent: 'E.8',
    name: 'Berlin',
    value: 5833100
},
{
    parent: 'E.8',
    name: 'Munich',
    value: 3492000
},
{
    parent: 'E.8',
    name: 'Frankfurt am Main',
    value: 2511400
},
{
    id: 'E.9',
    parent: '1.1',
    name: 'Greece'
},
{
    parent: 'E.9',
    name: 'Athens',
    value: 4978600
},
{
    parent: 'E.9',
    name: 'Heraklion',
    value: 3208300
},
{
    parent: 'E.9',
    name: 'Rhodes',
    value: 2252100
},
{
    id: 'E.10',
    parent: '1.1',
    name: 'Ireland'
},
{
    parent: 'E.10',
    name: 'Dublin',
    value: 4977000
},
{
    id: 'E.11',
    parent: '1.1',
    name: 'Hungary'
},
{
    parent: 'E.11',
    name: 'Budapest',
    value: 3823900
},
{
    id: 'E.12',
    parent: '1.1',
    name: 'Portugal'
},
{
    parent: 'E.12',
    name: 'Lisbon',
    value: 3320300
},
{
    id: 'E.13',
    parent: '1.1',
    name: 'Denmark'
},
{
    parent: 'E.13',
    name: 'Copenhagen',
    value: 3061000
},
{
    id: 'E.14',
    parent: '1.1',
    name: 'Poland'
},
{
    parent: 'E.14',
    name: 'Warsaw',
    value: 2794700
},
{
    parent: 'E.14',
    name: 'Cracow',
    value: 2550000
},
{
    id: 'E.15',
    parent: '1.1',
    name: 'Belgium'
},
{
    parent: 'E.15',
    name: 'Brussels',
    value: 2524000
},
{
    id: 'E.16',
    parent: '1.1',
    name: 'Sweden'
},
{
    parent: 'E.16',
    name: 'Stockholm',
    value: 2471200
},

/* Africa */

{
    id: 'Af.1',
    parent: '1.2',
    name: 'South Africa'
},
{
    parent: 'Af.1',
    name: 'Johannesburg',
    value: 5537300
},
{
    id: 'Af.2',
    parent: '1.2',
    name: 'Egypt'
},
{
    parent: 'Af.2',
    name: 'Cairo',
    value: 3067100
},
{
    id: 'Af.3',
    parent: '1.2',
    name: 'Morocco'
},
{
    parent: 'Af.3',
    name: 'Marrakesh',
    value: 2668700
},

/* Asia */

{
    id: 'Af.4',
    parent: '1.3',
    name: 'Hong Kong Special Administrative Region of the People\'s Republic of China'
},
{
    parent: 'Af.4',
    name: 'Hong Kong',
    value: 25695800
},
{
    id: 'Af.5',
    parent: '1.3',
    name: 'Thailand'
},
{
    parent: 'Af.5',
    name: 'Bangkok',
    value: 23270600
},
{
    parent: 'Af.5',
    name: 'Phuket',
    value: 12079500
},
{
    parent: 'Af.5',
    name: 'Pattaya',
    value: 7313500
},
{
    parent: 'Af.5',
    name: 'Chiang Mai',
    value: 2944600
},
{
    id: 'Af.6',
    parent: '1.3',
    name: 'Republic of Singapore'
},
{
    parent: 'Af.6',
    name: 'Singapore',
    value: 17681800
},
{
    id: 'Af.7',
    parent: '1.3',
    name: 'Macao Special Administrative Region of the People\'s Republic of China'
},
{
    parent: 'Af.7',
    name: 'Macau',
    value: 16299100
},
{
    id: 'Af.8',
    parent: '1.3',
    name: 'United Arab Emirates'
},
{
    parent: 'Af.8',
    name: 'Dubai',
    value: 16010000
},
{
    parent: 'Af.8',
    name: 'Abu Dhabi',
    value: 2182900
},
{
    id: 'Af.9',
    parent: '1.3',
    name: 'China'
},
{
    parent: 'Af.9',
    name: 'Shenzhen',
    value: 12962000
},
{
    parent: 'Af.9',
    name: 'Guangzhou',
    value: 9075500
},
{
    parent: 'Af.9',
    name: 'Shanghai',
    value: 7201200
},
{
    parent: 'Af.9',
    name: 'Beijing',
    value: 4156700
},
{
    parent: 'Af.9',
    name: 'Zhuhai',
    value: 3277000
},
{
    parent: 'Af.9',
    name: 'Guilin',
    value: 2531500
},
{
    id: 'Af.10',
    parent: '1.3',
    name: 'Malaysia'
},
{
    parent: 'Af.10',
    name: 'Kuala Lumpur',
    value: 12843500
},
{
    parent: 'Af.10',
    name: 'Johor Bahru',
    value: 5571400
},
{
    parent: 'Af.10',
    name: 'Penang Island',
    value: 3194400
},
{
    id: 'Af.11',
    parent: '1.3',
    name: 'India'
},
{
    parent: 'Af.11',
    name: 'Delhi',
    value: 10257000
},
{
    parent: 'Af.11',
    name: 'Mumbai',
    value: 8884900
},
{
    parent: 'Af.11',
    name: 'Agra',
    value: 6744400
},
{
    parent: 'Af.11',
    name: 'Chennai',
    value: 5186300
},
{
    parent: 'Af.11',
    name: 'Jaipur',
    value: 5088600
},
{
    parent: 'Af.11',
    name: 'Kolkata',
    value: 2550400
},
{
    id: 'Af.12',
    parent: '1.3',
    name: 'Japan'
},
{
    parent: 'Af.12',
    name: 'Tokyo',
    value: 9713500
},
{
    parent: 'Af.12',
    name: 'Osaka',
    value: 6133100
},
{
    parent: 'Af.12',
    name: 'Kyoto',
    value: 3029600
},
{
    parent: 'Af.12',
    name: 'Chiba',
    value: 2152600
},
{
    id: 'Af.13',
    parent: '1.3',
    name: 'Taiwan'
},
{
    parent: 'Af.13',
    name: 'Taipei',
    value: 9318900
},
{
    parent: 'Af.13',
    name: 'Taichung',
    value: 2175000
},
{
    id: 'Af.14',
    parent: '1.3',
    name: 'Saudi Arabia'
},
{
    parent: 'Af.14',
    name: 'Mecca',
    value: 8745000
},
{
    parent: 'Af.14',
    name: 'Riyadh',
    value: 5518400
},
{
    parent: 'Af.14',
    name: 'Dammam',
    value: 584800
},
{
    id: 'Af.15',
    parent: '1.3',
    name: 'Turkey'
},
{
    parent: 'Af.15',
    name: 'Istanbul',
    value: 8642300
},
{
    parent: 'Af.15',
    name: 'Antalya',
    value: 6447400
},
{
    parent: 'Af.15',
    name: 'Edirne',
    value: 2934100
},
{
    parent: 'Af.15',
    name: 'Artvin',
    value: 2572300
},
{
    id: 'Af.16',
    parent: '1.3',
    name: 'South Korea'
},
{
    parent: 'Af.16',
    name: 'Seoul',
    value: 7659100
},
{
    parent: 'Af.16',
    name: 'Jeju',
    value: 2429400
},
{
    id: 'Af.17',
    parent: '1.3',
    name: 'Indonesia'
},
{
    parent: 'Af.17',
    name: 'Denpasar',
    value: 6238300
},
{
    parent: 'Af.17',
    name: 'Jakarta',
    value: 3587500
},
{
    id: 'Af.18',
    parent: '1.3',
    name: 'Vietnam'
},
{
    parent: 'Af.18',
    name: 'Ho Chi Minh City',
    value: 5500000
},
{
    parent: 'Af.18',
    name: 'Hanoi',
    value: 4300000
},
{
    parent: 'Af.18',
    name: 'Ha Long',
    value: 4000000
},
{
    id: 'Af.19',
    parent: '1.3',
    name: 'Russia'
},
{
    parent: 'Af.19',
    name: 'Moscow',
    value: 4632300
},
{
    parent: 'Af.19',
    name: 'Saint Petersburg',
    value: 2856500
},
{
    id: 'Af.20',
    parent: '1.3',
    name: 'Cambodia'
},
{
    parent: 'Af.20',
    name: 'Phnom Penh',
    value: 3016900
},
{
    parent: 'Af.20',
    name: 'Siem Reap',
    value: 2337600
},
{
    id: 'Af.21',
    parent: '1.3',
    name: 'Qatar'
},
{
    parent: 'Af.21',
    name: 'Doha',
    value: 3016600
},
{
    parent: 'Af.20',
    name: 'Siem Reap',
    value: 2337600
},
{
    id: 'Af.22',
    parent: '1.3',
    name: 'Israel'
},
{
    parent: 'Af.22',
    name: 'Jerusalem',
    value: 2888600
},
{
    parent: 'Af.22',
    name: 'Tel Aviv',
    value: 2613800
},
{
    id: 'Af.23',
    parent: '1.3',
    name: 'Sri Lanka'
},
{
    parent: 'Af.23',
    name: 'Colombo',
    value: 2206000
},

/* North America */

{
    id: 'NA.1',
    parent: '1.4',
    name: 'United States'
},
{
    parent: 'NA.1',
    name: 'New York City',
    value: 13100000
},
{
    parent: 'NA.1',
    name: 'Miami',
    value: 8075800
},
{
    parent: 'NA.1',
    name: 'Las Vegas',
    value: 6687800
},
{
    parent: 'NA.1',
    name: 'Los Angeles',
    value: 6074300
},
{
    parent: 'NA.1',
    name: 'Orlando',
    value: 5269000
},
{
    parent: 'NA.1',
    name: 'San Francisco',
    value: 3601600
},
{
    parent: 'NA.1',
    name: 'Honolulu',
    value: 2574900
},
{
    parent: 'NA.1',
    name: 'Washington D.C.',
    value: 2154000
},
{
    id: 'NA.2',
    parent: '1.4',
    name: 'Mexico'
},
{
    parent: 'NA.2',
    name: 'Cancún',
    value: 6761000
},
{
    parent: 'NA.2',
    name: 'Mexico City',
    value: 2351000
},
{
    id: 'NA.3',
    parent: '1.4',
    name: 'Canada'
},
{
    parent: 'NA.3',
    name: 'Toronto',
    value: 4451000
},
{
    parent: 'NA.3',
    name: 'Vancouver',
    value: 2652600
},
{
    id: 'NA.4',
    parent: '1.4',
    name: 'Dominican Republic'
},
{
    parent: 'NA.4',
    name: 'Punta Cana',
    value: 3673600
},

/* South America */

{
    id: 'SA.1',
    parent: '1.5',
    name: 'Peru'
},
{
    parent: 'SA.1',
    name: 'Lima',
    value: 2274000
},
{
    id: 'SA.2',
    parent: '1.5',
    name: 'Brazil'
},
{
    parent: 'SA.2',
    name: 'Rio de Janeiro',
    value: 2253600
},
{
    id: 'SA.3',
    parent: '1.5',
    name: 'Argentina'
},
{
    parent: 'SA.3',
    name: 'Buenos Aires',
    value: 2241200
},

/* Australia */

{
    id: 'A.1',
    parent: '1.6',
    name: 'Australia'
},
{
    parent: 'A.1',
    name: 'Sydney',
    value: 3857900
},
{
    parent: 'A.1',
    name: 'Melbourne',
    value: 2782700
},
{
    id: 'A.2',
    parent: '1.6',
    name: 'New Zealand'
},
{
    parent: 'A.2',
    name: 'Auckland',
    value: 2625100
}
];

// Splice in transparent for the center circle
Highcharts.getOptions().colors.splice(0, 0, 'transparent');


Highcharts.chart('container', {

    chart: {
        height: '100%'
    },

    title: {
        text: 'Top 100 cities ranked by the number of international visitors - 2017'
    },
    subtitle: {
        text: 'Euromonitor Rank - Source <a href="https://en.wikipedia.org/wiki/List_of_cities_by_international_visitors">Wikipedia</a>'
    },
    series: [{
        type: 'sunburst',
        data: data,
        name: 'Root',
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
            rotationMode: 'circular',
            filter: {
                property: 'outerArcLength',
                operator: '>',
                value: 20
            }
        },
        levels: [{
            level: 1,
            levelIsConstant: false
        }, {
            level: 2,
            colorByPoint: true
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: -0.5
            }
        }, {
            level: 4,
            colorVariation: {
                key: 'brightness',
                to: 0.5
            }
        }]
    }],
    tooltip: {
        headerFormat: '',
        pointFormat: 'Arrivals to <b>{point.name}</b>: <b>{point.value}</b>'
    }
});

[...document.querySelectorAll('#button-row button')].forEach(button =>
    button.addEventListener('click', e => {
        Highcharts.charts[0].series[0].update({
            dataLabels: {
                rotationMode: e.target.innerText
            }
        });
    })
);
