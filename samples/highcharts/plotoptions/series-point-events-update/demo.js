const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    plotOptions: {
        series: {
            point: {
                events: {
                    update: event => {
                        if (!confirm(
                            'Do you want to set the point\'s value to ' +
                            event.options + '?'
                        )) {
                            return false;
                        }
                    }
                }
            }
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});

document.getElementById('button').addEventListener('click', () => {
    chart.series[0].data[0].update(150);
});
