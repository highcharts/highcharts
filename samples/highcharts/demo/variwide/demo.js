
Highcharts.chart('container', {

    chart: {
        type: 'variwide'
    },

    title: {
        text: 'Highcharts variwide study'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    series: [{
        data: [{
            x: 1,
            y: 1,
            z: 10
        }, {
            x: 2,
            y: 2,
            z: 20
        }, {
            x: 3,
            y: 3,
            z: 30
        }],
        dataLabels: {
            enabled: true,
            format: '{point.y} ({point.z})',
            inside: true
        }
    }, {
        data: [{
            x: 1,
            y: 1,
            z: 10
        }, {
            x: 2,
            y: 2,
            z: 20
        }, {
            x: 3,
            y: 3,
            z: 30
        }],
        dataLabels: {
            enabled: true,
            format: '{point.y} ({point.z})',
            inside: true
        }
    }]

});
