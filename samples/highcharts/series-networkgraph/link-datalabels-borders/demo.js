Highcharts.chart('container', {
    chart: {
        type: 'networkgraph'
    },

    series: [{
        dataLabels: {
            enabled: true,
            borderColor: "#000000",
            borderWidth: 1,
            allowOverlap: true
        },
        marker: {
            radius: 35
        },
        data: [{
            from: 'A',
            to: 'B'
        }]
    }]
});
