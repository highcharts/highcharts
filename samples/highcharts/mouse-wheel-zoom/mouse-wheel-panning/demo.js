Highcharts.chart('container', {
    chart: {
        zooming: {
            mouseWheel: {
                type: 'x'
            }
        },
        panKey: 'shift',
        panning: true
    },

    title: {
        text: 'Hold shift and scroll to pan'
    },

    series: [{
        data: [1, 4, 3, 5, 3, 2, 3, 4, 5, 6, 7, 7, 5, 5, 4, 4, 3]
    }]
});
