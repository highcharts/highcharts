
var chart = Highcharts.chart('container', {

    title: {
        text: 'Credits update'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});

$('#credits-enable').click(function () {
    chart.addCredits({
        enabled: true
    });
});

$('#credits-disable').click(function () {
    chart.credits.update({
        enabled: false
    });
});

$('#credits-custom').click(function () {
    if (chart.credits) {
        chart.credits.update({
            text: 'MyFancyCompany',
            href: 'https://www.example.com',
            position: {
                align: 'left',
                x: 10
            },
            style: {
                fontSize: '2em',
                color: 'blue'
            }
        });
    }
});

$('#credits-default').click(function () {
    if (chart.credits) {
        chart.credits.update({
            text: 'Highcharts.com',
            href: 'https://www.highcharts.com',
            position: {
                align: 'right',
                x: -10
            },
            style: {
                color: '#909090',
                fontSize: '9px'
            }
        });
    }
});