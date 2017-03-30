
Highcharts.chart('container', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15
        }
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears', 'Kiwis',
            'Grapes', 'Dates']
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    plotOptions: {
        series: {
            depth: 40,
            grouping: false,
            groupZPadding: 10
        }
    },
    series: [{
        name: 'Jane',
        data: [1, 0, 4, 5, 2, 3, 1]
    }, {
        name: 'John',
        data: [5, 7, 3, 6, 4, 2, 1]
    }]
});