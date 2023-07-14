Highcharts.chart('container', {

    title: {
        text: 'Message Success By Attractiveness (Female Senders)'
    },

    subtitle: {
        useHTML: true,
        text: 'Source: <a href="https://theblog.okcupid.com/your-looks-and-your-inbox-8715c0f1561e">theblog.okcupid</a>'
    },
    xAxis: {
        categories: ['Least attractive male recipients', '', '', 'Medium male recipients', '', '', 'Most attractive male recipients']
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
        name: 'Most attractive female senders',
        color: '#63BE7B',
        data: [60, 67, 70, 66, 63, 58, 50]
    }, {
        name: '-',
        color: '#99CF81',
        data: [65, 66, 65, 61, 55, 50, 48]
    }, {
        name: '-',
        color: '#CCDD82',
        data: [65, 62, 59, 54, 45, 40, 37]
    }, {
        name: 'Medium female senders',
        color: '#FFEB84',
        data: [60, 58, 50, 43, 37, 31, 30]
    }, {
        name: '-',
        color: '#FDCA7D',
        data: [55, 48, 43, 35, 28, 21, 25]
    }, {
        name: '-',
        color: '#FBA977',
        data: [46, 40, 33, 27, 22, 15, 14]
    }, {
        name: 'Least attractive female senders',
        color: '#F8696B',
        data: [36, 30, 22, 18, 14, 11, 6]
    }]

});
