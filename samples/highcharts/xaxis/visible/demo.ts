Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of axis <em>visible</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        visible: true
    },
    yAxis: {
        visible: false
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
