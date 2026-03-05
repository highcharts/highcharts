Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.width</em>'
    },
    legend: {
        align: 'right',
        borderRadius: 5,
        borderWidth: 1,
        verticalAlign: 'middle',
        width: '50%'
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
