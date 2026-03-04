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
        colors: ['#2caffe', '#2e2a69'],
        colorScheme: 'light dark',
        dark: {
            colors: [
                null,
                '#efdf00'
            ]
        },
        light: {}
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }]
});
