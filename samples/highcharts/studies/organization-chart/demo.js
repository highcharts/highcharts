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
            ['CTO', 'Tech'],
            ['CTO', 'BL'],
            ['CSO', 'Sales'],
            ['CMO', 'Market']
        ],
        nodes: [{
            id: 'Shareholders',
            color: 'silver',
            dataLabels: {
                color: 'black'
            }
        }, {
            id: 'Board',
            color: 'silver',
            dataLabels: {
                color: 'black'
            }
        }, {
            id: 'CEO',
            title: 'CEO',
            name: 'Grethe Hjetland',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/12132317/Grethe.jpg',
            offset: '-50%',
            color: '#980104'
        }, {
            id: 'HR',
            title: 'HR/CFO',
            name: 'Anne Jorunn Fjærestad',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/12132314/AnneJorunn.jpg',
            column: 2,
            offset: '-50%'
        }, {
            id: 'CTO',
            title: 'CTO',
            name: 'Christer Vasseng',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/12140620/Christer.jpg',
            layout: 'hanging'
        }, {
            id: 'CPO',
            title: 'CPO',
            name: 'Torstein Hønsi',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/12131849/Torstein1.jpg'
        }, {
            id: 'CSO',
            title: 'CSO',
            name: 'Anita Nesse',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/12132313/Anita.jpg',
            layout: 'hanging'
        }, {
            id: 'CMO',
            title: 'CMO',
            name: 'Vidar Brekke',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2018/11/13105551/Vidar.jpg',
            layout: 'hanging'
        }, {
            id: 'Tech',
            name: 'Tech team',
            description: 'Product and web developers, sys admin',
            color: '#359154'
        }, {
            id: 'BL',
            name: 'Black Label',
            description: 'Tech support, development',
            color: '#359154'
        }, {
            id: 'Sales',
            name: 'Sales team',
            color: '#359154'
        }, {
            id: 'Market',
            name: 'Marketing team',
            color: '#359154'
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

    chart: {
        height: 600
    },

    title: {
        text: 'Highcharts Org Chart POC'
    },

    series: [{
        keys: ['from', 'to'],
        data: dataset.data,
        nodes: dataset.nodes,
        type: 'orgchart',
        name: 'Highcharts Org Chart POC',
        colorByPoint: false,
        color: '#007ad0',
        dataLabels: {
            color: 'white'
        },
        borderColor: 'white',
        nodeWidth: 65
    }],
    exporting: {
        allowHTML: true
    }

});