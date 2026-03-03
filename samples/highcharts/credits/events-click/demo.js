Highcharts.chart('container', {
    credits: {
        text: 'Click me - click prevents navigation',
        events: {
            click: function (event) {
                event.preventDefault();
                console.log('Navigation prevented! Original href: https://www.highcharts.com');
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

// You can also add a general event handler using addEvent:
// This works for all charts, not just this instance
Highcharts.addEvent(Highcharts.Chart, 'creditsClick', function (e) {
    console.log('Global credits click handler');
    e.preventDefault();
});
