Highcharts.chart('container', {
    chart: {
        style: {
            fontFamily: '"1customname"'
        }
    },

    title: {
        text: 'Chart with special character in font name.'
    },

    series: [{
        data: [1, 2, 3]
    }]
});
