Highcharts.mapChart('container', {
    chart: {
        map: 'Luxembourg'
    },
    title: { text: 'Music Schools in Luxembourg' },
    mapNavigation: {
        enabled: true,
        buttonOptions: { verticalAlign: 'bottom' }
    },
    legend: {
        title: { text: '' },
        layout: 'horizontal',
        borderWidth: 0,
        floating: false,
        valueDecimals: 0
    },
    tooltip: {
        stickOnContact: true,
        useHTML: false,
        headerFormat: '',
        pointFormat:
        '<b>{point.n1}</b><br>Locality: <b>{point.lo}</b><br>Commune: <b>{point.n2}</b>'
    },
    series: [
        {
            name: 'Basemap',
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        },
        {
            name: 'Music Schools (12)',
            color: '#2A7DA1',
            marker: { symbol: 'circle', radius: 6 },
            type: 'mappoint',
            data: [
                {
                    lo: 'Clervaux',
                    lat: 50.05508,
                    lon: 6.02938,
                    n1: 'Music School',
                    n2: 'Clervaux'
                },
                {
                    lo: 'Differdange',
                    lat: 49.52082,
                    lon: 5.88789,
                    n1: 'Music School',
                    n2: 'Differdange'
                },
                {
                    lo: 'Dudelange',
                    lat: 49.47436,
                    lon: 6.08299,
                    n1: 'Music School',
                    n2: 'Dudelange'
                },
                {
                    lo: 'Echternach',
                    lat: 49.81352,
                    lon: 6.42018,
                    n1: 'Music School',
                    n2: 'Echternach'
                },
                {
                    lo: 'Grevenmacher',
                    lat: 49.68126,
                    lon: 6.44506,
                    n1: 'Music School',
                    n2: 'Grevenmacher'
                },
                {
                    lo: 'Kaerjeng',
                    lat: 49.56913,
                    lon: 5.90619,
                    n1: 'Music School',
                    n2: 'Kaerjeng'
                },
                {
                    lo: 'Petange',
                    lat: 49.55807,
                    lon: 5.87544,
                    n1: 'Music School',
                    n2: 'Petange'
                },
                {
                    lo: 'Redange-Attert',
                    lat: 49.76485,
                    lon: 5.88852,
                    n1: 'Music School',
                    n2: 'Redange-Attert'
                },
                {
                    lo: 'Niederanven',
                    lat: 49.6500320799999,
                    lon: 6.26210656799999,
                    n1: 'Music School',
                    n2: 'Niederanven'
                },
                {
                    lo: 'Walferdange',
                    lat: 49.6566846599999,
                    lon: 6.138347785,
                    n1: 'Music School',
                    n2: 'Walferdange'
                },
                {
                    lo: 'Bertrange',
                    lat: 49.60921,
                    lon: 6.05253,
                    n1: 'Music School',
                    n2: 'Bertrange'
                },
                {
                    lo: 'Wiltz',
                    lat: 49.96831,
                    lon: 5.93273,
                    n1: 'Music School',
                    n2: 'Wiltz'
                }
            ],
            dataLabels: { enabled: false }
        },
        {
            name: 'Music School Dependencies (58)',
            color: '#63CBF2',
            marker: { symbol: 'circle' },
            type: 'mappoint',
            data: [
                {
                    name: 'Heinerscheid',
                    lat: 50.09405539,
                    lon: 6.09118546700001,
                    n1: 'Music School (Dependency)',
                    n2: 'Clervaux'
                },
                {
                    lo: 'Hupperdange',
                    lat: 50.0937996,
                    lon: 6.06283071799999,
                    n1: 'Music School (Dependency)',
                    n2: 'Clervaux'
                },
                {
                    lo: 'Lieler',
                    lat: 50.1237705099999,
                    lon: 6.111288849,
                    n1: 'Music School (Dependency)',
                    n2: 'Clervaux'
                },
                {
                    lo: 'Munshausen',
                    lat: 50.03361544,
                    lon: 6.04153656499999,
                    n1: 'Music School (Dependency)',
                    n2: 'Clervaux'
                },
                {
                    lo: 'Beaufort',
                    lat: 49.8369224702153,
                    lon: 6.29329554632867,
                    n1: 'Music School (Dependency)',
                    n2: 'Beaufort'
                },
                {
                    lo: 'Hosingen',
                    lat: 50.01712794,
                    lon: 6.095269538,
                    n1: 'Music School (Dependency)',
                    n2: 'Parc Hosingen'
                },
                {
                    lo: 'Wilwerdange',
                    lat: 50.13931597,
                    lon: 6.02029148899999,
                    n1: 'Music School (Dependency)',
                    n2: 'Troisvierges'
                },
                {
                    lo: 'Binsfeld',
                    lat: 50.11906469,
                    lon: 6.03850251099998,
                    n1: 'Music School (Dependency)',
                    n2: 'Weiswampach'
                },
                {
                    lo: 'Weiswampach',
                    lat: 50.1366235599999,
                    lon: 6.077871926,
                    n1: 'Music School (Dependency)',
                    n2: 'Weiswampach'
                },
                {
                    lo: 'Eschweiler',
                    lat: 49.9976253999999,
                    lon: 5.94464261799998,
                    n1: 'Music School (Dependency)',
                    n2: 'Wiltz'
                },
                {
                    lo: 'Boevange',
                    lat: 50.0458392,
                    lon: 5.930235314,
                    n1: 'Music School (Dependency)',
                    n2: 'Wincrange'
                },
                {
                    lo: 'Hachiville',
                    lat: 50.1060901899999,
                    lon: 5.920684335,
                    n1: 'Music School (Dependency)',
                    n2: 'Wincrange'
                },
                {
                    lo: 'Wincrange',
                    lat: 50.05354847,
                    lon: 5.919501483,
                    n1: 'Music School (Dependency)',
                    n2: 'Wincrange'
                },
                {
                    lo: 'Bettembourg',
                    lat: 49.5212219899999,
                    lon: 6.105723092,
                    n1: 'Music School (Dependency)',
                    n2: 'Bettembourg'
                },
                {
                    lo: 'Roeser',
                    lat: 49.54258201,
                    lon: 6.15014582799999,
                    n1: 'Music School (Dependency)',
                    n2: 'Roeser'
                },
                {
                    lo: 'Weiler-la-Tour',
                    lat: 49.5427034499999,
                    lon: 6.20356275,
                    n1: 'Music School (Dependency)',
                    n2: 'Weiler-la-Tour'
                },
                {
                    lo: 'Berdorf',
                    lat: 49.8210656799741,
                    lon: 6.35160257062658,
                    n1: 'Music School (Dependency)',
                    n2: 'Berdorf'
                },
                {
                    lo: 'Consdorf',
                    lat: 49.77916761,
                    lon: 6.33990192699999,
                    n1: 'Music School (Dependency)',
                    n2: 'Consdorf'
                },
                {
                    lo: 'Godbrange',
                    lat: 49.73578875,
                    lon: 6.233836317,
                    n1: 'Music School (Dependency)',
                    n2: 'Junglinster'
                },
                {
                    lo: 'Junglinster',
                    lat: 49.71066042,
                    lon: 6.246488156,
                    n1: 'Music School (Dependency)',
                    n2: 'Junglinster'
                },
                {
                    lo: 'Born',
                    lat: 49.75568,
                    lon: 6.50211,
                    n1: 'Music School (Dependency)',
                    n2: 'Rosport-Mompach'
                },
                {
                    lo: 'Roodt-Syre',
                    lat: 49.6661935899999,
                    lon: 6.302502896,
                    n1: 'Music School (Dependency)',
                    n2: 'Betzdorf'
                },
                {
                    lo: 'Canach',
                    lat: 49.61077685,
                    lon: 6.327877563,
                    n1: 'Music School (Dependency)',
                    n2: 'Lenningen'
                },
                {
                    lo: 'Wasserbillig',
                    lat: 49.7195239599999,
                    lon: 6.493727692,
                    n1: 'Music School (Dependency)',
                    n2: 'Mertert'
                },
                {
                    lo: 'Wellenstein',
                    lat: 49.5241300099999,
                    lon: 6.34617050399998,
                    n1: 'Music School (Dependency)',
                    n2: 'Schengen'
                },
                {
                    lo: 'Dreiborn',
                    lat: 49.62062853,
                    lon: 6.39385348799998,
                    n1: 'Music School (Dependency)',
                    n2: 'Wormeldange'
                },
                {
                    lo: 'Wormeldange',
                    lat: 49.6119437,
                    lon: 6.40262719599999,
                    n1: 'Music School (Dependency)',
                    n2: 'Wormeldange'
                },
                {
                    lo: 'Bettange',
                    lat: 49.5760331799999,
                    lon: 5.98673227,
                    n1: 'Music School (Dependency)',
                    n2: 'Dippach'
                },
                {
                    lo: 'Schouweiler',
                    lat: 49.5819507299999,
                    lon: 5.955721431,
                    n1: 'Music School (Dependency)',
                    n2: 'Dippach'
                },
                {
                    lo: 'Clemency',
                    lat: 49.5975804699999,
                    lon: 5.871122613,
                    n1: 'Music School (Dependency)',
                    n2: 'Kaerjeng'
                },
                {
                    lo: 'Hautcharage',
                    lat: 49.57719125,
                    lon: 5.91383277099999,
                    n1: 'Music School (Dependency)',
                    n2: 'Kaerjeng'
                },
                {
                    lo: 'Contern',
                    lat: 49.5854171399999,
                    lon: 6.231045358,
                    n1: 'Music School (Dependency)',
                    n2: 'Contern'
                },
                {
                    lo: 'Oetrange',
                    lat: 49.59964652,
                    lon: 6.26224395199999,
                    n1: 'Music School (Dependency)',
                    n2: 'Contern'
                },
                {
                    lo: 'Oberanven',
                    lat: 49.65852386,
                    lon: 6.244132078,
                    n1: 'Music School (Dependency)',
                    n2: 'Niederanven'
                },
                {
                    lo: 'Sandweiler',
                    lat: 49.61356534,
                    lon: 6.218324254,
                    n1: 'Music School (Dependency)',
                    n2: 'Sandweiler'
                },
                {
                    lo: 'Munsbach',
                    lat: 49.6322905599999,
                    lon: 6.26495133499998,
                    n1: 'Music School (Dependency)',
                    n2: 'Schuttrange'
                },
                {
                    lo: 'Lintgen',
                    lat: 49.7222790399999,
                    lon: 6.12796334300001,
                    n1: 'Music School (Dependency)',
                    n2: 'Lintgen'
                },
                {
                    lo: 'Helmdange',
                    lat: 49.69428461,
                    lon: 6.138394799,
                    n1: 'Music School (Dependency)',
                    n2: 'Lorentzweiler'
                },
                {
                    lo: 'Lorentzweiler',
                    lat: 49.70038179,
                    lon: 6.14455967899999,
                    n1: 'Music School (Dependency)',
                    n2: 'Lorentzweiler'
                },
                {
                    lo: 'Mersch',
                    lat: 49.75039306,
                    lon: 6.10659932399998,
                    n1: 'Music School (Dependency)',
                    n2: 'Mersch'
                },
                {
                    lo: 'Reckange',
                    lat: 49.750524882933,
                    lon: 6.07880996529002,
                    n1: 'Music School (Dependency)',
                    n2: 'Mersch'
                },
                {
                    lo: 'Heisdorf',
                    lat: 49.67495342,
                    lon: 6.13538594499999,
                    n1: 'Music School (Dependency)',
                    n2: 'Steinsel'
                },
                {
                    lo: 'Mullendorf',
                    lat: 49.6801577299999,
                    lon: 6.13057450400001,
                    n1: 'Music School (Dependency)',
                    n2: 'Steinsel'
                },
                {
                    lo: 'Steinsel',
                    lat: 49.67372683,
                    lon: 6.123638387,
                    n1: 'Music School (Dependency)',
                    n2: 'Steinsel'
                },
                {
                    lo: 'Garnich',
                    lat: 49.61785518,
                    lon: 5.952618497,
                    n1: 'Music School (Dependency)',
                    n2: 'Garnich'
                },
                {
                    lo: 'Eischen',
                    lat: 49.6851766699999,
                    lon: 5.87354255299999,
                    n1: 'Music School (Dependency)',
                    n2: 'Habscht'
                },
                {
                    lo: 'Hobscheid',
                    lat: 49.68859473,
                    lon: 5.91624755,
                    n1: 'Music School (Dependency)',
                    n2: 'Habscht'
                },
                {
                    lo: 'Kehlen',
                    lat: 49.6686948799999,
                    lon: 6.033544471,
                    n1: 'Music School (Dependency)',
                    n2: 'Kehlen'
                },
                {
                    lo: 'Olm',
                    lat: 49.65696498,
                    lon: 6.00130740399999,
                    n1: 'Music School (Dependency)',
                    n2: 'Kehlen'
                },
                {
                    lo: 'Koerich',
                    lat: 49.66769481,
                    lon: 5.95410316400001,
                    n1: 'Music School (Dependency)',
                    n2: 'Koerich'
                },
                {
                    lo: 'Bridel',
                    lat: 49.658508,
                    lon: 6.080620422,
                    n1: 'Music School (Dependency)',
                    n2: 'Kopstal'
                },
                {
                    lo: 'Kopstal',
                    lat: 49.6635356699999,
                    lon: 6.071428081,
                    n1: 'Music School (Dependency)',
                    n2: 'Kopstal'
                },
                {
                    lo: 'Leudelange',
                    lat: 49.5653183099999,
                    lon: 6.06141868799999,
                    n1: 'Music School (Dependency)',
                    n2: 'Leudelange'
                },
                {
                    lo: 'Mamer',
                    lat: 49.62842392,
                    lon: 6.02554368899998,
                    n1: 'Music School (Dependency)',
                    n2: 'Mamer'
                },
                {
                    lo: 'Kleinbettingen',
                    lat: 49.6464722699999,
                    lon: 5.91214407799999,
                    n1: 'Music School (Dependency)',
                    n2: 'Steinfort'
                },
                {
                    lo: 'Steinfort',
                    lat: 49.66031772,
                    lon: 5.915977519,
                    n1: 'Music School (Dependency)',
                    n2: 'Steinfort'
                },
                {
                    lo: 'Strassen',
                    lat: 49.6203814899999,
                    lon: 6.074363573,
                    n1: 'Music School (Dependency)',
                    n2: 'Strassen'
                },
                {
                    lo: 'Schuttrange',
                    lat: 49.6235802999999,
                    lon: 6.272919581,
                    n1: 'Music School (Dependency)',
                    n2: 'Schuttrange'
                }
            ],
            dataLabels: { enabled: false }
        },
        {
            name: 'Conservatoires (4)',
            color: '#A93854',
            marker: { symbol: 'circle', radius: 6 },
            type: 'mappoint',
            data: [
                {
                    lo: 'Esch-Alzette',
                    lat: 49.48919,
                    lon: 5.9765,
                    n1: 'Conservatoire',
                    n2: 'Esch-sur-Alzette',
                    web: 'https://conservatoire.esch.lu/'
                },
                {
                    lo: 'Luxembourg',
                    lat: 49.60231,
                    lon: 6.10687,
                    n1: 'Conservatoire',
                    n2: 'Luxembourg',
                    web: 'http://www.conservatoire.lu/'
                },
                {
                    lo: 'Ettelbruck',
                    lat: 49.84584,
                    lon: 6.09793,
                    n1: 'Conservatoire',
                    n2: 'Ettelbruck',
                    web: 'http://www.cmnord.lu/'
                },
                {
                    lo: 'Diekirch',
                    lat: 49.8689,
                    lon: 6.16212,
                    n1: 'Conservatoire',
                    n2: 'Diekirch',
                    web: 'http://www.cmnord.lu/'
                }
            ],
            dataLabels: { enabled: false }
        },
        {
            name: 'Conservatoire Dependencies (14)',
            color: '#F48B8B',
            marker: { symbol: 'circle' },
            type: 'mappoint',
            data: [
                {
                    lo: 'Sanem',
                    lat: 49.54816285,
                    lon: 5.928312922,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Sanem'
                },
                {
                    lo: 'Bonnevoie',
                    lat: 49.5962378699999,
                    lon: 6.13654382599999,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Cents',
                    lat: 49.61899812,
                    lon: 6.17087712,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Neudorf',
                    lat: 49.6221257921496,
                    lon: 6.1658663111079,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Eich',
                    lat: 49.6287019499999,
                    lon: 6.128495405,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Gasperich',
                    lat: 49.5906137399999,
                    lon: 6.122066673,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Hollerich',
                    lat: 49.59962026,
                    lon: 6.116110082,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Limpertsberg',
                    lat: 49.6237797,
                    lon: 6.11753800600001,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Merl-Belair',
                    lat: 49.6033858199999,
                    lon: 6.095935799,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Rollingergrund',
                    lat: 49.62246959,
                    lon: 6.10435014499998,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Luxembourg'
                },
                {
                    lo: 'Bissen',
                    lat: 49.78681678,
                    lon: 6.07015754799999,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Bissen'
                },
                {
                    lo: 'Schieren',
                    lat: 49.8268826799999,
                    lon: 6.10033309,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Schieren'
                },
                {
                    lo: 'Medernach',
                    lat: 49.80968207,
                    lon: 6.219475065,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Vallee de l Ernz'
                },
                {
                    lo: 'Vianden',
                    lat: 49.9342884599999,
                    lon: 6.204524782,
                    n1: 'Conservatoire (Dependency)',
                    n2: 'Vianden'
                }
            ],
            dataLabels: { enabled: false }
        },
        {
            name: 'Other Music Instruction (39)',
            color: '#D5E356',
            marker: { symbol: 'circle' },
            type: 'mappoint',
            data: [
                {
                    lo: 'Berdorf',
                    lat: 49.8207206128057,
                    lon: 6.35314335015112,
                    n1: 'Other Music Instruction',
                    n2: 'Berdorf'
                },
                {
                    lo: 'Bettendorf',
                    lat: 49.88200155,
                    lon: 6.22201577099998,
                    n1: 'Other Music Instruction',
                    n2: 'Bettendorf'
                },
                {
                    lo: 'Gilsdorf',
                    lat: 49.8649132299999,
                    lon: 6.18363598900001,
                    n1: 'Other Music Instruction',
                    n2: 'Bettendorf'
                },
                {
                    lo: 'Boevange-Attert',
                    lat: 49.77451534,
                    lon: 6.017524241,
                    n1: 'Other Music Instruction',
                    n2: 'Helperknapp'
                },
                {
                    lo: 'Boulaide',
                    lat: 49.8880683499999,
                    lon: 5.81756977699999,
                    n1: 'Other Music Instruction',
                    n2: 'Boulaide'
                },
                {
                    lo: 'Colmar-Berg',
                    lat: 49.81110725,
                    lon: 6.090962921,
                    n1: 'Other Music Instruction',
                    n2: 'Colmar-Berg'
                },
                {
                    lo: 'Dalheim',
                    lat: 49.54358589,
                    lon: 6.26387620099998,
                    n1: 'Other Music Instruction',
                    n2: 'Dalheim'
                },
                {
                    lo: 'Erpeldange',
                    lat: 49.86021822,
                    lon: 6.11436140300001,
                    n1: 'Other Music Instruction',
                    n2: 'Wiltz'
                },
                {
                    lo: 'Eschdorf',
                    lat: 49.8867063,
                    lon: 5.929359514,
                    n1: 'Other Music Instruction',
                    n2: 'Esch-sur-Sure'
                },
                {
                    lo: 'Heiderscheid',
                    lat: 49.88852018,
                    lon: 5.98239684199998,
                    n1: 'Other Music Instruction',
                    n2: 'Esch-sur-Sure'
                },
                {
                    lo: 'Niederfeulen',
                    lat: 49.85489362,
                    lon: 6.05010794799999,
                    n1: 'Other Music Instruction',
                    n2: 'Feulen'
                },
                {
                    lo: 'Frisange',
                    lat: 49.5169120099999,
                    lon: 6.186474675,
                    n1: 'Other Music Instruction',
                    n2: 'Frisange'
                },
                {
                    lo: 'Heffingen',
                    lat: 49.76724559,
                    lon: 6.23707199099999,
                    n1: 'Other Music Instruction',
                    n2: 'Heffingen'
                },
                {
                    lo: 'Hesperange',
                    lat: 49.5705268099999,
                    lon: 6.154048536,
                    n1: 'Other Music Instruction',
                    n2: 'Hesperange'
                },
                {
                    lo: 'Howald',
                    lat: 49.58283275,
                    lon: 6.138515876,
                    n1: 'Other Music Instruction',
                    n2: 'Hesperange'
                },
                {
                    lo: 'Kayl',
                    lat: 49.48839516,
                    lon: 6.039625884,
                    n1: 'Other Music Instruction',
                    n2: 'Kayl'
                },
                {
                    lo: 'Harlange',
                    lat: 49.9311233299999,
                    lon: 5.79143605399999,
                    n1: 'Other Music Instruction',
                    n2: 'Lac de la Haute-Sure'
                },
                {
                    lo: 'Larochette',
                    lat: 49.78350877,
                    lon: 6.222376757,
                    n1: 'Other Music Instruction',
                    n2: 'Larochette'
                },
                {
                    lo: 'Berbourg',
                    lat: 49.7334038399999,
                    lon: 6.397221733,
                    n1: 'Other Music Instruction',
                    n2: 'Manternach'
                },
                {
                    lo: 'Mertzig',
                    lat: 49.83101711,
                    lon: 6.00718966999998,
                    n1: 'Other Music Instruction',
                    n2: 'Mertzig'
                },
                {
                    lo: 'Mondercange',
                    lat: 49.5326167099999,
                    lon: 5.98770724800001,
                    n1: 'Other Music Instruction',
                    n2: 'Mondercange'
                },
                {
                    lo: 'Mondorf-les-Bains',
                    lat: 49.5071676299999,
                    lon: 6.268747395,
                    n1: 'Other Music Instruction',
                    n2: 'Mondorf-les-Bains'
                },
                {
                    lo: 'Cruchten',
                    lat: 49.8008245199999,
                    lon: 6.134942283,
                    n1: 'Other Music Instruction',
                    n2: 'Nommern'
                },
                {
                    lo: 'Nommern',
                    lat: 49.79557813,
                    lon: 6.175820885,
                    n1: 'Other Music Instruction',
                    n2: 'Nommern'
                },
                {
                    lo: 'Reckange-Mess',
                    lat: 49.56022546,
                    lon: 6.01044010299999,
                    n1: 'Other Music Instruction',
                    n2: 'Reckange-sur-Mess'
                },
                {
                    lo: 'Reisdorf',
                    lat: 49.8665005999999,
                    lon: 6.26485265199998,
                    n1: 'Other Music Instruction',
                    n2: 'Reisdorf'
                },
                {
                    lo: 'Remich',
                    lat: 49.54888328,
                    lon: 6.367680143,
                    n1: 'Other Music Instruction',
                    n2: 'Remich'
                },
                {
                    lo: 'Rumelange',
                    lat: 49.46117559,
                    lon: 6.02904747499999,
                    n1: 'Other Music Instruction',
                    n2: 'Rumelange'
                },
                {
                    lo: 'Bech-Kleinmacher',
                    lat: 49.5319456899999,
                    lon: 6.35039851599999,
                    n1: 'Other Music Instruction',
                    n2: 'Schengen'
                },
                {
                    lo: 'Greiveldange',
                    lat: 49.58478813,
                    lon: 6.360345701,
                    n1: 'Other Music Instruction',
                    n2: 'Stadtbredimus'
                },
                {
                    lo: 'Stadtbredimus',
                    lat: 49.56224555,
                    lon: 6.366808718,
                    n1: 'Other Music Instruction',
                    n2: 'Stadtbredimus'
                },
                {
                    lo: 'Bastendorf',
                    lat: 49.89057351,
                    lon: 6.167195767,
                    n1: 'Other Music Instruction',
                    n2: 'Tandel'
                },
                {
                    lo: 'Trintange',
                    lat: 49.57213775,
                    lon: 6.27817274199998,
                    n1: 'Other Music Instruction',
                    n2: 'Waldbredimus'
                },
                {
                    lo: 'Waldbredimus',
                    lat: 49.5574054699999,
                    lon: 6.28317031,
                    n1: 'Other Music Instruction',
                    n2: 'Waldbredimus'
                },
                {
                    lo: 'Aspelt',
                    lat: 49.5216846699999,
                    lon: 6.22042445499999,
                    n1: 'Other Music Instruction',
                    n2: 'Frisange'
                },
                {
                    lo: 'Reckange',
                    lat: 49.7500624533246,
                    lon: 6.08037238663771,
                    n1: 'Other Music Instruction',
                    n2: 'Mersch'
                },
                {
                    lo: 'Oetrange',
                    lat: 49.6013856659346,
                    lon: 6.25868430431372,
                    n1: 'Other Music Instruction',
                    n2: 'Contern'
                },
                {
                    lo: 'Goeblange',
                    lat: 49.6684732797471,
                    lon: 5.96701391263411,
                    n1: 'Other Music Instruction',
                    n2: 'Koerich'
                },
                {
                    lo: 'Tetange',
                    lat: 49.4766858636207,
                    lon: 6.0395531661469,
                    n1: 'Other Music Instruction',
                    n2: 'Kayl'
                }
            ],
            dataLabels: { enabled: false }
        }
    ]
});
