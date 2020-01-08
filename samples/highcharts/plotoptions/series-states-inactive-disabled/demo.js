Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Disabled inactive state'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },

    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }]
});