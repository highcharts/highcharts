// Highcharts 3.0.10, Issue #2339
// Left parameter - inverted chart
Highcharts.chart('container', {

    chart: {
        inverted: true,
        type: 'area'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: [{
        offset: 0,
        width: 100,
        title: {
            text: 'left: auto'
        }
    }, {
        left: 200,
        width: 100,
        offset: 0,
        title: {
            text: 'left: 200'
        }
    }],

    series: [{
        data: [1, 3, 2, 4],
        name: 'left: auto'
    }, {
        data: [3, 2, 4, 1].reverse(),
        yAxis: 1,
        name: 'left: 200'
    }]

});