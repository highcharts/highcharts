Highcharts.chart('container', {
    chart: {
        type: 'columnpyramid'
    },
    title: {
        text: 'The 5 highest pyramids in the World'
    },
    colors: ['#C79D6D', '#B5927B', '#CE9B84', '#B7A58C', '#C7A58C'],
    xAxis: {
        categories: [
            'Pyramid of Khufu',
            'Pyramid of Khafre',
            'Red Pyramid',
            'Bent Pyramid',
            'Pyramid of the Sun'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Height (m)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">Height: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} m</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    series: [{
        name: 'Pyramids names',
        colorByPoint: true,
        data: [138.8, 136.4, 104, 101.1, 75]
    }]
});