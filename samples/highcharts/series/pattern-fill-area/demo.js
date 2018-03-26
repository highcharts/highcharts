Highcharts.chart('container', {
    chart: {
        type: 'area'
    },

    title: {
        text: 'Pattern fill plugin demo'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    plotOptions: {
        area: {
            fillColor: {
                pattern: {
                    path: {
                        d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
                        strokeWidth: 3
                    },
                    width: 10,
                    height: 10,
                    opacity: 0.4
                }
            }
        }
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
        color: '#88e',
        fillColor: {
            pattern: {
                color: '#11d'
            }
        }
    }, {
        data: [null, null, null, null, null, 43.1, 95.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#e88',
        fillColor: {
            pattern: {
                color: '#d11'
            }
        }
    }]
});
