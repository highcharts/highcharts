Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>credits.enabled</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    credits: {
        enabled: false
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
