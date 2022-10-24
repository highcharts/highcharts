Highcharts.chart('container', {

    yAxis: {
        labels: {
            format: '${text}' // The $ is literally a dollar unit
        },
        title: {
            text: 'Cost'
        }
    },

    series: [{
        data: [299000, 715000, 1064000, 1292000, 1440000, 1760000, 1356000,
            1485000, 2164000, 1941000, 956000, 544000],
        type: 'column'
    }]

});