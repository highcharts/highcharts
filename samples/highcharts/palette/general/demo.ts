Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette.light</em> options'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    palette: {
        light: {
            backgroundColor: '#f0f0f0',
            colors: ['#2caffe', '#544fc5']
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }]
} satisfies Highcharts.Options);
