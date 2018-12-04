
Highcharts.chart('container', {

    chart: {
        type: 'column',
        styledMode: true
    },

    title: {
        text: 'Data labels with contrast'
    },

    subtitle: {
        text: 'Adjust data label color and shadow to underlying column'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        dataLabels: {
            enabled: true,
            inside: true
        },
        colorByPoint: true
    }]
});