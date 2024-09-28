Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'HTML title <i class="fa fa-check"></i>',
        useHTML: true
    },

    yAxis: {
        title: {
            text: 'HTML y-axis <i class="fa fa-check"></i>',
            useHTML: true
        }
    },

    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            format: '{value} <i class="fa fa-check"></i>'
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 3456],
            ['Tre', 2345],
            ['Fire', 4567]
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            format: '{y} <i class="fa fa-check"></i>'
        },
        name: 'HTML Series <i class="fa fa-check"></i>'
    }]

});
