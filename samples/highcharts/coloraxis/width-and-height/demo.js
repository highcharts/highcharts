Highcharts.chart('container', {
    colorAxis: {
        width: '50%',
        height: 10
    },

    title: {
        text: 'Color axis with specified width and height'
    },

    series: [{
        type: 'column',
        data: [35, 22, 14, 9, 60, 7, 15, 30, 45, 12, 25]
    }]
});
