let leafs = [
    'Tocharian A', 'Tocharian B', 'Hittite', 'Palaic', 'Luwic', 'Lydian',
    'Balochi', 'Kurdish', 'Pashto', 'Sogdian', 'Pahlavi', 'Persian', 'Greek',
    'Dard', 'Sindhi', 'Romani', 'Urdu', 'Hindi', 'Bihari', 'Assamese',
    'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Sinhalese', 'Umbrian',
    'Oscan', 'Faliscan', 'Portugese', 'Spanish', 'French', 'Romanian',
    'Italian', 'Catalan', 'Franco-Provençal', 'Rhaeto-Romance', 'Welsh',
    'Breton', 'Cornish', 'Cuymbric', 'Modern Irish', 'Scottish Gaelic',
    'Manx', 'Gothic', 'English', 'Hollandic', 'Flemish', 'Dutch', 'Limburgish',
    'Brabantian', 'Rhinelandic', 'Danish', 'Swedish', 'Norwegian', 'Faroese',
    'Icelandic', 'Old Prussian', 'Lithuanian', 'Latvian', 'Polish', 'Slovak',
    'Czech', 'Wendish', 'Bulgarian', 'Old Church Slavonic', 'Macedonian',
    'Serbo-Croatian', 'Slovene', 'Russian', 'Ukrainian', 'Belarusian', 'Rusyn'
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
    id: 'Balto-Slavic',
    layout: 'hanging'
}, {
    id: 'Germanic',
    layout: 'hanging'
}, {
    id: 'Celtic',
    layout: 'hanging'
}, {
    id: 'Italic',
    layout: 'hanging'
}, {
    id: 'Hellenic',
    layout: 'hanging'
}, {
    id: 'Anatolian',
    layout: 'hanging'
}, {
    id: 'Indo-Iranian',
    layout: 'hanging'
}, {
    id: 'Tocharian',
    layout: 'hanging'
}];

const nodes = hangingNodes
    .concat(leafs)
    .concat(
        [{
            id: 'Proto Indo-European',
            dataLabels: {
                useHTML: false,
                style: {
                    fontSize: '15px'
                }
            }
        }]
    );

