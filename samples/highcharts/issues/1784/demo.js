$(function () {
    $('#container').highcharts({

        chart: {
            plotBackgroundColor: '#F8F8FF'
        },

        title: {
            text: 'The issue caused categorized Y axis to overflow the plot area.'
        },

        yAxis: {
            categories: ['Ein', 'To', 'Tre', 'Fire'],
            lineWidth: 2
        },

        series: [{
            data: [0, 2, 1, 3]
        }]

    });
});
