const chart = Highcharts.chart('container', {
    title: {
        text: 'Tooltip update'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});

document.getElementById('update-tooltip-dark').addEventListener('click', () => {
    chart.tooltip.update({
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderWidth: 0,
        style: {
            color: '#FFFFFF'
        }
    });
});

document.getElementById('update-tooltip-light').addEventListener('click', () => {
    chart.tooltip.update({
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderWidth: 1,
        style: {
            color: '#333333'
        }
    });
});