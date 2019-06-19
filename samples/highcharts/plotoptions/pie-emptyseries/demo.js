Highcharts.chart('container', {

    chart: {
        type: 'pie'
    },

    title: {
        text: 'Empty pie chart'
    },

    series: [{
        data: [{
            y: 0,
            name: 'Point 1.'
        }, {
            y: 0,
            name: 'Point 2.'
        }, {
            y: 0,
            name: 'Point 3.'
        }],
        lineWidth: 5,
        color: '#c0ffee'
    }]
});
