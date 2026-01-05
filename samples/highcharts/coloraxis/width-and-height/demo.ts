Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>colorAxis</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    colorAxis: {
        height: 10,
        width: '50%'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
