$(function () {
    $('#container').highcharts({
        chart: {
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 316.4, 294.1, 195.6, 154.4],
            marker: {
                symbol: 'triangle'
            }
        }, {
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
            marker: {
                symbol: 'url(http://highcharts.com/demo/gfx/sun.png)'
            }
        }]
    });
});