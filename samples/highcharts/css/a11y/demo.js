Highcharts.chart('container', {
    chart: {
        styledMode: true
    },

    title: {
        text: 'Styled mode with a11y module'
    },

    subtitle: {
        text: 'Markers should be invisible, except point #4'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, {
            y: 129.2,
            marker: {
                enabled: true
            }
        }, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        marker: {
            enabled: false
        }
    }]
});
