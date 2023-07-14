Highcharts.chart('container', {

    chart: {
        type: 'bubble',
        margin: [70, 70, 70, 70] // marginTop, marginRight, marginBottom and marginLeft
    },
    title: {
        text: 'Official regions of the United States'
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_capitals_in_the_United_States">Wikipedia.org</a>'
    },

    plotOptions: {
        series: {
            marker: {
                lineColor: 'transparent',
                symbol: 'hexagon',
                lineWidth: 0
            },
            dataLabels: {
                enabled: true,
                format: '{point.USstate}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },
    tooltip: {
        useHTML: true,
        headerFormat: null,
        pointFormat: '- State of <b>{point.USstate}</b><br/> - The <b>{point.region}</b> region<br/> <b>- {point.capital}</b> is the captal<br/> '
    },
    xAxis: {
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
            enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
    },
    yAxis: {

        gridLineWidth: 0,
        tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        minorTickLength: 0,
        tickLength: 0
    },
    legend: {
        enabled: false
    },

    series: [{
        data: [{
            y: 1,
            USstate: 'HI',
            capital: 'Honolulu',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 16,
            y: 1,
            USstate: 'FL',
            capital: 'Tallahassee',
            color: '#ffab00',
            region: 'south'
        }]
    }, {
        data: [{
            x: 7,
            y: 2,
            USstate: 'TX',
            capital: 'Austin',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 15,
            y: 2,
            USstate: 'GA',
            capital: 'Atlanta',
            color: '#ffab00',
            region: 'south'
        }]
    }, {
        data: [{
            x: 6,
            y: 3,
            USstate: 'NM',
            capital: 'Santa Fe',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 8,
            y: 3,
            USstate: 'OK',
            capital: 'Oklahoma City',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 10,
            y: 3,
            USstate: 'LA',
            capital: 'Baton Rouge',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 12,
            y: 3,
            USstate: 'MS',
            capital: 'Jackson',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 14,
            y: 3,
            USstate: 'AL',
            capital: 'Montgomery',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 16,
            y: 3,
            USstate: 'SC',
            capital: 'Columbia',
            color: '#ffab00',
            region: 'south'
        }]
    }, {
        data: [{
            x: 3,
            y: 4,
            USstate: 'CA',
            capital: 'Sacramento',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 5,
            y: 4,
            USstate: 'AZ',
            capital: 'Phoenix',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 7,
            y: 4,
            USstate: 'UT',
            capital: 'Salt Lake City',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 9,
            y: 4,
            USstate: 'KS',
            capital: 'Topeka',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 11,
            y: 4,
            USstate: 'AR',
            capital: 'Little Rock',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 13,
            y: 4,
            USstate: 'TN',
            capital: 'Nashville',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 15,
            y: 4,
            USstate: 'VA',
            capital: 'Richmond',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 17,
            y: 4,
            USstate: 'NC',
            capital: 'Raleigh',
            color: '#ffab00',
            region: 'south'
        }]
    }, {
        data: [{
            x: 2,
            y: 5,
            USstate: 'OR',
            capital: 'Salem',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 4,
            y: 5,
            USstate: 'NV',
            capital: 'Carson City',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 6,
            y: 5,
            USstate: 'CO',
            capital: 'Denver',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 8,
            y: 5,
            USstate: 'NE',
            capital: 'Lincoln',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 10,
            y: 5,
            USstate: 'MO',
            capital: 'Jefferson City',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 12,
            y: 5,
            USstate: 'KY',
            capital: 'Frankfort',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 14,
            y: 5,
            USstate: 'WV',
            capital: 'Charleston',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 16,
            y: 5,
            USstate: 'MD',
            capital: 'Annapolis',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 18,
            y: 5,
            USstate: 'DE',
            capital: 'Dover',
            color: '#ffab00',
            region: 'south'
        }, {
            x: 20,
            y: 5,
            USstate: 'DC',
            capital: 'Washington',
            color: '#ffab00',
            region: 'south'
        }]
    }, {
        data: [{
            x: 3,
            y: 6,
            USstate: 'ID',
            capital: 'Boise',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 5,
            y: 6,
            USstate: 'WY',
            capital: 'Cheyenne',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 7,
            y: 6,
            USstate: 'SD',
            capital: 'Pierre',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 9,
            y: 6,
            USstate: 'IA',
            capital: 'Des Moines',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 11,
            y: 6,
            USstate: 'IL',
            capital: 'Springfield',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 13,
            y: 6,
            USstate: 'IN',
            capital: 'Indianapolis',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 15,
            y: 6,
            USstate: 'OH',
            capital: 'Columbus',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 17,
            y: 6,
            USstate: 'PA',
            capital: 'Harrisburg',
            color: '#c51162',
            region: 'northeast'
        }, {
            x: 19,
            y: 6,
            USstate: 'NJ',
            capital: 'Trenton',
            color: '#c51162',
            region: 'northeast'
        }, {
            x: 21,
            y: 6,
            USstate: 'CT',
            capital: 'Hartford',
            color: '#c51162',
            region: 'northeast'
        }]
    }, {
        data: [{
            x: 2,
            y: 7,
            USstate: 'WA',
            capital: 'Olympia',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 4,
            y: 7,
            USstate: 'MT',
            capital: 'Helena',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 6,
            y: 7,
            USstate: 'ND',
            capital: 'Bismarck',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 8,
            y: 7,
            USstate: 'MN',
            capital: 'Saint Paul',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 10,
            y: 7,
            USstate: 'WI',
            capital: 'Madison',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 14,
            y: 7,
            USstate: 'MI',
            capital: 'Lansing',
            color: '#00c853',
            region: 'midwest'
        }, {
            x: 18,
            y: 7,
            USstate: 'NY',
            capital: 'Albany',
            color: '#c51162',
            region: 'northeast'
        }, {
            x: 20,
            y: 7,
            USstate: 'MA',
            capital: 'Boston',
            color: '#c51162',
            region: 'northeast'
        }, {
            x: 22,
            y: 7,
            USstate: 'RI',
            capital: 'Providence',
            color: '#c51162',
            region: 'northeast'
        }]
    }, {
        data: [{
            x: 19,
            y: 8,
            USstate: 'VT',
            capital: 'Montpelier',
            color: '#c51162',
            region: 'northeast'
        }, {
            x: 21,
            y: 8,
            USstate: 'NH',
            capital: 'Concord',
            color: '#c51162',
            region: 'northeast'
        }]
    }, {
        data: [{
            x: 0,
            y: 9,
            USstate: 'AK',
            capital: 'Juneau',
            color: '#2962ff',
            region: 'west'
        }, {
            x: 22,
            y: 9,
            USstate: 'ME',
            capital: 'Augusta',
            color: '#c51162',
            region: 'northeast'
        }]
    }]
});
