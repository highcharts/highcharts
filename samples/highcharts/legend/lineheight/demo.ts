Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.itemMarginTop</em> and ' +
               '<em>itemMarginBottom</em>'
    },
    legend: {
        align: 'right',
        borderWidth: 1,
        itemMarginBottom: 10,
        itemMarginTop: 10,
        layout: 'vertical',
        verticalAlign: 'middle'
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
