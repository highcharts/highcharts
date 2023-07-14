Highcharts.chart('container', {
    chart: {
        spacingBottom: 30,
        marginRight: 120
    },
    title: {
        text: 'Phylogenetic language tree'
    },
    series: [
        {
            type: 'treegraph',
            keys: ['parent', 'id', 'level'],
            clip: false,
            data: [
                [undefined, 'Proto Indo-European'],
                ['Proto Indo-European', 'Balto-Slavic'],
                ['Proto Indo-European', 'Germanic'],
                ['Proto Indo-European', 'Celtic'],
                ['Proto Indo-European', 'Italic'],
                ['Proto Indo-European', 'Hellenic'],
                ['Proto Indo-European', 'Anatolian'],
                ['Proto Indo-European', 'Indo-Iranian'],
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
                ['West Germanic', 'Old Frisian'],
                ['West Germanic', 'Old Dutch'],
                ['West Germanic', 'Old Low German'],
                ['West Germanic', 'Old High German'],
                ['Old Norse', 'Old Icelandic'],
                ['Old Norse', 'Old Norwegian'],
                ['Old Swedish', 'Middle Swedish'],
                ['Old Danish', 'Middle Danish'],
                ['Old English', 'Middle English'],
                ['Old Dutch', 'Middle Dutch'],
                ['Old Low German', 'Middle Low German'],
                ['Old High German', 'Middle High German'],
                ['Balto-Slavic', 'Baltic'],
                ['Balto-Slavic', 'Slavic'],
                ['Slavic', 'East Slavic'],
                ['Slavic', 'West Slavic'],
                ['Slavic', 'South Slavic'],
                // Leaves:
                ['Proto Indo-European', 'Phrygian', 6],
                ['Proto Indo-European', 'Armenian', 6],
                ['Proto Indo-European', 'Albanian', 6],
                ['Proto Indo-European', 'Thracian', 6],
                ['Tocharian', 'Tocharian A', 6],
                ['Tocharian', 'Tocharian B', 6],
                ['Anatolian', 'Hittite', 6],
                ['Anatolian', 'Palaic', 6],
                ['Anatolian', 'Luwic', 6],
                ['Anatolian', 'Lydian', 6],
                ['Iranian', 'Balochi', 6],
                ['Iranian', 'Kurdish', 6],
                ['Iranian', 'Pashto', 6],
                ['Iranian', 'Sogdian', 6],
                ['Old Persian', 'Pahlavi', 6],
                ['Middle Persian', 'Persian', 6],
                ['Hellenic', 'Greek', 6],
                ['Dardic', 'Dard', 6],
                ['Sanskrit', 'Sindhi', 6],
                ['Sanskrit', 'Romani', 6],
                ['Sanskrit', 'Urdu', 6],
                ['Sanskrit', 'Hindi', 6],
                ['Sanskrit', 'Bihari', 6],
                ['Sanskrit', 'Assamese', 6],
                ['Sanskrit', 'Bengali', 6],
                ['Sanskrit', 'Marathi', 6],
                ['Sanskrit', 'Gujarati', 6],
                ['Sanskrit', 'Punjabi', 6],
                ['Sanskrit', 'Sinhalese', 6],
                ['Osco-Umbrian', 'Umbrian', 6],
                ['Osco-Umbrian', 'Oscan', 6],
                ['Latino-Faliscan', 'Faliscan', 6],
                ['Latin', 'Portugese', 6],
                ['Latin', 'Spanish', 6],
                ['Latin', 'French', 6],
                ['Latin', 'Romanian', 6],
                ['Latin', 'Italian', 6],
                ['Latin', 'Catalan', 6],
                ['Latin', 'Franco-Provençal', 6],
                ['Latin', 'Rhaeto-Romance', 6],
                ['Brythonic', 'Welsh', 6],
                ['Brythonic', 'Breton', 6],
                ['Brythonic', 'Cornish', 6],
                ['Brythonic', 'Cuymbric', 6],
                ['Goidelic', 'Modern Irish', 6],
                ['Goidelic', 'Scottish Gaelic', 6],
                ['Goidelic', 'Manx', 6],
                ['East Germanic', 'Gothic', 6],
                ['Middle Low German', 'Low German', 6],
                ['Middle High German', '(High) German', 6],
                ['Middle High German', 'Yiddish', 6],
                ['Middle English', 'English', 6],
                ['Middle Dutch', 'Hollandic', 6],
                ['Middle Dutch', 'Flemish', 6],
                ['Middle Dutch', 'Dutch', 6],
                ['Middle Dutch', 'Limburgish', 6],
                ['Middle Dutch', 'Brabantian', 6],
                ['Middle Dutch', 'Rhinelandic', 6],
                ['Old Frisian', 'Frisian', 6],
                ['Middle Danish', 'Danish', 6],
                ['Middle Swedish', 'Swedish', 6],
                ['Old Norwegian', 'Norwegian', 6],
                ['Old Norse', 'Faroese', 6],
                ['Old Icelandic', 'Icelandic', 6],
                ['Baltic', 'Old Prussian', 6],
                ['Baltic', 'Lithuanian', 6],
                ['Baltic', 'Latvian', 6],
                ['West Slavic', 'Polish', 6],
                ['West Slavic', 'Slovak', 6],
                ['West Slavic', 'Czech', 6],
                ['West Slavic', 'Wendish', 6],
                ['East Slavic', 'Bulgarian', 6],
                ['East Slavic', 'Old Church Slavonic', 6],
                ['East Slavic', 'Macedonian', 6],
                ['East Slavic', 'Serbo-Croatian', 6],
                ['East Slavic', 'Slovene', 6],
                ['South Slavic', 'Russian', 6],
                ['South Slavic', 'Ukrainian', 6],
                ['South Slavic', 'Belarusian', 6],
                ['South Slavic', 'Rusyn', 6]
            ],
            marker: {
                symbol: 'circle',
                radius: 6,
                fillColor: '#ffffff',
                lineWidth: 3
            },
            dataLabels: {
                align: 'left',
                pointFormat: '{point.id}',
                style: {
                    color: '#000000',
                    textOutline: '3px #ffffff',
                    whiteSpace: 'nowrap'
                },
                x: 24,
                crop: false,
                overflow: 'none'
            },
            levels: [
                {
                    level: 1,
                    levelIsConstant: false
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
                },
                {
                    level: 6,
                    dataLabels: {
                        x: 10
                    },
                    marker: {
                        radius: 4
                    }
                }
            ]
        }
    ]
});
