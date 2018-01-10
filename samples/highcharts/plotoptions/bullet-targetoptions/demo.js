Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    title: {
        text: 'Highcharts Bullet graph'
    },
    subtitle: {
        text: 'Target options demo'
    },

    legend: {
        enabled: false
    },
    xAxis: {
        categories: ['A', 'B', 'C', 'D']
    },

    series: [{
        type: 'bullet',
        data: [{
            y: 40,
            target: 50
        }, {
            y: 20,
            target: 40
        }, {
            y: 60,
            target: 50,
            targetOptions: {
                width: '120%',
                height: 6,
                borderWidth: 2,
                borderColor: 'green',
                color: 'yellow'
            }
        }, {
            y: 30,
            target: 30,
            targetOptions: {
                width: 10,
                height: 10,
                borderWidth: 0,
                color: 'black'
            }
        }],
        targetOptions: {
            width: '200%',
            height: 4,
            borderWidth: 1,
            borderColor: 'red',
            color: 'orange'
        }
    }]
});
