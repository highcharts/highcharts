Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Columns centered in category'
    },

    subtitle: {
        text: 'Null or missing points are ignored'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec'],
        gridLineWidth: 1
    },

    plotOptions: {
        series: {
            centerInCategory: true
        }
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, null, null, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4]
    }, {
        data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
            106.4, 129.2]
    }, {
        data: [71.5, 106.4, 129.2, null, null, 135.6, 148.5, null, 194.1, 95.6,
            54.4, 29.9]
    }]
});