Highcharts.chart('container', {

    title: {
        text: 'Highcharts Org Chart POC'
    },

    series: [{
        keys: ['from', 'to'],
        data: [
            ['Shareholders', 'Board'],
            ['Board', 'CEO'],
            ['HR', 'CEO'],
            ['CEO', 'CTO'],
            ['CEO', 'CPO'],
            ['CEO', 'CMO'],
            ['CEO', 'CSO'],
            ['CTO', 'Tech team'],
            ['CTO', 'Support team'],
            ['CMO', 'Marketing team'],
            ['CSO', 'Sales team']
        ],
        nodes: [{
            id: 'HR',
            column: 2
        }],
        type: 'organization',
        name: 'Highcharts Org Chart POC'
    }]

});