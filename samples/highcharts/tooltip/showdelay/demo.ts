Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Crosshair and Tooltip showDelay demo'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        crosshair: {
            showDelay: 1000
        }
    },
    yAxis: {
        crosshair: {
            showDelay: 1000
        }
    },
    series: [{
        data: [4, 3, 5, 6, 2, 3]
    }],
    tooltip: {
        hideDelay: 1500,
        showDelay: 1000
    }
});
