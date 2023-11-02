const data = [
    {
        id: '0',
        parent: '',
        name: ' ',
        color: '#FFFFFF'
    },
    {
        id: 'R',
        parent: '0',
        name: 'Rural',
        color: '#ecb37c'
    },
    {
        id: 'U',
        parent: '0',
        name: 'Urban',
        color: '#7CB5EC'
    },
    {
        id: 'RV',
        name: 'Vehicles',
        parent: 'R'
    },
    {
        id: 'RO',
        name: 'Others',
        parent: 'R',
        color: '#FFFFFF'
    },
    {
        id: 'UV',
        name: 'Vehicles',
        parent: 'U'
    },
    {
        id: 'UO',
        name: 'Others',
        parent: 'U'
    },
    {
        name: 'Cars and minivans',
        parent: 'RV',
        value: 6767
    },
    {
        name: 'Pickups',
        parent: 'RV',
        value: 2965
    },
    {
        name: 'SUVs',
        parent: 'RV',
        value: 2973
    },
    {
        name: 'Large trucks',
        parent: 'RV',
        value: 501
    },
    {
        name: 'Motorcycles',
        parent: 'RV',
        value: 1986
    },
    {
        name: 'Pedestrians',
        parent: 'RO',
        value: 1141
    },
    {
        name: 'Bicyclists',
        parent: 'RO',
        value: 187
    },
    {
        name: 'Cars and minivans',
        parent: 'UV',
        value: 6727
    },
    {
        name: 'Pickups',
        parent: 'UV',
        value: 1367
    },
    {
        name: 'SUVs',
        parent: 'UV',
        value: 2114
    },
    {
        name: 'Large trucks',
        parent: 'UV',
        value: 173
    },
    {
        name: 'Motorcycles',
        parent: 'UV',
        value: 3025
    },
    {
        name: 'Pedestrians',
        parent: 'UO',
        value: 4642
    },
    {
        name: 'Bicyclists',
        parent: 'UO',
        value: 554
    }
];

Highcharts.setOptions({
    colors: ['#ecb37c', '#ECE100']
});
Highcharts.chart('container', {
    chart: {
        height: '100%'
    },

    title: {
        text: 'Urban vs rural road fatalities in 2017'
    },
    subtitle: {
        text:
      'Source: <a href="https://www.iihs.org/topics/fatality-statistics/detail/urban-rural-comparison">Insurance Institute for Highway Safety </a>'
    },
    series: [
        {
            type: 'sunburst',
            data: data,
            allowDrillToNode: true,
            cursor: 'pointer',
            borderWidth: 3,
            borderColor: '#000000',
            dataLabels: {
                format: '{point.name}',
                filter: {
                    property: 'innerArcLength',
                    operator: '>',
                    value: 16
                },
                style: {
                    textOutline: false,
                    color: '#000000'
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
                },
                {
                    level: 3,
                    colorVariation: {
                        key: 'brightness',
                        to: -0.5
                    }
                },
                {
                    level: 4,
                    colorVariation: {
                        key: 'brightness',
                        to: 0.5
                    }
                }
            ]
        }
    ],
    tooltip: {
        headerFormat: '',
        pointFormat: 'The population of <b>{point.name}</b> is <b>{point.value}</b>'
    }
});
