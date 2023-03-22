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
    colorAxis: {
        stops: [
            [0, '#3D00FF'],
            [0.16, '#00FFBC'],
            [0.24, '#C2FF00'],
            [0.64, '#FF0043']
        ]
    },
    series: [{
        name: 'User activity',
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }]
});