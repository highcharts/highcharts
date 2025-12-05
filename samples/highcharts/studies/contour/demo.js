Highcharts.chart('container', {
    chart: {
        title: {
            text: 'Contour studies'
        }
    },
    yAxis: {
        gridLineWidth: 1,
        gridLineColor: '#000000',
        title: null
    },
    xAxis: {
        gridLineWidth: 1,
        gridLineColor: '#000000'
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
        showContourLines: true,
        contourInterval: 0.5,
        contourOffsets: [0, 0.3],
        data: [
            [
                0,
                0,
                0
            ],
            [
                0,
                1,
                0
            ],
            [
                1,
                0,
                1
            ],
            [
                1,
                1,
                1
            ]
        ]
    }]
});
