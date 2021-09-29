const chart = Highcharts.chart('container', {
    title: {
        text: 'Y axis softMax is 100'
    },
    subtitle: {
        text: 'Click the button to change data max'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        softMax: 100,
        title: {
            text: 'Percentage'
        }
    },
    series: [{
        data: [0, 1, 0, 2, 3, 5, 8, 5, 15, 14, 25, 54]
    }]
});

let toggle = false;

document.getElementById('point-update').addEventListener('click', () => {
    toggle = !toggle;
    chart.series[0].points[11].update(toggle ? 120 : 54);
});
