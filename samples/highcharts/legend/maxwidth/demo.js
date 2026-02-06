Highcharts.chart('container', {
    title: {
        text: 'Legend <em>maxWidth</em> option'
    },
    legend: {
        maxWidth: '20%', // Only allow legend to be up to 20% of chart width.
        borderWidth: 1
    },
    series: [{
        name: 'ThisIsAVeryLongName',
        data: [0, 1, 2]
    }]
});
