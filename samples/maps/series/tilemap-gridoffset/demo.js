Highcharts.chart('container', {
    chart: {
        type: 'tilemap',
        height: '100%'
    },

    title: {
        text: 'Tilemap demo'
    },

    subtitle: {
        text: 'Tilemap grid coordinates'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    legend: {
        enabled: false
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'x: {point.x}<br>y: {point.y}'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                format: '{point.x}, {point.y}'
            },
            borderWidth: 1,
            borderColor: '#777'
        }
    },

    series: [{
        keys: ['x', 'y'],
        color: '#fdfdfd',
        data: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [4, 2],
            [0, 3],
            [1, 3],
            [2, 3],
            [3, 3],
            [4, 3]
        ]
    }]
});