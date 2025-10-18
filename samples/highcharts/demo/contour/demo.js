Highcharts.chart('container', {
    chart: { height: 640 },
    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ]
    },
    series: [{
        type: 'contour',
        smoothColoring: true,
        contourInterval: 1,
        showContourLines: true,
        lineColor: '#000000',
        lineWidth: 2,
        data: JSON.parse(
            document
                .getElementById('data')
                .textContent
        )
    }]
});