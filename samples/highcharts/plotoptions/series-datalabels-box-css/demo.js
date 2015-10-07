$(function () {
    $('#container').highcharts({

        title: {
            text: 'Data labels box by CSS'
        },

        subtitle: {
            text: 'Stroke and fill the box'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr']
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    borderRadius: 2,
                    y: -5
                }
            }
        },

        series: [{
            data: [100, 300, {
                y: 500,
                dataLabels: {
                    className: 'highlight'
                }
            }, 400]
        }]

    });
});