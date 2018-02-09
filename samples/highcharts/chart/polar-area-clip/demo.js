
Highcharts.chart('container', {

    chart: {
        polar: true,
        type: 'area'
    },

    title: {
        text: 'Highcharts polar area chart'
    },

    subtitle: {
        text: 'Graph and area outside the perimeter should be clipped'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        max: 250,
        endOnTick: false
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 294.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]

});