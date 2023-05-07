Highcharts.chart('container', {
    title: {
        text: 'Message Success By Attractiveness (Male Senders)'
    },
    subtitle: {
        useHTML: true,
        text: 'Source: <a href="https://theblog.okcupid.com/your-looks-and-your-inbox-8715c0f1561e">theblog.okcupid</a>'
    },
    xAxis: {
        categories: ['Least attractive female recipients', '', '', 'Medium female recipients', '', '', 'Most attractive female recipients']
    },
    yAxis: {
        title: {
            text: 'Message reply %'
        }
    },
    tooltip: {
        formatter: function () {
            return 'Category: <b>' + this.point.series.name + '</b><br>Message success percentage is <b>' + this.y + '</b>%';
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        name: 'Most attractive male senders',
        color: '#63BE7B',
        data: [43, 48, 80, 65, 62, 50, 44]
    }, {
        name: '-',
        color: '#99CF81',
        data: [50, 67, 61, 63, 53, 45, 38]
    }, {
        name: '-',
        color: '#CCDD82',
        data: [67, 63, 60, 55, 49, 40, 32]
    }, {
        name: 'Medium male senders',
        color: '#FFEB84',
        data: [67, 60, 58, 50, 41, 33, 28]
    }, {
        name: '-',
        color: '#FDCA7D',
        data: [59, 60, 50, 42, 35, 28, 23]
    }, {
        name: '-',
        color: '#FBA977',
        data: [58, 50, 40, 32, 26, 20, 18]
    }, {
        name: 'Least attractive male senders',
        color: '#F8696B',
        data: [56, 40, 30, 25, 20, 15, 12]
    }]
});
