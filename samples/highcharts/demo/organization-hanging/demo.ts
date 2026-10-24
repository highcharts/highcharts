const colors = Highcharts.getOptions().colors;

const leaves: Highcharts.SeriesSankeyNodesOptionsObject[] = [
    'Bastarnisch', 'Brabantian', 'Burgundian', 'Crimean Gothic', 'Danish',
    'Dutch', 'English', 'Faroese', 'Flemish', 'Frisian', 'Gepidisch', 'Gothic',
    'Herulisch', '(High) German', 'Hollandic', 'Icelandic', 'Limburgish',
    'Low German', 'Norwegian', 'Rhinelandic', 'Rugisch', 'Skirisch', 'Swedish',
    'Vandalic', 'Yiddish'
].map(id => ({ id, color: colors[0] }));

// Choose hanging nodes:
const hangingNodes: Highcharts.SeriesSankeyNodesOptionsObject[] = [
    {
        id: 'North Germanic',
        layout: 'hanging',
        // Push node a bit to the left.
        offsetHorizontal: -15
    },
    {
        id: 'West Germanic',
        layout: 'hanging'
    },
    {
        id: 'East Germanic',
        layout: 'hanging'
    }
];

const nodes = hangingNodes.concat(leaves);

Highcharts.chart('container', {

    chart: {
        height: 1200,
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

    tooltip: {
        outside: true
    },

    series: [{
        name: 'Germanic language tree',
        type: 'organization',
        nodeWidth: 40,
        nodePadding: 20,
        colorByPoint: false,
        hangingIndentTranslation: 'cumulative',
        // Crimp a bit to avoid nodes overlapping lines
        hangingIndent: 10,

        levels: [{
            level: 0,
            color: '#dedede'
        }, {
            level: 1,
            color: '#dedede'
        }, {
            level: 2,
            color: colors[3]
        }, {
            level: 3,
            color: colors[2]
        }, {
            level: 4,
            color: colors[8]
        }],
        nodes,
        /* eslint-disable indent */
        data: [
            // West Germanic branch
            { from: 'Germanic', to: 'West Germanic' },
                { from: 'West Germanic', to: 'Old English' },
                    { from: 'Old English', to: 'Middle English' },
                        { from: 'Middle English', to: 'English' },
                { from: 'West Germanic', to: 'Old Frisian' },
                    { from: 'Old Frisian', to: 'Frisian' },
                { from: 'West Germanic', to: 'Old Dutch' },
                    { from: 'Old Dutch', to: 'Middle Dutch' },
                        { from: 'Middle Dutch', to: 'Hollandic' },
                        { from: 'Middle Dutch', to: 'Flemish' },
                        { from: 'Middle Dutch', to: 'Dutch' },
                        { from: 'Middle Dutch', to: 'Limburgish' },
                        { from: 'Middle Dutch', to: 'Brabantian' },
                        { from: 'Middle Dutch', to: 'Rhinelandic' },
                { from: 'West Germanic', to: 'Old Low German' },
                    { from: 'Old Low German', to: 'Middle Low German' },
                        { from: 'Middle Low German', to: 'Low German' },
                { from: 'West Germanic', to: 'Old High German' },
                    { from: 'Old High German', to: 'Middle High German' },
                        { from: 'Middle High German', to: '(High) German' },
                        { from: 'Middle High German', to: 'Yiddish' },

            // East Germanic branch
            { from: 'Germanic', to: 'East Germanic' },
                { from: 'East Germanic', to: 'Gothic' },
                { from: 'East Germanic', to: 'Vandalic' },
                { from: 'East Germanic', to: 'Burgundian' },
                { from: 'East Germanic', to: 'Bastarnisch' },
                { from: 'East Germanic', to: 'Gepidisch' },
                { from: 'East Germanic', to: 'Herulisch' },
                { from: 'East Germanic', to: 'Rugisch' },
                { from: 'East Germanic', to: 'Skirisch' },
                { from: 'East Germanic', to: 'Crimean Gothic' },

            // North Germanic branch
            { from: 'Germanic', to: 'North Germanic' },
                { from: 'North Germanic', to: 'Old Norse' },
                    { from: 'Old Norse', to: 'Old Icelandic' },
                        { from: 'Old Icelandic', to: 'Icelandic' },
                    { from: 'Old Norse', to: 'Old Norwegian' },
                        { from: 'Old Norwegian', to: 'Norwegian' },
                    { from: 'Old Norse', to: 'Faroese' },
                { from: 'North Germanic', to: 'Old Swedish' },
                    { from: 'Old Swedish', to: 'Middle Swedish' },
                        { from: 'Middle Swedish', to: 'Swedish' },
                { from: 'North Germanic', to: 'Old Danish' },
                    { from: 'Old Danish', to: 'Middle Danish' },
                        { from: 'Middle Danish', to: 'Danish' }
        ]
        /* eslint-enable indent */
    }]
} satisfies Highcharts.Options);
