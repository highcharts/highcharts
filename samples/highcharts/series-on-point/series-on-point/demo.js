Highcharts.chart('container', {

    plotOptions: {
        pie: {
            minSize: 25,
            maxSize: '20%',
            dataLabels: {
                enabled: false
            }
        }
    },

    title: {
        text: 'Series on point'
    },

    subtitle: {
        text: 'Pies displayed over points with a given id'
    },

    series: [{
        type: 'column',
        data: [
            { y: 3, id: 'firstPoint' },
            { y: 5, id: 'secondPoint' },
            { y: 5, id: 'thirdPoint' },
            3,
            2,
            3
        ]
    }, {
        type: 'pie',
        onPoint: {
            id: 'firstPoint',
            z: 3
        },
        data: [1, 2, 3]
    }, {
        type: 'pie',
        onPoint: {
            id: 'secondPoint',
            z: 150,
            position: {
                offsetX: 50,
                offsetY: 75
            },
            connectorOptions: {
                width: 3,
                color: '#ff0000',
                dashStyle: 'dash'
            }
        },
        data: [4, 5, 6]
    }, {
        type: 'pie',
        onPoint: {
            id: 'thirdPoint',
            z: 200
        },
        data: [7, 8, 9]
    }]
});