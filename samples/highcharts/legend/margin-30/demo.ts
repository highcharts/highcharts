Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.margin</em>'
    },
    legend: {
        margin: 30
    },
    series: [{
        data: [6, 4, 2],
        name: 'First'
    }, {
        data: [7, 3, 2],
        name: 'Second'
    }, {
        data: [9, 4, 8],
        name: 'Third'
    }, {
        data: [1, 2, 6],
        name: 'Fourth'
    }]
});
