Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        marginBottom: '4rem',
        marginLeft: '6rem',
        marginRight: '3rem',
        marginTop: '5rem',
        plotBorderWidth: 1,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.margin</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
