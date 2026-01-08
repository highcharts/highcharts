Highcharts.chart('container', {
    title: {
        text: 'Contour plot'
    },
    yAxis: {
        title: null
    },
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
        lineColor: '#000000',
        data: JSON.parse(
            document
                .getElementById('data')
                .textContent
        )
    }]
});