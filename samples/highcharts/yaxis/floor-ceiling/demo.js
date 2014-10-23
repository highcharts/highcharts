$(function () {
    $('#container').highcharts({

        title: {
            text: 'Y axis floor is 0'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            floor: 0,
            ceiling: 100,
            title: {
                text: 'Percentage'
            }
        },

        series: [{
            data: [0, 1, 0, 2, 3, 5, 8, 5, 15, 14, 25, 54]
        }]
    });
});