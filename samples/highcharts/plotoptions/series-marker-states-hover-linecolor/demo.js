$(function () {
    Highcharts.chart('container', {
        title: {
            text: 'on hover, the markers linecolor  is red'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                marker: {
                    states: {
                        hover: {
                            fillColor: 'white',
                            lineColor: 'red',
                            lineWidth: 2
                        }
                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});