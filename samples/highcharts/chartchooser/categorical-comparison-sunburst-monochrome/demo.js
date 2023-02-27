const data = [
    {
        id: '1',
        name: 'America',
        color: '#efefef'
    },
    {
        id: '2',
        name: 'Asia',
        color: '#b0b0b0'
    },
    {
        id: '3',
        name: 'Europe',
        color: '#7b7b7b'
    },
    {
        id: '4',
        color: '#000000',
        name: 'OTH'
    },

    /* America */
    {
        parent: '1',
        name: 'US',
        value: 151,
        color: '#ffffff'
    },
    {
        parent: '1',
        name: 'CA',
        color: '#ffffff',
        value: 8
    },
    {
        parent: '1',
        name: 'BR',
        color: '#ffffff',
        value: 1
    },
    /* Asia */
    {
        parent: '2',
        name: 'RU',
        color: '#e3e3e3',
        value: 49
    },
    {
        parent: '2',
        name: 'JP',
        color: '#d2d2d2',
        value: 9
    },
    {
        parent: '2',
        name: 'OTH',
        color: '#c1c1c1',
        value: 3
    },
    /* Europe */
    {
        parent: '3',
        name: 'IT',
        color: '#aeaeae',
        value: 5
    },
    {
        parent: '3',
        name: 'FR',
        color: '#a1a1a1',
        value: 4
    },
    {
        parent: '3',
        name: 'UK',
        color: '#949494',
        value: 3
    },
    {
        parent: '3',
        name: 'OTH',
        color: '#878787',
        value: 6
    },
    /* Other */
    {
        parent: '4',
        name: 'OTH',
        color: '#333333',
        value: 2
    }
];

Highcharts.chart('container', {
    title: {
        text: 'Visitors to the International Space Station by Country'
    },

    subtitle: {
        text: 'Source: <a href=\'https://www.nasa.gov/feature/visitors-to-the-station-by-country/\'>NASA</a>'
    },
    accessibility: {
        typeDescription:
      'Sunburst chart with 2 levels. The inner level represents continents, and the outer level represents the countries within the continents.',
        point: {
            valueSuffix: ' visitors'
        }
    },
    series: [
        {
            type: 'sunburst',
            name: 'Total',
            data: data,
            borderWidth: 1.5,
            borderColor: '#000000',
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {
                format: '{point.name}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            },
            levels: [
                {
                    level: 1,
                    levelIsConstant: false,
                    dataLabels: {
                        filter: {
                            property: 'outerArcLength',
                            operator: '>',
                            value: 64
                        }
                    }
                },
                {
                    level: 2,
                    colorByPoint: true
                }
            ]
        }
    ],

    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b>: <b>{point.value}</b> visitors'
    }
});
