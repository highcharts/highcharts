Highcharts.chart('container', {
    credits: {
        text: 'Click me - click event',
        href: '',
        events: {
            click: function () {
                console.log('Click event fired!');
            }
        }
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
    }]
});
