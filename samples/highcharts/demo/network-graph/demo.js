var start = +new Date();

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1,
        events: {
            load: function () {
                this.setTitle({
                    text: 'Rendered in: ' + (+new Date() - start) + 'ms'
                });
            }
        }
    },
    title: {
        text: 'Networkgraph'
    },
    subtitle: {
        text: 'animated'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to', 'weight']
        }
    },
    series: [{
        // Multiple series?
    /*    dataLabels: {
            enabled: false
        },
        data: [
            ["Napoleon","Myriel",1],["Mlle.Baptistine","Myriel",1],["Mme.Magloire","Myriel",1],["Mme.Magloire","Mlle.Baptistine",1],["CountessdeLo","Myriel",1],["Geborand","Myriel",1],["Champtercier","Myriel",1],["Cravatte","Myriel",1],["Count","Myriel",1],["OldMan","Myriel",1],["Valjean","Labarre",1],["Valjean","Mme.Magloire",1],["Valjean","Mlle.Baptistine",1],["Valjean","Myriel",1],["Marguerite","Valjean",1],["Mme.deR","Valjean",1],["Isabeau","Valjean",1],["Gervais","Valjean",1],["Listolier","Tholomyes",1],["Fameuil","Tholomyes",1],["Fameuil","Listolier",1],["Blacheville","Tholomyes",1],["Blacheville","Listolier",1],["Blacheville","Fameuil",1],["Favourite","Tholomyes",1],["Favourite","Listolier",1],["Favourite","Fameuil",1],["Favourite","Blacheville",1],["Dahlia","Tholomyes",1],["Dahlia","Listolier",1],["Dahlia","Fameuil",1],["Dahlia","Blacheville",1],["Dahlia","Favourite",1],["Zephine","Tholomyes",1],["Zephine","Listolier",1],["Zephine","Fameuil",1],["Zephine","Blacheville",1],["Zephine","Favourite",1],["Zephine","Dahlia",1],["Fantine","Tholomyes",1],["Fantine","Listolier",1],["Fantine","Fameuil",1],["Fantine","Blacheville",1],["Fantine","Favourite",1],["Fantine","Dahlia",1],["Fantine","Zephine",1],["Fantine","Marguerite",1],["Fantine","Valjean",1],["Mme.Thenardier","Fantine",1],["Mme.Thenardier","Valjean",1],["Thenardier","Mme.Thenardier",1],["Thenardier","Fantine",1],["Thenardier","Valjean",1],["Cosette","Mme.Thenardier",1],["Cosette","Valjean",1],["Cosette","Tholomyes",1],["Cosette","Thenardier",1],["Javert","Valjean",1],["Javert","Fantine",1],["Javert","Thenardier",1],["Javert","Mme.Thenardier",1],["Javert","Cosette",1],["Fauchelevent","Valjean",1],["Fauchelevent","Javert",1],["Bamatabois","Fantine",1],["Bamatabois","Javert",1],["Bamatabois","Valjean",1],["Perpetue","Fantine",1],["Simplice","Perpetue",1],["Simplice","Valjean",1],["Simplice","Fantine",1],["Simplice","Javert",1],["Scaufflaire","Valjean",1],["Woman1","Valjean",1],["Woman1","Javert",1],["Judge","Valjean",1],["Judge","Bamatabois",1],["Champmathieu","Valjean",1],["Champmathieu","Judge",1],["Champmathieu","Bamatabois",1],["Brevet","Judge",1],["Brevet","Champmathieu",1],["Brevet","Valjean",1],["Brevet","Bamatabois",1],["Chenildieu","Judge",1],["Chenildieu","Champmathieu",1],["Chenildieu","Brevet",1],["Chenildieu","Valjean",1],["Chenildieu","Bamatabois",1],["Cochepaille","Judge",1],["Cochepaille","Champmathieu",1],["Cochepaille","Brevet",1],["Cochepaille","Chenildieu",1],["Cochepaille","Valjean",1],["Cochepaille","Bamatabois",1],["Pontmercy","Thenardier",1],["Boulatruelle","Thenardier",1],["Eponine","Mme.Thenardier",1],["Eponine","Thenardier",1],["Anzelma","Eponine",1],["Anzelma","Thenardier",1],["Anzelma","Mme.Thenardier",1],["Woman2","Valjean",1],["Woman2","Cosette",1],["Woman2","Javert",1],["MotherInnocent","Fauchelevent",1],["MotherInnocent","Valjean",1],["Gribier","Fauchelevent",1],["Mme.Burgon","Jondrette",1],["Gavroche","Mme.Burgon",1],["Gavroche","Thenardier",1],["Gavroche","Javert",1],["Gavroche","Valjean",1],["Gillenormand","Cosette",1],["Gillenormand","Valjean",1],["Magnon","Gillenormand",1],["Magnon","Mme.Thenardier",1],["Mlle.Gillenormand","Gillenormand",1],["Mlle.Gillenormand","Cosette",1],["Mlle.Gillenormand","Valjean",1],["Mme.Pontmercy","Mlle.Gillenormand",1],["Mme.Pontmercy","Pontmercy",1],["Mlle.Vaubois","Mlle.Gillenormand",1],["Lt.Gillenormand","Mlle.Gillenormand",1],["Lt.Gillenormand","Gillenormand",1],["Lt.Gillenormand","Cosette",1],["Marius","Mlle.Gillenormand",1],["Marius","Gillenormand",1],["Marius","Pontmercy",1],["Marius","Lt.Gillenormand",1],["Marius","Cosette",1],["Marius","Valjean",1],["Marius","Tholomyes",1],["Marius","Thenardier",1],["Marius","Eponine",1],["Marius","Gavroche",1],["BaronessT","Gillenormand",1],["BaronessT","Marius",1],["Mabeuf","Marius",1],["Mabeuf","Eponine",1],["Mabeuf","Gavroche",1],["Enjolras","Marius",1],["Enjolras","Gavroche",1],["Enjolras","Javert",1],["Enjolras","Mabeuf",1],["Enjolras","Valjean",1],["Combeferre","Enjolras",1],["Combeferre","Marius",1],["Combeferre","Gavroche",1],["Combeferre","Mabeuf",1],["Prouvaire","Gavroche",1],["Prouvaire","Enjolras",1],["Prouvaire","Combeferre",1],["Feuilly","Gavroche",1],["Feuilly","Enjolras",1],["Feuilly","Prouvaire",1],["Feuilly","Combeferre",1],["Feuilly","Mabeuf",1],["Feuilly","Marius",1],["Courfeyrac","Marius",1],["Courfeyrac","Enjolras",1],["Courfeyrac","Combeferre",1],["Courfeyrac","Gavroche",1],["Courfeyrac","Mabeuf",1],["Courfeyrac","Eponine",1],["Courfeyrac","Feuilly",1],["Courfeyrac","Prouvaire",1],["Bahorel","Combeferre",1],["Bahorel","Gavroche",1],["Bahorel","Courfeyrac",1],["Bahorel","Mabeuf",1],["Bahorel","Enjolras",1],["Bahorel","Feuilly",1],["Bahorel","Prouvaire",1],["Bahorel","Marius",1],["Bossuet","Marius",1],["Bossuet","Courfeyrac",1],["Bossuet","Gavroche",1],["Bossuet","Bahorel",1],["Bossuet","Enjolras",1],["Bossuet","Feuilly",1],["Bossuet","Prouvaire",1],["Bossuet","Combeferre",1],["Bossuet","Mabeuf",1],["Bossuet","Valjean",1],["Joly","Bahorel",1],["Joly","Bossuet",1],["Joly","Gavroche",1],["Joly","Courfeyrac",1],["Joly","Enjolras",1],["Joly","Feuilly",1],["Joly","Prouvaire",1],["Joly","Combeferre",1],["Joly","Mabeuf",1],["Joly","Marius",1],["Grantaire","Bossuet",1],["Grantaire","Enjolras",1],["Grantaire","Combeferre",1],["Grantaire","Courfeyrac",1],["Grantaire","Joly",1],["Grantaire","Gavroche",1],["Grantaire","Bahorel",1],["Grantaire","Feuilly",1],["Grantaire","Prouvaire",1],["MotherPlutarch","Mabeuf",1],["Gueulemer","Thenardier",1],["Gueulemer","Valjean",1],["Gueulemer","Mme.Thenardier",1],["Gueulemer","Javert",1],["Gueulemer","Gavroche",1],["Gueulemer","Eponine",1],["Babet","Thenardier",1],["Babet","Gueulemer",1],["Babet","Valjean",1],["Babet","Mme.Thenardier",1],["Babet","Javert",1],["Babet","Gavroche",1],["Babet","Eponine",1],["Claquesous","Thenardier",1],["Claquesous","Babet",1],["Claquesous","Gueulemer",1],["Claquesous","Valjean",1],["Claquesous","Mme.Thenardier",1],["Claquesous","Javert",1],["Claquesous","Eponine",1],["Claquesous","Enjolras",1],["Montparnasse","Javert",1],["Montparnasse","Babet",1],["Montparnasse","Gueulemer",1],["Montparnasse","Claquesous",1],["Montparnasse","Valjean",1],["Montparnasse","Gavroche",1],["Montparnasse","Eponine",1],["Montparnasse","Thenardier",1],["Toussaint","Cosette",1],["Toussaint","Javert",1],["Toussaint","Valjean",1],["Child1","Gavroche",1],["Child2","Gavroche",1],["Child2","Child1",1],["Brujon","Babet",1],["Brujon","Gueulemer",1],["Brujon","Thenardier",1],["Brujon","Gavroche",1],["Brujon","Eponine",1],["Brujon","Claquesous",1],["Brujon","Montparnasse",1],["Mme.Hucheloup","Bossuet",1],["Mme.Hucheloup","Joly",1],["Mme.Hucheloup","Grantaire",1],["Mme.Hucheloup","Bahorel",1],["Mme.Hucheloup","Courfeyrac",1],["Mme.Hucheloup","Gavroche",1],["Mme.Hucheloup","Enjolras",1]
        ]
    }, {
    */
        _data: [
            ['1', 'a_a', 1],
            ['1', 'a_b', 1],
            ['1', 'a_c', 1],
            ['a_a', 'a_a_a', 1],
            ['a_a', 'a_a_b', 1],
            ['a_a', 'a_a_c', 1],
            ['a_a', 'a_a_d', 1],
            ['a_b', 'a_b_a', 1],
            ['a_b', 'a_b_b', 1],
            ['a_b', 'a_b_c', 1],
            ['a_c', 'a_c_a', 1],
            ['a_c', 'a_c_b', 1],
            ['a_c', 'a_c_c', 1],
            ['a_c', 'a_c_d', 1],
            ['a_c_d', 'a_c_d_a', 1],
            ['a_c_d', 'a_c_d_b', 1],
            ['a_c_b', 'a_c_a', 1],
            ['a_c_b', 'a_c_c', 1],
            ['a_c_a', 'a_c_c', 1],

            ['2', 'x', 1],
            ['2', 'y', 1],
            ['2', 'z', 1],
            ['x', 'x_x', 1],
            ['x', 'x_y', 1],
            ['y', 'y_x', 1],
            ['y', 'y_y', 1],
            ['z', 'z_x', 1],
            ['z', 'z_y', 1]
        ],
        layoutAlgorithm: {
            showSimulation: false
        },
        dataLabels: {
            enabled: true
        },
        /*_data2: (function () {
            var d = [],
                groups = 7,
                points = 14;

            for (var l = 0; l < groups; l++) {
                for (var i = 0; i < points; i++) {
                    for (var j = i; j < points; j++) {
                        d.push(
                            [i + '_' + l, j + '_' + l]
                        );
                    }
                    d.push([i + '_' + l, l + '_' + l]);
                }

                for (var k = 0; k < groups; k++) {
                    d.push([k + '_' + k, l + '_' + l]);
                }
            }

            return d;
        })(),*/
        nodes: [{
            id: 'Proto Indo-European',
            marker: {
                radius: 20
            }
        }, {
            id: 'Germanic',
            marker: {
                radius: 10
            },
            color: Highcharts.getOptions().colors[1]
        }, {
            id: 'Celtic',
            marker: {
                radius: 10
            },
            color: Highcharts.getOptions().colors[2]
        }, {
            id: 'Balto-Slavic',
            marker: {
                radius: 10
            },
            color: Highcharts.getOptions().colors[3]
        }, {
            id: 'Indo-Iranian',
            marker: {
                radius: 10
            },
            color: Highcharts.getOptions().colors[4]
        }, {
            id: 'Italic',
            marker: {
                radius: 10
            },
            color: Highcharts.getOptions().colors[5]
        }],
        data: [
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
            ['Old Norwegian', 'Middle Norwegian'],
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
            ['Proto Indo-European', 'Phrygian'],
            ['Proto Indo-European', 'Armenian'],
            ['Proto Indo-European', 'Albanian'],
            ['Proto Indo-European', 'Thracian'],
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
            ['Middle Low German', 'Low German'],
            ['Middle High German', '(High) German'],
            ['Middle High German', 'Yiddish'],
            ['Middle English', 'English'],
            ['Middle Dutch', 'Hollandic'],
            ['Middle Dutch', 'Flemish'],
            ['Middle Dutch', 'Dutch'],
            ['Middle Dutch', 'Limburgish'],
            ['Middle Dutch', 'Brabantian'],
            ['Middle Dutch', 'Rhinelandic'],
            ['Old Frisian', 'Frisian'],
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

