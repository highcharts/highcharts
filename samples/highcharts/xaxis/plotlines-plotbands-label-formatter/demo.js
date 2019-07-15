Highcharts.chart('container', {
    xAxis: {
        plotLines: [{
            value: 1,
            color: '#f00',
            width: 1,
            label: {
                formatter: function () {
                    return 'Plot line value: ' + this.options.value;
                }
            }
        }],
        plotBands: [{
            from: 2,
            to: 5,
            color: 'rgba(255, 255, 0, 0.2)',
            width: 1,
            label: {
                formatter: function () {
                    return 'Plot band from ' + this.options.from + ' to: ' + this.options.to;
                }
            }
        }]
    },
    series: [{
        data: [1, 2, 6, 1, 2, 4, 9]
    }]
});
