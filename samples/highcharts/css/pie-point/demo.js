$(function () {
    $('#container').highcharts({

        title: {
            text: 'Pie point css'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            type: 'pie',
            allowPointSelect: true,
            keys: ['y', 'selected', 'sliced'],
            data: [
                [29.9, false],
                [71.5, false],
                [106.4, false],
                [129.2, false],
                [144.0, false],
                [176.0, false],
                [135.6, false],
                [148.5, false],
                [216.4, true, true],
                [194.1, false],
                [95.6, false],
                [54.4, false]
            ],
            showInLegend: true
        }]
    });
});