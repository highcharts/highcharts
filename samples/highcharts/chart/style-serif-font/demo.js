const chart = Highcharts.chart('container', {
    chart: {
        style: {
            fontFamily: 'serif'
        }
    },
    title: {
        text: 'Chart styles'
    },
    subtitle: {
        text: 'Use buttons to toggle'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4],
        type: 'column',
        dataLabels: {
            enabled: true
        },
        name: 'Rainfall'
    }]

});

// Allow toggle
document.querySelectorAll('.chart-style').forEach(button =>
    button.addEventListener('click', e => chart.update({
        chart: {
            style: {
                fontFamily: e.target.id
            }
        }
    }))
);