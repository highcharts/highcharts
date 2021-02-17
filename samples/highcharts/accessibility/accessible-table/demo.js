Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    exporting: {
        enabled: false,
        showTable: true
    },
    title: {
        text: 'Total fruit consumption'
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
        accessibility: {
            description: 'Fruits'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Total fruit consumption'
        }
    },
    accessibility: {
        landmarkVerobsity: 'one'
    },
    series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
    }, {
        name: 'Jane',
        data: [2, 2, 3, 2, 1]
    }, {
        name: 'Joe',
        data: [3, 4, 4, 2, 5]
    }]
});
