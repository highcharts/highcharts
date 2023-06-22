Highcharts.chart('container', {
    chart: {
        height: 600,
        inverted: true
    },

    title: {
        useHTML: true,
        text: 'Statistics Division of United Nations'
    },
    accessibility: {
        typeDescription:
      'The organizational chart displays hierarchically the different departments of the United Nations statistics division.'
    },
    series: [
        {
            type: 'organization',
            name: 'United Nations',
            keys: ['from', 'to'],
            data: [
                ['Director', 'SPDS'],
                ['Director', 'ESU'],
                ['Director', 'CDS'],
                ['Director', 'OTMS'],
                ['Director', 'ESB'],
                ['Director', 'DSSB'],
                ['Director', 'EESB'],
                ['Director', 'TSB'],
                ['Director', 'SSB'],
                ['ESB', 'NAS'],
                ['ESB', 'EEAS'],
                ['DSSB', 'DSS'],
                ['DSSB', 'SHSS'],
                ['EESB', 'ESS'],
                ['EESB', 'IESS'],
                ['TSB', 'IMTSS'],
                ['TSB', 'SITSS'],
                ['SSB', 'GDSU'],
                ['SSB', 'SDS'],
                ['SSB', 'SGCU']
            ],
            levels: [
                {
                    level: 0,
                    color: 'silver',
                    dataLabels: {
                        color: 'black'
                    },
                    height: 25
                },
                {
                    level: 1,
                    color: 'silver',
                    dataLabels: {
                        color: 'black'
                    },
                    height: 25
                },
                {
                    level: 2,
                    dataLabels: {
                        color: 'black'
                    },
                    height: 25
                },
                {
                    level: 4,
                    dataLabels: {
                        color: 'black'
                    },
                    height: 25
                }
            ],
            nodes: [
                {
                    id: 'Director',
                    title: null,
                    name: 'Director',
                    color: '#419dc0',
                    info: 'Director'
                },
                {
                    className: 'title',
                    id: 'ESU',
                    title: null,
                    name: 'Executive Support',
                    layout: 'hanging',
                    color: '#41c0a4',
                    info:
            'Planning and coordination of the overall Division’s work program and operation, <br/>including program management finance/budget management, <br/>human resources management, and general office administration'
                },
                {
                    id: 'SPDS',
                    title: null,
                    name: 'Stats Planning & Development',
                    image: null,
                    layout: 'hanging',
                    color: '#41c0a4',
                    info:
            'Methodological work on MDG indicators, databases; <br/>coordination of inter-agency groups for MDG global indicators, <br/>responsible for MDG global monitoring. <br/>Coordination of global gender statistics program'
                },
                {
                    id: 'CDS',
                    title: null,
                    name: 'Capacity Development',
                    layout: 'hanging',
                    color: '#41c0a4',
                    info:
            'Management and implementation of the Technical <br/>Co-operation and Statistical Capacity Building Program'
                },
                {
                    id: 'OTMS',
                    title: null,
                    name: 'Office & Tech Management',
                    layout: 'hanging',
                    color: '#41c0a4',
                    info:
            'Application of information technologies for the collection, <br>processing and dissemination of international statistics<br> and metadata by all branches of the Statistics Division'
                },
                {
                    id: 'ESB',
                    title: null,
                    name: 'Economics Stats',
                    column: 2,
                    layout: 'hanging',
                    color: '#abd734',
                    info: 'Economics Statistics Branch'
                },
                {
                    id: 'NAS',
                    title: null,
                    name: 'National Accounts',
                    layout: 'hanging',
                    color: '#beef3a',
                    info: 'National Accounts Section'
                },
                {
                    id: 'EEAS',
                    title: null,
                    name: 'Environmental Economic',
                    layout: 'hanging',
                    color: '#beef3a',
                    info: 'Environmental Economic Accounts Section'
                },
                {
                    id: 'DSSB',
                    name: 'Demographic & Social Stats',
                    column: 2,
                    layout: 'hanging',
                    color: '#34abd7',
                    info: 'Demographic and Social Statistics Branch'
                },
                {
                    id: 'DSS',
                    name: 'Demographic Stats',
                    layout: 'hanging',
                    color: '#3abeef',
                    info: 'Demographic Statistics Section'
                },
                {
                    id: 'SHSS',
                    name: 'Social & Housing Stats',
                    layout: 'hanging',
                    color: '#3abeef',
                    info: 'Social and Housing Statistics Section'
                },
                {
                    id: 'EESB',
                    name: 'Environment & Energy Stats',
                    column: 2,
                    layout: 'hanging',
                    color: '#d734ab',
                    info: 'Environment and Energy Statistics Branch'
                },
                {
                    id: 'ESS',
                    name: 'Environment Stats',
                    layout: 'hanging',
                    color: '#ef3abe',
                    info: 'Environment Statistics Section'
                },
                {
                    id: 'IESS',
                    name: 'Industrial & Energy Stats',
                    layout: 'hanging',
                    color: '#ef3abe',
                    info: 'Industrial and Energy Statistics Section'
                },
                {
                    id: 'TSB',
                    name: 'Trade Stats',
                    column: 2,
                    layout: 'hanging',
                    color: '#d76034',
                    info: 'Trade Statistics Branch'
                },
                {
                    id: 'IMTSS',
                    name: 'Merchandise Trade Stats',
                    layout: 'hanging',
                    color: '#ef6b3a',
                    info: 'International Merchandise Trade Statistics Section'
                },
                {
                    id: 'SITSS',
                    name: 'Stats of Trade',
                    layout: 'hanging',
                    color: '#ef6b3a',
                    info: 'Statistics of International Trade in Services Section'
                },
                {
                    id: 'SSB',
                    name: 'Stats Services',
                    column: 2,
                    layout: 'hanging',
                    color: '#d7b234',
                    info: 'Statistical Services Branch'
                },
                {
                    id: 'GDSU',
                    name: 'Global Data Services',
                    layout: 'hanging',
                    color: '#efc63a',
                    info: 'Global Data Services Unit'
                },
                {
                    id: 'SDS',
                    name: 'Stats Dissemination',
                    layout: 'hanging',
                    color: '#efc63a',
                    info: 'Statistical Dissemination Section'
                },
                {
                    id: 'SGCU',
                    name: 'Geographic Conferences',
                    layout: 'hanging',
                    color: '#efc63a',
                    info: 'Statistical and Geographic Conferences Unit'
                }
            ],
            colorByPoint: false,
            color: '#007ad0',
            dataLabels: {
                color: 'white'
            },
            borderColor: 'white',
            nodeWidth: 45,
            nodePadding: 2
        }
    ],

    tooltip: {
        outside: true,
        format: '{point.info}'
    },

    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
