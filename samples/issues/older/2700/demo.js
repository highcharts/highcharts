$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            inverted: false
        },
        title: {
            text: 'Highcharts <= 3.0.9: Data labels were not shown inside clipped columns'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            max: 250
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    inside: true,
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                stacking: 'normal'
            }
        },

        series: [{
            data: [450.01, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [450.01, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});