Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        marginLeft: '20%',
        marginRight: '20%',
        plotBorderWidth: 1,
        type: 'column',
        width: '400'
    },
    title: {
        text: 'Chart with percentage margins'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
