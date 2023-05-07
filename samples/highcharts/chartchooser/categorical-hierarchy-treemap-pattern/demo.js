Highcharts.chart('container', {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat:
        '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
        },
        description:
      'The demo below visualizes the Fiji divisions and provinces by population in 2017. The central and Western provinces are the most populated, where the Northern and Eastern provinces are the least populated.'
    },

    series: [
        {
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            dataLabels: {
                enabled: false
            },
            borderColor: '#000000',
            levels: [
                {
                    level: 1,
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        style: {
                            textOutline: '5px contrast',
                            fontSize: 18
                        },
                        zIndex: 9
                    },
                    borderWidth: 3
                }
            ],
            data: [
                {
                    id: 'Central',
                    name: 'Central',
                    value: 378148,
                    color: { patternIndex: 0 }
                },
                {
                    id: 'Naitasiri',
                    name: 'Naitasiri',
                    value: 177678,
                    parent: 'Central'
                },
                {
                    id: 'Namosi',
                    name: 'Namosi',
                    value: 7871,
                    parent: 'Central'
                },
                {
                    id: 'Rewa',
                    name: 'Rewa',
                    value: 108016,
                    parent: 'Central'
                },
                {
                    id: 'Serua',
                    name: 'Serua',
                    value: 20031,
                    parent: 'Central'
                },
                {
                    id: 'Tailevu',
                    name: 'Tailevu',
                    value: 64552,
                    parent: 'Central'
                },
                {
                    id: 'Northern',
                    name: 'Northern',
                    value: 131918,
                    color: { patternIndex: 1 }
                },
                {
                    id: 'Bua',
                    name: 'Bua',
                    value: 15466,
                    parent: 'Northern'
                },
                {
                    id: 'Cakaudrove',
                    name: 'Cakaudrove',
                    value: 50469,
                    parent: 'Northern'
                },
                {
                    id: 'Macuata',
                    name: 'Macuata',
                    value: 65983,
                    parent: 'Northern'
                },
                {
                    id: 'Eastern',
                    name: 'Eastern',
                    value: 36156,
                    color: { patternIndex: 2 }
                },
                {
                    id: 'Kadavu',
                    name: 'Kadavu',
                    value: 10897,
                    parent: 'Eastern'
                },
                {
                    id: 'Lau',
                    name: 'Lau',
                    value: 9602,
                    parent: 'Eastern'
                },
                {
                    id: 'Lomaiviti',
                    name: 'Lomaiviti',
                    value: 15657,
                    parent: 'Eastern'
                },
                {
                    id: 'Western',
                    name: 'Western',
                    value: 337071,
                    color: { patternIndex: 3 }
                },
                {
                    id: 'Ba',
                    name: 'Ba',
                    value: 247708,
                    parent: 'Western'
                },
                {
                    id: 'Nadroga-Navosa',
                    name: 'Nadroga-Navosa',
                    value: 58931,
                    parent: 'Western'
                },
                {
                    id: 'Ra',
                    name: 'Ra',
                    value: 30432,
                    parent: 'Western'
                },
                {
                    id: 'Rotuma',
                    name: 'Rotuma',
                    value: 1594,
                    color: { patternIndex: 4 }
                }
            ]
        }
    ],
    title: {
        text: 'Fiji divisions and provinces by population 2017'
    },
    subtitle: {
        useHTMl: true,
        text:
      'Source:<a href="https://en.wikipedia.org/wiki/Local_government_in_Fiji">Wikipedia</a>'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}</b>: Population is <b>{point.value}</b>'
    }
});
