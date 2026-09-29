Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette.injectCSS</em> set to false'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    palette: {
        injectCSS: false
    },
    series: [{
        colorByPoint: true,
        data: [1, 3, 2, 4]
    }]
});
