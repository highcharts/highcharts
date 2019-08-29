Highcharts.chart('container', {

    chart: {
        height: 600,
        inverted: true
    },

    title: {
        text: 'Highcharts Centered Org Chart'
    },

    series: [{
        type: 'organization',
        name: 'Highcharts Org Chart',
        keys: ['from', 'to'],
        data: [
            ['CTO', 'CEO'],
            ['CPO', 'CEO'],
            ['CEO', 'CPO'],
            ['CEO', 'CSO'],
            ['CEO', 'CMO'],
            ['CEO', 'HR']
        ],
        nodes: [{
            id: 'CTO',
            column: 0
        }, {
            id: 'CPO',
            column: 0
        }, {
            id: 'CEO',
            color: '#980104',
            borderRadius: '50%'
        }],
        colorByPoint: false,
        dataLabels: {
            color: 'white'
        },
        nodeWidth: '25%' // = height in the inverted chart
    }],
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }

});