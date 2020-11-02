const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});

let wide = false;

document.getElementById('set-div-size').addEventListener('click', () => {
    document.getElementById('container').style.width = wide ? '400px' : '500px';
    wide = !wide;
});

document.getElementById('reflow-chart').addEventListener('click', () => {
    chart.reflow();
});
