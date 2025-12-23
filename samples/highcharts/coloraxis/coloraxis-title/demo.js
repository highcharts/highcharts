Highcharts.chart('container', {
    colorAxis: {
        title: {
            text: 'My Color Axis Title'
        }
    },
    series: [{
        type: 'heatmap',
        data: [[0, 0, 1], [0, 1, 2], [1, 0, 3], [1, 1, 4]]
    }]
});