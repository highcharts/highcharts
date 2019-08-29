Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Inactive state disabled by setting opacity'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    plotOptions: {
        series: {
            states: {
                inactive: {
                    opacity: 1
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