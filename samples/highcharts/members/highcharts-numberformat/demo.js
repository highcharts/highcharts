Highcharts.setOptions({
    lang: {
        locale: 'ar-SA'
    }
});

Highcharts.chart('container', {

    chart: {
        type: 'column',
        style: {
            fontSize: '1.3rem'
        }
    },

    title: {
        text: 'Arabic digits in Highcharts'
    },

    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%[b]}'
        }
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ],
        pointStart: '2024-01-01',
        pointIntervalUnit: 'month',
        dataLabels: {
            enabled: true,
            format: '{y:.1f}'
        }
    }]
});