Highcharts.chart('container', {
    chart: {
        type: 'line',
        zoomType: 'xy'
    },

    xAxis: {
        zoomEnabled: false
    },

    series: [{
        data: [-29.9, -71.5, -106.4, -129.2, -144.0, -176.0, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
    }]
});
