Highcharts.chart('container', {
    title: {
        text: 'Crosshair showDelay demo'
    },
    xAxis: {
        crosshair: {
            showDelay: 1000
        }
    },
    yAxis: {
        crosshair: {
            showDelay: 1000
        }
    },

    tooltip: {
        showDelay: 1000,
        hideDelay: 1500
    },

    series: [{
        data: [4, 3, 5, 6, 2, 3]
    }]
});