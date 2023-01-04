const data = [
    {
        id: '1',
        name: 'America',
        color: '#f15c80'
    },
    {
        id: '2',
        name: 'Asia',
        color: '#7cb5ec'
    },
    {
        id: '3',
        name: 'Europe',
        color: '#90ed7d'
    },
    {
        id: '4',
        color: '#f7a35c',
        name: 'OTH'
    },
    /* America */
    {
        parent: '1',
        name: 'US',
        value: 151,
        color: '#ff8fb3'
    },
    {
        parent: '1',
        name: 'CA',
        color: '#ff7ea2',
        value: 8
    },
    {
        parent: '1',
        name: 'BR',
        color: '#ff6d91',
        value: 1
    },
    /* Asia */
    {
        parent: '2',
        name: 'RU',
        color: '#afe8ff',
        value: 49
    },
    {
        parent: '2',
        name: 'JP',
        color: '#9ed7ff',
        value: 9
    },
    {
        parent: '2',
        name: 'OTH',
        color: '#8dc6fd',
        value: 3
    },
    /* Europe */
    {
        parent: '3',
        name: 'IT',
        color: '#c3ffb0',
        value: 5
    },
    {
        parent: '3',
        name: 'FR',
        color: '#b6ffa3',
        value: 4
    },
    {
        parent: '3',
        name: 'UK',
        color: '#a9ff96',
        value: 3
    },
    {
        parent: '3',
        name: 'OTH',
        color: '#9cf989',
        value: 6
    },
    /* Other */
    {
        parent: '4',
        name: 'OTH',
        color: '#ffd68f',
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
