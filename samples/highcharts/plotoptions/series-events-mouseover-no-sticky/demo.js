const report = document.getElementById('report');

Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    plotOptions: {
        series: {
            stickyTracking: false,
            events: {
                mouseOver: () => {
                    report.innerHTML = 'Moused over';
                    report.style.color = 'green';
                },
                mouseOut: () => {
                    report.innerHTML = 'Moused out';
                    report.style.color = 'red';
                }
            }
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});