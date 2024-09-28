Highcharts.chart('container', {

    title: {
        text: 'Chart with inactiveOtherPoints option enabled.'
    },

    plotOptions: {
        series: {
            inactiveOtherPoints: true
        },
        scatter: {
            marker: {
                states: {
                    inactive: {
                        enabled: true,
                        opacity: 0.2
                    }
                }
            }
        }
    },

    series: [{
        type: 'scatter',
        data: [2, 4, 6, 8]
    },
    {
        type: 'column',
        data: [1, 3, 5, 7]
    }
    ]
});
