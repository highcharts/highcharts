$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },

        plotOptions: {
            series: {
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 111]
        }]
    });
});