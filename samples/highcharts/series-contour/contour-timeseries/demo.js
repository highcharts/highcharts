Highcharts.chart('container', {

    data: {
        csv: document.getElementById('csv').innerHTML
    },

    chart: {
        type: 'contour',
        zooming: {
            type: 'xy'
        }
    },

    title: {
        text: 'Highcharts time-series contour map',
        align: 'left',
        x: 40
    },

    subtitle: {
        text: 'Temperature variation by day and hour through 2023',
        align: 'left',
        x: 40
    },

    xAxis: {
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 0,
        endOnTick: false,
        startOnTick: false,
        tickWidth: 1,
        lineWidth: 1
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}:00'
        },
        gridLineWidth: 0,
        lineWidth: 1,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [0, 6, 12, 18, 24],
        tickWidth: 1,
        min: 0,
        max: 23,
        reversed: true
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a'],
            [1, '#c4463a']
        ],
        min: -15,
        max: 25,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '{value}℃'
        }
    },

    series: [{
        lineWidth: 0,
        contourInterval: 1,
        tooltip: {
            headerFormat: 'Temperature<br/>',
            pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ' +
                '℃</b>'
        }
    }]

});
