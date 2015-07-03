$(function () {
    $('#container').highcharts({

        title: {
            text: 'Data labels box options'
        },

        subtitle: {
            text: 'backgroundColor, borderColor, borderRadius, borderWidth, padding and shadow'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    borderRadius: 5,
                    backgroundColor: 'rgba(252, 255, 197, 0.7)',
                    borderWidth: 1,
                    borderColor: '#AAA',
                    y: -6
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 178.0, 135.6, 148.5, {
                y: 216.4,
                dataLabels: {
                    borderColor: 'red',
                    borderWidth: 2,
                    padding: 5,
                    shadow: true,
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }, 194.1, 95.6, 54.4]
        }]

    });
});