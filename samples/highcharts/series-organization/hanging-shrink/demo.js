let leafs = [
    'Gothic', 'Burgundian', 'Vandalic', 'Gutnish', 'Danish', 'Swedish',
    'Norwegian', 'Faroese', 'Icelandic', 'Elfdalian', 'Dutch', 'Afrikaans',
    'Limburgish', 'West Low German', 'East Low German', 'Plautdietsch',
    'English', 'Scots', 'Saterland Frisian', 'East Central German',
    'Pennsylvania German', 'Luxembourgish', 'Elemannic German',
    'Mòcheno language', 'Cimbrian language', 'Hutterite German', 'Wymysorys',
    'Yiddish', 'Hunsrik', 'High Franconian'
];

// Set color for leafs
leafs = leafs.map(function (leaf) {
    return {
        id: leaf,
        color: Highcharts.getOptions().colors[0],
        dataLabels: {
            color: '#000000'
        }
    };
});

// Choose hanging nodes:
const hangingNodes = [{
    id: 'North Germanic',
    layout: 'hanging'
}, {
    id: 'West Germanic',
    layout: 'hanging'
}, {
    id: 'East Germanic',
    layout: 'hanging'
}];

Highcharts.chart('container', {

    chart: {
        height: 1500,
        inverted: true
    },

    title: {
        text: 'The Germanic Language Tree'
    },

    series: [{
        name: 'The Germanic Language Tree',
        type: 'organization',
        keys: ['from', 'to'],
        nodeWidth: 33,

        levels: [{
            level: 0,
            color: '#dedede',
            height: 25
        }, {
            level: 1,
            color: '#dedede',
            height: 25
        }, {
            level: 2,
            color: Highcharts.getOptions().colors[1],
            dataLabels: {
                color: 'white'
            }
        }, {
            level: 3,
            color: Highcharts.getOptions().colors[2]
        }, {
            level: 4,
            color: Highcharts.getOptions().colors[3]
        }],

        colorByPoint: false,
        hangingIndentTranslation: 'shrink',
        nodes: hangingNodes.concat(leafs),
        data: [
            ['Proto-Germanic', 'North Germanic'],
            ['Proto-Germanic', 'West Germanic'],
            ['Proto-Germanic', 'East Germanic'],

            ['North Germanic', 'West Scandinavian'],
            ['North Germanic', 'East Scandinavian'],

            ['West Germanic', 'Low German'],
            ['West Germanic', 'High German'],
            ['West Germanic', 'Low Franconian'],
            ['West Germanic', 'Anglo-Frisian'],

            ['Anglo-Frisian', 'Anglic'],
            ['Anglo-Frisian', 'Frisian'],

            ['Frisian', 'East Frisian'],

            ['High German', 'Upper German'],
            ['High German', 'Central German'],

            ['Upper German', 'Austro-Bavarian German'],

            ['Central German', 'West Central German'],

            // Leafs:
            ['East Germanic', 'Gothic'],
            ['East Germanic', 'Burgundian'],
            ['East Germanic', 'Vandalic'],

            ['North Germanic', 'Gutnish'],

            ['East Scandinavian', 'Danish'],
            ['East Scandinavian', 'Swedish'],

            ['West Scandinavian', 'Norwegian'],
            ['West Scandinavian', 'Faroese'],
            ['West Scandinavian', 'Icelandic'],
            ['West Scandinavian', 'Elfdalian'],

            ['Low Franconian', 'Dutch'],
            ['Low Franconian', 'Afrikaans'],
            ['Low Franconian', 'Limburgish'],
            ['Low German', 'West Low German'],

            ['Low German', 'East Low German'],
            ['Low German', 'Plautdietsch'],

            ['Anglic', 'English'],
            ['Anglic', 'Scots'],

            ['East Frisian', 'Saterland Frisian'],

            ['Central German', 'East Central German'],

            ['West Central German', 'Pennsylvania German'],
            ['West Central German', 'Luxembourgish'],

            ['Upper German', 'Elemannic German'],
            ['Austro-Bavarian German', 'Mòcheno language'],
            ['Austro-Bavarian German', 'Cimbrian language'],
            ['Austro-Bavarian German', 'Hutterite German'],

            ['High German', 'Wymysorys'],
            ['High German', 'Yiddish'],
            ['High German', 'Hunsrik'],
            ['High German', 'High Franconian']
        ]
    }],
    tooltip: {
        outside: true
    }
});
