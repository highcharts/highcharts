
Highcharts.chart('container', {

    title: {
        text: 'Tooltip background and border by CSS'
    },

    legend: {
        borderWidth: 2
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    series: [{
        data: [1, 4, 3, 2, 5]
    }, {
        data: [2, 1, 4, 3, 2]
    }]
});