const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});

document.getElementById('button1').addEventListener('click', () => {
    chart.showLoading('Loading AJAX...');
});

document.getElementById('button2').addEventListener('click', () => {
    chart.showLoading('Loading image...');
});

document.getElementById('button3').addEventListener('click', () => {
    chart.showLoading();
});

document.getElementById('button4').addEventListener('click', () => {
    chart.hideLoading();
});