Highcharts.chart('container', {

    chart: {
        height: 1500,
        inverted: true
    },

    title: {
        text: 'The Indo-European Language Tree'
    },

    series: [{
        type: 'organization',
        keys: ['from', 'to'],
        nodeWidth: 40,

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
        }, {
            level: 5,
            color: Highcharts.getOptions().colors[4]
        }],

        colorByPoint: false,
        hangingIndentTranslation: 'cumulative',
        nodes,
        data: [
            ['Proto Indo-European', 'Balto-Slavic'],
            ['Proto Indo-European', 'Phrygian'],
            ['Proto Indo-European', 'Germanic'],
            ['Proto Indo-European', 'Armenian'],
            ['Proto Indo-European', 'Celtic'],
            ['Proto Indo-European', 'Albanian'],
            ['Proto Indo-European', 'Italic'],
            ['Proto Indo-European', 'Hellenic'],
            ['Proto Indo-European', 'Anatolian'],
            ['Proto Indo-European', 'Indo-Iranian'],
            ['Proto Indo-European', 'Thracian'],
            ['Proto Indo-European', 'Tocharian'],
            ['Indo-Iranian', 'Dardic'],
            ['Indo-Iranian', 'Indic'],
            ['Indo-Iranian', 'Iranian'],
            ['Iranian', 'Old Persian'],
            ['Old Persian', 'Middle Persian'],
            ['Indic', 'Sanskrit'],
            ['Italic', 'Osco-Umbrian'],
            ['Italic', 'Latino-Faliscan'],
            ['Latino-Faliscan', 'Latin'],
            ['Celtic', 'Brythonic'],
            ['Celtic', 'Goidelic'],
            ['Germanic', 'North Germanic'],
            ['Germanic', 'West Germanic'],
            ['Germanic', 'East Germanic'],
            ['North Germanic', 'Old Norse'],
            ['North Germanic', 'Old Swedish'],
            ['North Germanic', 'Old Danish'],
            ['West Germanic', 'Old English'],
            ['West Germanic', 'Old Dutch'],
            ['Old Norse', 'Old Icelandic'],
            ['Old Norse', 'Old Norwegian'],
            ['Old Norwegian', 'Middle Norwegian'],
            ['Old Swedish', 'Middle Swedish'],
            ['Old Danish', 'Middle Danish'],
            ['Old English', 'Middle English'],
            ['Old Dutch', 'Middle Dutch'],
            ['Balto-Slavic', 'Baltic'],
            ['Balto-Slavic', 'Slavic'],
            ['Slavic', 'East Slavic'],
            ['Slavic', 'West Slavic'],
            ['Slavic', 'South Slavic'],

            ['Tocharian', 'Tocharian A'],
            ['Tocharian', 'Tocharian B'],
            ['Anatolian', 'Hittite'],
            ['Anatolian', 'Palaic'],
            ['Anatolian', 'Luwic'],
            ['Anatolian', 'Lydian'],
            ['Iranian', 'Balochi'],
            ['Iranian', 'Kurdish'],
            ['Iranian', 'Pashto'],
            ['Iranian', 'Sogdian'],
            ['Old Persian', 'Pahlavi'],
            ['Middle Persian', 'Persian'],
            ['Hellenic', 'Greek'],
            ['Dardic', 'Dard'],
            ['Sanskrit', 'Sindhi'],
            ['Sanskrit', 'Romani'],
            ['Sanskrit', 'Urdu'],
            ['Sanskrit', 'Hindi'],
            ['Sanskrit', 'Bihari'],
            ['Sanskrit', 'Assamese'],
            ['Sanskrit', 'Bengali'],
            ['Sanskrit', 'Marathi'],
            ['Sanskrit', 'Gujarati'],
            ['Sanskrit', 'Punjabi'],
            ['Sanskrit', 'Sinhalese'],
            ['Osco-Umbrian', 'Umbrian'],
            ['Osco-Umbrian', 'Oscan'],
            ['Latino-Faliscan', 'Faliscan'],
            ['Latin', 'Portugese'],
            ['Latin', 'Spanish'],
            ['Latin', 'French'],
            ['Latin', 'Romanian'],
            ['Latin', 'Italian'],
            ['Latin', 'Catalan'],
            ['Latin', 'Franco-Provençal'],
            ['Latin', 'Rhaeto-Romance'],
            ['Brythonic', 'Welsh'],
            ['Brythonic', 'Breton'],
            ['Brythonic', 'Cornish'],
            ['Brythonic', 'Cuymbric'],
            ['Goidelic', 'Modern Irish'],
            ['Goidelic', 'Scottish Gaelic'],
            ['Goidelic', 'Manx'],
            ['East Germanic', 'Gothic'],
            ['Middle English', 'English'],
            ['Middle Dutch', 'Hollandic'],
            ['Middle Dutch', 'Flemish'],
            ['Middle Dutch', 'Dutch'],
            ['Middle Dutch', 'Limburgish'],
            ['Middle Dutch', 'Brabantian'],
            ['Middle Dutch', 'Rhinelandic'],
            ['Middle Danish', 'Danish'],
            ['Middle Swedish', 'Swedish'],
            ['Middle Norwegian', 'Norwegian'],
            ['Old Norse', 'Faroese'],
            ['Old Icelandic', 'Icelandic'],
            ['Baltic', 'Old Prussian'],
            ['Baltic', 'Lithuanian'],
            ['Baltic', 'Latvian'],
            ['West Slavic', 'Polish'],
            ['West Slavic', 'Slovak'],
            ['West Slavic', 'Czech'],
            ['West Slavic', 'Wendish'],
            ['East Slavic', 'Bulgarian'],
            ['East Slavic', 'Old Church Slavonic'],
            ['East Slavic', 'Macedonian'],
            ['East Slavic', 'Serbo-Croatian'],
            ['East Slavic', 'Slovene'],
            ['South Slavic', 'Russian'],
            ['South Slavic', 'Ukrainian'],
            ['South Slavic', 'Belarusian'],
            ['South Slavic', 'Rusyn']
        ]
    }]
});