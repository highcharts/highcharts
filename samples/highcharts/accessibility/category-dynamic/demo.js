var chart = Highcharts.chart('container', {
    title: {
        text: 'Dynamic data'
    },
    subtitle: {
        text: 'Click button to add point to chart'
    },
    accessibility: {
        description: 'A test case for dynamic data in charts.',
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        name: 'Random data',
        data: [1, 5]
    }]
});

// Add random point when clicking button
document.getElementById('add').onclick = function () {
    chart.series[0].addPoint(Math.round(Math.random() * 10));
};
