Highcharts.chart('container', {
    title: {
        text: '#17385, series were cleared when updating from chart.events.load'
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [6, 5, 7, 6]
    }],
    chart: {
        events: {
            load: e => e.target.yAxis[0].setExtremes(0, 8)
        }
    },
    plotOptions: {
        series: {
            boostThreshold: 1
        }
    }
});
