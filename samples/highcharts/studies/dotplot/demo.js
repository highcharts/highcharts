Highcharts.chart('container', {

    chart: {
        type: 'dotplot'
    },

    title: {
        text: 'Highcharts dotplot chart'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    yAxis: {
        visible: false
    },

    plotOptions: {
        series: {
            slotsPerBar: 1,
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Items bought',
        data: [5, 3, 4],
        color: 'green'
    }, {
        name: 'Items sold',
        data: [0, 2, 1],
        color: 'red'
    }]

});
