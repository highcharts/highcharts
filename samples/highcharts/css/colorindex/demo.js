Highcharts.chart('container', {

    chart: {
        styledMode: true
    },

    title: {
        text: 'Series and point color index'
    },

    xAxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
    },

    yAxis: {
        title: {
            text: null
        }
    },

    series: [{
        type: 'line',
        name: 'Apples',
        data: [0, -1, 1, 0],
        colorIndex: 0
    }, {
        type: 'line',
        name: 'Oranges',
        data: [1, 2, 6, 7],
        colorIndex: 1
    }, {
        type: 'line',
        name: 'Chilis',
        data: [1, 1, 3, 2],
        colorIndex: 2
    }, {
        type: 'pie',
        name: 'Totals',
        data: [{
            name: 'Chilis',
            y: 6,
            colorIndex: 2
        }, {
            name: 'Oranges',
            y: 16,
            colorIndex: 1
        }],
        size: '30%',
        center: ['20%', '30%']
    }]
});