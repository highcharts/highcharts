Highcharts.chart('container', {
    chart: {
        type: 'variwide'
    },
    title: {
        text: 'Stack labels in variwide chart'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        stackLabels: {
            enabled: true
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [
            [0, 50, 135504],
            [1, 42, 277339],
            [2, 32, 421611],
            [3, 38, 462057],
            [4, 35, 902885],
            [5, 34, 1702641]
        ]
    }, {
        data: [
            [0, 47, 135504],
            [1, 61, 277339],
            [2, 92, 421611],
            [3, 76, 462057],
            [4, 99, 902885],
            [5, 82, 1702641]
        ]
    }]
});