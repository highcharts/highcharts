
Highcharts.chart('container', {
    data: {
        csv: document.getElementById('csv').innerHTML
    },
    title: {
        text: 'Temperature by the hour'
    },
    subtitle: {
        text: 'Drag mouse to zoom in'
    },
    chart: {
        type: 'heatmap',
        zoomType: 'xy'
    },
    xAxis: {
        min: Date.UTC(2015, 4, 1),
        max: Date.UTC(2015, 4, 30),
        scrollbar: {
            enabled: true
        }
    },
    yAxis: {
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        scrollbar: {
            enabled: true
        },
        labels: {
            format: '{value}:00'
        },
        title: {
            text: 'Hour'
        }
    },
    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ],
        min: -10,
        max: 20
    },
    series: [{
        colsize: 24 * 36e5
    }]
});
