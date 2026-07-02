Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>legend.shadow</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    legend: {
        align: 'left',
        backgroundColor: 'var(--highcharts-background-color)',
        borderRadius: 5,
        floating: true,
        shadow: true,
        verticalAlign: 'top',
        x: 100,
        y: 70
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
