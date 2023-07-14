Highcharts.chart('container', {
    title: {
        text: '<em>minorTicksPerMajor</em> is 2'
    },

    yAxis: {
        minorTicks: true,
        minorTicksPerMajor: 2
    },

    series: [{
        data: [1, 4, 5, 3]
    }]
});
