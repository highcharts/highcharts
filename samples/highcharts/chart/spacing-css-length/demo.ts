Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        plotBorderWidth: 1,
        spacingBottom: '3rem',
        spacingLeft: '4rem',
        spacingRight: '2rem',
        spacingTop: '3rem',
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.spacing</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
