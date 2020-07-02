Highcharts.chart('container', {

    series: [{
        data: [2, {
            y: 4,
            id: 'point1'
        }, 3, {
            y: 4,
            id: 'point2'
        }, 6]
    }],

    annotations: [{
        labels: [{
            point: 'point1',
            text: 'This is my annotation I for point I',
            y: -50
        }]
    }, {
        labels: [{
            point: 'point1',
            text: 'This is my annotation II for point I'
        }, {
            point: 'point2',
            text: 'This is my annotation I for point II'
        }]
    }],

    exporting: {
        csv: {
            annotations: {
                itemDelimiter: ' / ',
                join: true
            }
        },
        showTable: true
    }

});