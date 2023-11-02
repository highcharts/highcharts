Highcharts.chart('container', {
    chart: {
        height: '100%',
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
        endOnTick: false,
        visible: false,
        minPadding: 0,
        maxPadding: 0
    },
    xAxis: {
        visible: false,
        margin: 0,
        minPadding: 0,
        maxPadding: 0
    },
    tooltip: {
        pointFormat: '{point.value:.0f} interactions in this region'
    },
    legend: {
        title: {
            text: 'User interactions per region'
        },
        symbolWidth: 175
    },
    colorAxis: {
        stops: [
            [0, 'rgba(61, 0, 255, 0.2)'],
            [0.3, 'rgba(0, 255, 188, 0.3)'],
            [0.6, 'rgba(194, 255, 0, 0.6)'],
            [0.9, 'rgba(255, 0, 67, 0.9)']
        ]
    },
    series: [{
        name: 'User activity',
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }],
    responsive: {
        rules: [{
            condition: {
                minWidth: 600
            },
            chartOptions: {
                chart: {
                    height: 550
                }
            }
        }]
    }
});
