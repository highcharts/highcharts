$(function () {
    $('#container').highcharts({
        title: {
            text: 'Step line types, with null values in the series'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [1, 2, 3, 4, null, 6, 7, null, 9],
            step: 'right',
            name: 'Right'
        }, {
            data: [5, 6, 7, 8, null, 10, 11, null, 13],
            step: 'center',
            name: 'Center'
        }, {
            data: [9, 10, 11, 12, null, 14, 15, null, 17],
            step: 'left',
            name: 'Left'
        }]

    });
});