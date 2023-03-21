const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Border Radius options'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    plotOptions: {
        series: {
            borderRadius: {
                radius: 10
            },
            stacking: 'normal'
        }
    },

    series: [{
        data: [9.9, -71.5, 106.4, 129.2, -144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }, {
        data: [176.0, -135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
            106.4, 129.2, 144.0]
    }]
});

document.querySelectorAll('.highcharts-figure input').forEach(input =>
    input.addEventListener('click', e => {
        chart.update({
            plotOptions: {
                series: {
                    borderRadius: {
                        [e.target.name]: e.target.value
                    }
                }
            }
        });
    })
);