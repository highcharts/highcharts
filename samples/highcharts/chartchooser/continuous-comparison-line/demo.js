Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Operating Systems Trends'
    },
    subtitle: {
        text:
        'Source: <a href="https://trends.google.com/trends/explore?date=all&q=%2Fm%2F02wxtgw,%2Fm%2F03wbl14,%2Fm%2F04r_8,%2Fm%2F0fpzzp,%2Fm%2F055yr">Google Trends </a>'
    },

    yAxis: {
        max: 100,
        title: {
            enabled: false
        }
    },

    tooltip: {
        split: true,
        xDateFormat: '%B %Y',
        crosshairs: true
    },

    data: {
        csvURL: 'https://www.highcharts.com/samples/data/operating-systems-trends.csv'
    }
});
