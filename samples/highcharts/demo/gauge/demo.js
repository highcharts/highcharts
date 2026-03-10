Highcharts.chart('container', {
    chart: {
        type: 'gauge',
        height: '70%'
    },

    title: {
        text: 'Revenue this month'
    },

    // Defines the gauge area
    pane: {
        startAngle: -100,
        endAngle: 100,
        size: '125%',
        center: ['50%', '75%'],
        background: null
    },

    // The value axis
    yAxis: [{
        min: 0,
        max: 200000,
        tickWidth: 0,
        minorTickInterval: null,
        lineWidth: 0,
        tickInterval: 50000,
        labels: {
            distance: 20
        },
        lineWidth: 0,
        plotBands: [{
            borderRadius: 5,
            from: 0,
            to: 110000,
            color: 'rgba(99, 99, 99, 0.25)', // gray
            thickness: 50
        }, {
            borderRadius: 5,
            from: 112000,
            to: 149000,
            color: '#FFBF00', // yellow
            thickness: 50
        }, {
            borderRadius: 5,
            from: 151000,
            to: 200000,
            color: '#00A96B', // green
            thickness: 50
        }]
    },{
        // 2nd axis for the inner tick marks
        linkedTo: 0,
        offset: -55,
        lineWidth: 0,
        tickWidth: 2,
        tickLength: 10,
        tickInterval: 50000,
        tickColor: 'var(--highcharts-neutral-color-100, #000)',
        minorTickLength: 5,
        minorTickInterval: 2500,
        minorTickColor: 'var(--highcharts-neutral-color-100, #000)',
        labels: {
            enabled: false
        }
    }],

    series: [{
        name: 'Revenue',
        enableMouseTracking: false,
        data: [80000],
        tooltip: {
            valuePrefix: '$'
        },
        // Show a large data label
        dataLabels: {
            format: '${y:,.0f}<br>' +
                '<span style="font-size:0.6em; font-weight: normal;">' +
                '{point.series.name}</span>',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: 60,
            style: {
                fontSize: '1.4em'
            }
        },
        // The dial pointer can be heavily customized
        dial: {
            radius: -72, // Matching the plot band thickness with padding
            backgroundColor: 'var(--highcharts-neutral-color-80, #333)',
            borderWidth: 2,
            borderColor: 'var(--highcharts-neutral-color-80, #333)',
            baseWidth: 12,
            baseLength: '5%',
            rearLength: '5%'
        },
        pivot: {
            radius: 4,
            backgroundColor: 'var(--highcharts-background-color, #fff)'
        }
    }]

});
