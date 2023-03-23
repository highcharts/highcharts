Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        plotBackgroundImage: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@3c36bd6dc1/samples/graphics/example-screenshot.png'
    },
    title: {
        text: 'Interpolated heatmap image displaying user activity on a website'
    },
    yAxis: {
        title: {
            text: undefined
        },
        visible: false
    },
    xAxis: {
        visible: false
    },
    tooltip: {
        pointFormat: '{point.value} interactions in this region'
    },
    legend: {
        labelFormat: 'User interactions per region',
        symbolPadding: 0
    },
    colorAxis: {
        stops: [
            [0, 'rgba(61, 0, 255, 0.2)'],
            [0.16, 'rgba(0, 255, 188, 1.0)'],
            [0.24, 'rgba(194, 255, 0, 1.0)'],
            [0.64, 'rgba(255, 0, 67, 1.0)']
        ]
    },
    series: [{
        name: 'User activity',
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }]
});