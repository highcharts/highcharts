Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette</em> options'
    },
    subtitle: {
        style: {
            color: 'var(--highcharts-highlight-color)'
        },
        text: 'This subtitle uses the highlight color'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    palette: {
        colorScheme: 'light dark',
        light: {
            colors: ['#2caffe', '#544fc5']
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }]
});
