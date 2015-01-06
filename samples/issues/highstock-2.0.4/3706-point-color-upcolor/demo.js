$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        title: {
            text: 'point.color should trump series.upColor'
        },

        series: [{
            type: 'ohlc',
            color: 'blue',
            upColor: 'green',
            data: [{ 
                open: 1, 
                high: 4, 
                low: 0, 
                close: 2
            }, {
                open: 4, 
                high: 6,
                low: 2,
                close: 5,
                color: 'red'
            }, {
                open: 5,
                high: 7,
                low: 3,
                close: 4
            }, {
                open: 7,
                high: 8,
                low: 3,
                close: 4
            }],
            lineWidth: 4
        }]

    });
});
