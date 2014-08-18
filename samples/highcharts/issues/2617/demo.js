$(function () {
    $('#container').highcharts({
        chart: {
            width: 300
        },
        title: {
            text: 'Highcharts 3.0.9: Too many pages in the legend.'
        },
        legend: {
            maxHeight : 40
        },
        series: [
            { name: 'Series 1', data: [7.0, 6.9, 9.5 ] },
            { name: 'Series 2', data: [17.0, 16.9, 19.5 ] },
            { name: 'Series 3', data: [27.0, 26.9, 29.5 ] },
            { name: 'Series 4', data: [37.0, 36.9, 39.5 ] },
            { name: 'Series 5', data: [47.0, 46.9, 49.5 ] },
            { name: 'Series 6', data: [57.0, 56.9, 59.5 ] },
            { name: 'Series 7', data: [67.0, 66.9, 69.5 ] },
            { name: 'Series 8', data: [77.0, 76.9, 79.5 ] },
            { name: 'Series 9', data: [87.0, 86.9, 89.5 ] },
            { name: 'Series 10', data: [97.0, 96.9, 99.5 ] }
        ]
    });
});

