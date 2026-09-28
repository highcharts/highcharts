Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>credits.position</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    credits: {
        position: {
            relativeTo: 'spacingBox'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
