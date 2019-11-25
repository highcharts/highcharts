Highcharts.chart('container', {

    chart: {
        type: 'dumbbell',
        styledMode: true
    },

    title: {
        text: 'Styling axes and points'
    },

    yAxis: [{
        className: 'highcharts-color-0',
        title: {
            text: 'Primary axis'
        }
    }, {
        className: 'highcharts-color-1',
        opposite: true,
        title: {
            text: 'Secondary axis'
        }
    }],

    series: [{
        data: [[32, 45], [43, 56], [32, 42], [28, 56]]
    }, {
        data: [[3, 6], [6, 8], [3, 7], [3, 6]],
        yAxis: 1
    }]

});