$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    }, function (chart) { // on complete

        chart.renderer.text('This text is <span style="color: red">styled</span> and <a href="http://example.com">linked</a>', 150, 80)
            .css({
                color: '#4572A7',
                fontSize: '16px'
            })
            .add();

    });
});