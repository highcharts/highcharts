Highcharts.chart('container', {
    chart: {
        height: '80%',
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
        followPointer: true,
        formatter: function () {
            return (
                ~~this.point.value +
                ' interactions in this region'
            );
        }
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
                maxWidth: 800
            },
            chartOptions: {
                chart: {
                    height: '60%'
                }
            }
        }]
    }
});