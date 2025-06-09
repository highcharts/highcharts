Highcharts.chart('container', {
    chart: {
        styledMode: true,
        // Lower this value to see that colors for higher indices
        // (e.g. .highcharts-color-10) won't be applied
        colorCount: 11
    },

    title: {
        text: 'Effect of chart.colorCount on colorIndex and CSS Styling'
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
        data: [0, -1, 1, 0]
    }, {
        type: 'line',
        name: 'Oranges',
        ata: [1, 2, 6, 7]
    }, {
        type: 'line',
        name: 'Chilis',
        data: [1, 1, 3, 2]
    }, {
        type: 'line',
        name: 'Mango',
        data: [1, 0, 2, 1]
    }, {
        type: 'line',
        name: 'Pineapple',
        data: [2, 3, 7, 8]
    }, {
        type: 'line',
        name: 'Zuchini',
        data: [0, 2, 4, 3]
    }, {
        type: 'line',
        name: 'Pears',
        data: [2, 1, 3, 2]
    }, {
        type: 'line',
        name: 'Bananas',
        data: [3, 4, 8, 8]
    }, {
        type: 'line',
        name: 'Jackfruits',
        data: [1, 1, 3, 2]
    }, {
        type: 'line',
        name: 'Peaches',
        data: [1, 0, 2, 1]
    }, {
        type: 'line',
        name: 'Cauliflower',
        data: [10, 10, 11, 12]
    }]
});
