Highcharts.chart('container', {

    chart: {
        type: 'line',
        displayErrors: true
    },

    accessibility: {
        enabled: false
    },

    title: {
        text: ''
    },

    series: [{
        data: [{
            x: 1,
            y: 2
        }, {
            x: 0,
            y: 3
        }]
    }]

});
