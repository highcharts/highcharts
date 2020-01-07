Highcharts.chart('container', {
    title: {
        text: 'Accessible annotations'
    },

    series: [{
        data: [1, 3, 4, 6, 7, 5, 3, 4, 8, { y: 9, id: 'max' }, 7, 6, 4, 3]
    }, {
        type: 'column',
        data: [0.5, 1.5, 2, 3, 3.5, 2.5, 1.5, 2, { y: 4, id: 'important' }, 4.5, 3.5, 3, 2, 1.5]
    }],

    annotations: [{
        draggable: false,
        shapes: [{
            point: 'max',
            type: 'circle',
            fill: 'rgba(130, 90, 90, 0.4)',
            r: 20
        }],
        labels: [{
            point: {
                x: 100, y: 30
            },
            shape: 'rect',
            text: 'Freestanding annotation'
        }, {
            point: 'important',
            text: 'This is an important point'
        }]
    }]
});
