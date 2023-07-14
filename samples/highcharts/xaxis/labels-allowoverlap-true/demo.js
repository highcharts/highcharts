Highcharts.chart('container', {

    chart: {
        polar: true
    },
    xAxis: {
        labels: {
            allowOverlap: true
        },
        categories: ['Australia', 'Austria', 'Belgium', 'Canada', 'Denmark', 'Finland', 'France', 'Germany', 'Hong Kong', 'Ireland', 'Israel', 'Italy', 'Japan', 'Netherlands', 'New Zealand Country', 'Norway', 'Philippines', 'Poland', 'Portugal', 'Russia', 'Singapore', 'South Africa', 'Spain', 'Sweden', 'Switzerland', 'UK', 'USA']
    },
    series: [{
        data: [
            5, 3, 2, 4, 5, 3, 2, 4, 2, 3, 4, 3,
            2, 4, 5, 6, 3, 2, 4, 5, 3, 5, 4, 2, 4, 5, 5
        ]
    }]

});
