Highcharts.chart('container', {
    legend: {
        maxWidth: '7%', // Only allow legend to be up to 7% of chart width.
        borderWidth: 1
    },

    series: [{
        name: '123456789',
        data: [0, 1, 2]
    }]
});
