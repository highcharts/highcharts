const leafs = [
    'Icelandic', 'Norwegian', 'Faroese', 'Swedish', 'Danish',
    'English', 'Hollandic', 'Flemish', 'Dutch', 'Limburgish', 'Brabantian',
    'Rhinelandic', 'Gothic'
].map(function (leaf) {
    return {
        id: leaf,
        color: Highcharts.getOptions().colors[0],
        dataLabels: {
            color: '#000000'
        }
    };
});

// Choose hanging nodes:
const hangingNodes = [
    {
        id: 'North Germanic',
        layout: 'hanging'
    },
    {
        id: 'West Germanic',
        layout: 'hanging',
        // Slight overlap, push node a bit to the right.
        offsetHorizontal: 15
    },
    {
        id: 'East Germanic',
        layout: 'hanging'
    }
];

const nodes = hangingNodes.concat(leafs);

Highcharts.chart('container', {

    chart: {
        height: 800,
        inverted: true
    },

    title: {
        text: 'The Germanic Language Tree'
    },

    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. {toNode.id}' +
                'comes from {fromNode.id}'
        }
    },

    series: [{
        type: 'organization',
        keys: ['from', 'to'],
        nodeWidth: 40,
        nodePadding: 20,
        colorByPoint: false,
        hangingIndentTranslation: 'cumulative',

        levels: [{
            level: 0,
            color: '#dedede'
        }, {
            level: 1,
            color: '#dedede'
        }, {
            level: 2,
            color: Highcharts.getOptions().colors[3]
        }, {
            level: 3,
            color: Highcharts.getOptions().colors[2]
        }, {
            level: 4,
            color: Highcharts.getOptions().colors[8]
        }],
        nodes,
        data: [
            // North Germanic branch
            ['Germanic', 'North Germanic'],
            ['North Germanic', 'Old Norse'],
            ['North Germanic', 'Old Swedish'],
            ['North Germanic', 'Old Danish'],
            ['Old Norse', 'Old Icelandic'],
            ['Old Norse', 'Old Norwegian'],
            ['Old Norse', 'Faroese'],
            ['Old Swedish', 'Middle Swedish'],
            ['Old Danish', 'Middle Danish'],
            ['Old Icelandic', 'Icelandic'],
            ['Old Norwegian', 'Middle Norwegian'],
            ['Middle Swedish', 'Swedish'],
            ['Middle Danish', 'Danish'],
            ['Middle Norwegian', 'Norwegian'],

            // West Germanic branch
            ['Germanic', 'West Germanic'],
            ['West Germanic', 'Old English'],
            ['West Germanic', 'Old Dutch'],
            ['Old English', 'Middle English'],
            ['Old Dutch', 'Middle Dutch'],
            ['Middle English', 'English'],
            ['Middle Dutch', 'Hollandic'],
            ['Middle Dutch', 'Flemish'],
            ['Middle Dutch', 'Dutch'],
            ['Middle Dutch', 'Limburgish'],
            ['Middle Dutch', 'Brabantian'],
            ['Middle Dutch', 'Rhinelandic'],

            // East Germanic branch
            ['Germanic', 'East Germanic'],
            ['East Germanic', 'Gothic']
        ]
    }]
});