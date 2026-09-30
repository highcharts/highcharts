Highcharts.chart('container', {
    chart: {
        type: 'boxplot'
    },

    title: {
        text: 'Box plot data labels'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['Experiment 1', 'Experiment 2', 'Experiment 3']
    },

    yAxis: {
        title: {
            text: 'Observed value'
        },
        maxPadding: 0.1
    },

    plotOptions: {
        boxplot: {
            dataLabels: [{
                enabled: true,
                alignToKey: 'high',
                format: 'Max: {point.high}'
            }, {
                enabled: true,
                alignToKey: 'q3',
                format: 'Q3: {point.q3}',
                style: {
                    fontWeight: 'normal'
                },
                y: 3
            }, {
                enabled: true,
                alignToKey: 'median',
                format: 'Median: {point.median}'
            }, {
                enabled: true,
                alignToKey: 'q1',
                format: 'Q1: {point.q1}',
                style: {
                    fontWeight: 'normal'
                },
                y: 3
            }, {
                enabled: true,
                alignToKey: 'low',
                format: 'Min: {point.low}'
            }]
        }
    },

    series: [{
        data: [
            [760, 801, 848, 895, 965],
            [733, 853, 939, 980, 1080],
            [714, 762, 817, 870, 918]
        ]
    }]
});
