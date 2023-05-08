Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Monthly Sales Trends (May-Aug)'
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    series: [{
        name: 'Brands',
        data: [{
            name: 'May',
            y: 20.6,
            color: '#4285F4'
        }, {
            name: 'June',
            y: 21.6,
            color: '#DB4437'
        }, {
            name: 'July',
            y: 24.7,
            color: '#F4B400'
        }, {
            name: 'Aug',
            y: 33.0,
            color: '#0F9D58'
        }]
    }]
});
