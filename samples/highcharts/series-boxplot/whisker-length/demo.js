Highcharts.chart('container', {
    chart: {
        type: 'boxplot'
    },

    title: {
        text: 'Configuring whisker lengths'
    },

    yAxis: {
        title: false
    },

    legend: {
        enabled: false
    },

    series: [{
        whiskerLength: '100%',
        lowerWhiskerLength: '10%',
        data: [
            {
                x: 0,
                low: 1,
                q1: 2,
                median: 3,
                q3: 4,
                high: 5,
                whiskerLength: '50%'
            },
            {
                x: 1,
                low: 1,
                q1: 2,
                median: 3,
                q3: 4,
                high: 5,
                lowerWhiskerLength: '150%'
            },
            {
                x: 2,
                low: 1,
                q1: 2,
                median: 3,
                q3: 4,
                high: 5,
                upperWhiskerLength: '10%'
            }
        ]
    }]
});
