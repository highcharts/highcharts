const chart = Highcharts.chart('container', {
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
        data: [29.9, 71.5,
            106.4, 129.2,
            144.0, 176.0,
            135.6, 148.5,
            216.4, 194.1,
            95.6, 54.4]
    }]
});

document.getElementById('credits-enable').addEventListener('click', () => {
    chart.addCredits({
        enabled: true
    });
});

document.getElementById('credits-disable').addEventListener('click', () => {
    chart.credits.update({
        enabled: false
    });
});

document.getElementById('credits-custom').addEventListener('click', () => {
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

document.getElementById('credits-default').addEventListener('click', () => {
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