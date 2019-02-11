var datasets = {
    topdown: {
        data: [
            ['Shareholders', 'Board'],
            ['Board', 'CEO'],
            ['CEO', 'CTO'],
            ['CEO', 'CPO'],
            ['CEO', 'CSO'],
            ['CEO', 'CMO'],
            ['HR', 'CEO'],
            ['CTO', 'Dev1'],
            ['CTO', 'Dev2'],
            ['CTO', 'Dev3'],
            ['CTO', 'Dev4'],
            ['CSO', 'Sales1'],
            ['CSO', 'Sales2'],
            ['CSO', 'Sales3'],
            ['CMO', 'Market1'],
            ['CMO', 'Market2']
        ],
        nodes: [{
            id: 'HR',
            column: 2,
            color: 'silver',
            offset: '-50%'
        }, {
            id: 'CEO',
            offset: '-50%'
        }]
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

var dataset = datasets.topdown;
Highcharts.chart('container', {

    title: {
        text: 'Highcharts Org Chart POC'
    },

    series: [{
        keys: ['from', 'to'],
        data: dataset.data,
        nodes: dataset.nodes,
        type: 'orgchart',
        name: 'Highcharts Org Chart POC'
    }]

});