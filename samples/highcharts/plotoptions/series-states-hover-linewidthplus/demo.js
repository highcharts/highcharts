$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                marker: {
                    states: {
                        hover: {
                            radiusPlus: 5,
                            lineWidthPlus: 2
                        }
                    }
                },
                states: {
                    hover: {
                        lineWidthPlus: 5
                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            lineWidth: 4,
            marker: {
                lineWidth: 2,
                radius: 6
            }
        }]
    });
});