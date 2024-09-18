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
        whiskerLength: 48,
        data: [
            {
                low: 4,
                q1: 8,
                median: 16,
                q3: 24,
                high: 28
            },
            {
                low: 4,
                q1: 8,
                median: 16,
                q3: 24,
                high: 28,
                upperWhiskerLength: '130%'
            },
            {
                low: 4,
                q1: 8,
                median: 16,
                q3: 24,
                high: 28,
                lowerWhiskerLength: '130%'
            }
        ]
    }]
});