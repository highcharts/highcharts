Highcharts.chart('container', {
    chart: {
        height: 600,
        inverted: true
    },

    title: {
        text: 'Organization chart'
    },

    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. {toNode.name}' +
                '{#if (ne toNode.name toNode.id)}, {toNode.id}{/if}, ' +
                'reports to {fromNode.id}'
        }
    },

    series: [{
        type: 'organization',
        name: 'Acme Corp',
        data: [
            { from: 'Shareholders', to: 'Board' },
            { from: 'Board', to: 'CEO' },
            { from: 'CEO', to: 'CTO' },
            { from: 'CEO', to: 'CPO' },
            { from: 'CEO', to: 'CSO' },
            { from: 'CEO', to: 'HR' },
            { from: 'CTO', to: 'Product' },
            { from: 'CTO', to: 'Web' },
            { from: 'CTO', to: 'Market' },
            { from: 'CSO', to: 'Sales' },
            { from: 'CSO', to: 'Market' },
            { from: 'HR', to: 'Market' },
            { from: 'CTO', to: 'Market' }
        ],
        levels: [{
            level: 0,
            color: 'silver',
            dataLabels: {
                color: 'black'
            }
        }, {
            level: 1,
            color: 'silver',
            dataLabels: {
                color: 'black'
            }
        }, {
            level: 2,
            color: '#980104'
        }, {
            level: 4,
            color: '#359154'
        }],
        nodes: [{
            id: 'Shareholders'
        }, {
            id: 'Board'
        }, {
            id: 'CEO',
            title: 'CEO',
            name: 'Alexander Smith',
            image: 'https://www.highcharts.com/samples/graphics/organization-chart/' +
                'AI_CEO.jpeg'
        }, {
            id: 'HR',
            title: 'CFO',
            name: 'Sarah Jenkins',
            color: '#007ad0',
            image: 'https://www.highcharts.com/samples/graphics/organization-chart/' +
                'AI_CFO.jpeg'
        }, {
            id: 'CTO',
            title: 'CTO',
            name: 'Michael Chang',
            image: 'https://www.highcharts.com/samples/graphics/organization-chart/' +
                'AI_CTO.jpeg'
        }, {
            id: 'CPO',
            title: 'CPO',
            name: 'David Rodriguez',
            image: 'https://www.highcharts.com/samples/graphics/organization-chart/' +
                'AI_CPO.jpeg'
        }, {
            id: 'CSO',
            title: 'CSO',
            name: 'Emily Chen',
            image: 'https://www.highcharts.com/samples/graphics/organization-chart/' +
                'AI_CSO.jpeg'
        }, {
            id: 'Product',
            name: 'Product developers'
        }, {
            id: 'Web',
            name: 'Web devs, sys admin'
        }, {
            id: 'Sales',
            name: 'Sales team'
        }, {
            id: 'Market',
            name: 'Marketing team',
            column: 5
        }],
        colorByPoint: false,
        color: '#007ad0',
        dataLabels: {
            color: 'white'
        },
        borderColor: 'var(--highcharts-background-color, white)',
        nodeWidth: 'auto'
    }],
    tooltip: {
        outside: true
    },
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }

} satisfies Highcharts.Options);