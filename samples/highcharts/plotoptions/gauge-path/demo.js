Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },

    pane: {
        startAngle: -120,
        endAngle: 120
    },

    yAxis: {
        min: 0,
        max: 100
    },

    series: [{
        data: [75],
        dial: {
            path: [
                ['M', 0, -10],
                ['l', 100, 0],
                ['l', 0, -10],
                ['l', 20, 20],
                ['l', -20, 20],
                ['l', 0, -10],
                ['l', -100, 0]
            ]
        },
        pivot: {
            radius: 0
        }
    }]
});
