const chart = Highcharts.chart('container', {
    credits: {
        enabled: false
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],

    navigation: {
        buttonOptions: {
            enabled: false
        }
    }
});

// The button handler
document.getElementById('button').addEventListener('click', function () {
    chart.fullscreen.toggle();
});
