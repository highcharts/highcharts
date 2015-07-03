$(function () {
    $('#container').highcharts({

        title: {
            text: 'Tooltip should follow mouse'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr']
        },

        tooltip: {
            followPointer: true
        },

        series: [{
            data: [3, 2, 5, 4],
            type: 'column'
        }]

    });
});
