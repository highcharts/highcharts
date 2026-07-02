Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: 'light-dark(#f8f8f8, #222)',
        plotBorderRadius: 10,
        plotBorderWidth: 1,
        plotShadow: false,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.plotBorderRadius</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        gridLineColor: 'var(--highcharts-neutral-color-20)',
        gridLineWidth: 1,
        lineWidth: 3
    },
    yAxis: {
        gridLineColor: 'var(--highcharts-neutral-color-20)'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
