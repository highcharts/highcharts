$(function () {
    $('#container').highcharts({

        title: {
            text: 'Legend styled by CSS'
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            title: {
                text: 'Legend title'
            },
            verticalAlign: 'middle'
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
});