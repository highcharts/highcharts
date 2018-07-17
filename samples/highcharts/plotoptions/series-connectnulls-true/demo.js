
Highcharts.chart('container', {

    title: {
        text: 'The graphs connect from April to June, despite the null value in May'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    plotOptions: {
        series: {
            connectNulls: true
        }
    },

    series: [{
        data: [
            [20, 50],
            [60, 90],
            [90, 120],
            [110, 140],
            null,
            [160, 190],
            [120, 150],
            [130, 160],
            [200, 230],
            [180, 210],
            [80, 110],
            [40, 70]
        ],
        type: 'arearange',
        name: 'Area range series',
        marker: {
            enabled: false
        }
    }, {
        data: [29.9, 71.5, 106.4, 129.2, null, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4],
        name: 'Line series'
    }]

});