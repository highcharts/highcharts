Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>tooltip.borderColor</em>'
    },
    series: [{
        data: [1, 3, 2, 4]
    }],
    tooltip: {
        borderWidth: 2
    }
});
