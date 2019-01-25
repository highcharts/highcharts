var datasets = {
    topdown: {
        data: [
            ['CEO', 'CTO'],
            ['CEO', 'CPO'],
            ['CEO', 'CSO'],
            ['CEO', 'CMO'],
            ['CTO', 'Dev1'],
            ['CTO', 'Dev2']
        ]
    },
    mafia: {
        data: [
            ['Boss', 'Consigliere'],
            ['Boss', 'Underboss'],
            ['Underboss', 'Caporegime1'],
            ['Underboss', 'Caporegime2'],
            ['Underboss', 'Caporegime3'],
            ['Caporegime1', 'Soldiers1'],
            ['Caporegime2', 'Soldiers2'],
            ['Caporegime3', 'Soldiers3']
        ],
        nodes: [{
            id: 'Consigliere',
            column: 0
        }, {
            id: 'Caporegime1',
            name: 'Caporegime'
        }, {
            id: 'Caporegime2',
            name: 'Caporegime'
        }, {
            id: 'Caporegime3',
            name: 'Caporegime'
        }, {
            id: 'Soldiers1',
            name: 'Soldiers',
            color: '#eeeeee'
        }, {
            id: 'Soldiers2',
            name: 'Soldiers',
            color: '#eeeeee'
        }, {
            id: 'Soldiers3',
            name: 'Soldiers',
            color: '#eeeeee'
        }]
    }
};

var dataset = datasets.mafia;
Highcharts.chart('container', {

    title: {
        text: 'Highcharts Org Chart POC'
    },

    series: [{
        keys: ['from', 'to'],
        data: dataset.data,
        nodes: dataset.nodes,
        type: 'organization',
        name: 'Highcharts Org Chart POC'
    }]

});