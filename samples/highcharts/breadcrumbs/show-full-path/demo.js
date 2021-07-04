Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        type: 'category'
    },
    title: {
        text: null
    },
    series: [{
        name: 'Supply',
        data: [{
            name: 'Fruits',
            y: 5,
            drilldown: 'Fruits'
        },
        {
            name: 'Vegetables',
            y: 6,
            drilldown: 'Vegetables'
        },
        {
            name: 'Meat',
            y: 3
        }
        ]
    }],
    drilldown: {
        animation: false,
        breadcrumbs: {
            showFullPath: true
        },
        series: [{
            name: 'Fruits',
            id: 'Fruits',
            data: [{
                name: 'Citrus',
                y: 2,
                drilldown: 'Citrus'
            }, {
                name: 'Tropical',
                y: 5,
                drilldown: 'Tropical'
            },
            ['Other', 1]
            ]
        }, {
            name: 'Vegetables',
            id: 'Vegetables',
            data: [
                ['Potatoes', 2],
                ['Cucumber', 4]
            ]
        }, {
            name: 'Citrus',
            id: 'Citrus',
            data: [{
                name: 'Lemon',
                y: 5,
                drilldown: 'Lemon'
            },
            ['Orange', 4]
            ]
        }, {
            name: 'Tropical',
            id: 'Tropical',
            data: [
                ['Banana', 1],
                ['Mango', 3]
            ]
        }, {
            name: 'Lemon',
            id: 'Lemon',
            data: [
                ['Typ A', 2],
                ['Typ B', 7]
            ]
        }
        ]
    }
});