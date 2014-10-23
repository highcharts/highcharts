$(function () {
    $('#container').highcharts({
        chart: {
            type: 'area',
            plotBorderColor: '#346691',
            plotBorderWidth: 2
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            min: 0,
            max: 200

        },
        plotOptions: {
            series: {
                //animation: false

            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, -5, -5, 54.4],
            color: 'black'
        }, {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, -5, -5, 54.4].reverse(),
            color: 'blue'
        }]
    });
});