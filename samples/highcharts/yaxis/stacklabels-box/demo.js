Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Stack labels box options'
    },

    subtitle: {
        text: 'backgroundColor, borderColor, borderRadius, borderWidth'
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
        title: {
            text: 'Total fruit consumption'
        },
        stackLabels: {
            enabled: true,
            borderRadius: 5,
            backgroundColor: 'rgba(252, 255, 197, 0.7)',
            borderWidth: 1,
            borderColor: '#AAA',
            y: -5
        }
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [50, 32, 47, 51, 25]
    }, {
        data: [21, 28, 34, 22, 11]
    }]
});
