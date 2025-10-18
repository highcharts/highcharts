// Create the chart
Highcharts.chart('container', {

    chart: {
        zooming: {
            mouseWheel: {
                type: 'x',
                showResetButton: true
            }
        }
    },

    title: {
        text: 'Mouse wheel zooming, show reset button'
    },

    series: [{
        data: [1, 4, 3, 5, 3, 2, 3, 4, 5, 6, 7, 7, 5, 5, 4, 4, 3]
    }]
});
