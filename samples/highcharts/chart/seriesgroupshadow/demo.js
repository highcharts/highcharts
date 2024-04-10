Highcharts.chart('container', {
    chart: {
        type: 'column',
        seriesGroupShadow: true
    },

    title: {
        text: 'seriesGroupShadow: true'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 2, 3, 1]
    }, {
        data: [7, 5, 4, 3]
    }]
});