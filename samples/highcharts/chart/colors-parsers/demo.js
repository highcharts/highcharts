Highcharts.Color.parsers.push({
    regex: /^[a-z]+$/u,
    parse: result => {
        const rgb = new RGBColor(result[0]);
        if (rgb.ok) {
            return [rgb.r, rgb.g, rgb.b, 1]; // returns rgba to Highcharts
        }
    }
});

Highcharts.chart('container', {
    title: {
        text: 'Named colors'
    },
    colors: ['red', 'orange', 'green', 'blue', 'purple', 'brown'],
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [4, 3, 5, 4, 6, 1],
        type: 'column',
        colorByPoint: true
    }]
});
