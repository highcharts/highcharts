Highcharts.chart('container', {
    title: {
        text: 'Accessible annotations'
    },

    series: [{
        name: 'Line series',
        data: [1, 3, 4, 6, { y: 7, id: 'peak1' }, 5, 3, 4, 8, { y: 9, id: 'peak2' }, 7, 6]
    }, {
        type: 'column',
        name: 'Column series',
        data: [0.5, 1.5, 2, 3, 3.5, 2.5, 1.5, 2, 4, 4.5, { y: 3.5, id: 'important' }, 3]
    }],

    xAxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December']
    },

    yAxis: {
        title: false,
        labels: {
            format: '{value}%'
        }
    },

    tooltip: {
        valueSuffix: '%'
    },

    annotations: [{
        draggable: false,
        shapes: [{
            point: 'peak2',
            type: 'circle',
            fill: 'rgba(255, 120, 120, 0.4)',
            stroke: '#ff7070',
            r: 10
        }, {
            points: ['peak1', 'peak2'],
            type: 'path',
            fill: 'none',
            stroke: '#ff7070',
            strokeWidth: 2,
            markerEnd: 'arrow'
        }],
        labels: [{
            point: {
                x: 50, y: 20
            },
            shape: 'rect',
            text: 'Freestanding annotation',
            backgroundColor: 'rgba(240, 240, 255, 0.7)',
            borderColor: 'rgb(240, 240, 255)'
        }, {
            point: 'important',
            text: 'This is an important point'
        }, {
            points: ['peak1', 'peak2'],
            text: 'The second peak is higher than the first'
        }]
    }]
});
