// create the chart
const chart = Highcharts.chart('container', {
    loading: {
        hideDuration: 1000,
        showDuration: 1000
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0,
            176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});

let isLoading = false;

document.getElementById('button').addEventListener('click', e => {
    if (!isLoading) {
        chart.showLoading();
        e.target.innerHTML = 'Hide loading';
    } else {
        chart.hideLoading();
        e.target.innerHTML = 'Show loading';
    }
    isLoading = !isLoading;
});
