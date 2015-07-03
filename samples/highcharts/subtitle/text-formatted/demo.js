$(function () {
    $('#container').highcharts({

        chart: {
            marginTop: 80
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        subtitle: {
            text: 'This text has <b>bold</b>, <i>italic</i>, <span style="color: red">coloured</span>, <a href="http://example.com">linked</a> and <br/>line-broken text.'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});