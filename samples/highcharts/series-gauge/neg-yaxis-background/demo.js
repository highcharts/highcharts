Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Negative yAxis.min on solid gauge (#3010)'
    },

    yAxis: {
        min: -5,
        max: 5
    },

    series: [{
        data: [-1]
    }]
});
