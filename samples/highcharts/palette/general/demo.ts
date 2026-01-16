Highcharts.chart('container', {
    chart: {
        borderRadius: 7,
        borderWidth: 2,
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
            colors: ['#2caffe', '#544fc5']
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }]
} satisfies Highcharts.Options);
