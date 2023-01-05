Highcharts.chart('container', {
    title: {
        text: 'Average Rainfall'
    },
    subtitle: {
        useHTML: true,
        text: 'Source: <a href="http://www.worldclimate.com">worldclimate</a> '
    },
    xAxis: {

        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'mm'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        valueSuffix: ' mm',
        shared: true
    },
    series: [{
        name: 'London',
        data: [48.9, 38.8, 39.3, 41.4, 47,
            48.3, 59, 59.6, 52.4, 65.2, 59.3, 51.2]
    }, {
        name: 'Tokyo',
        data: [49.9, 71.5, 106.4, 129.2,
            44, 176, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});
