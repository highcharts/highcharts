Highcharts.chart('container', {
    chart: {
        type: 'gauge',
        height: '100%'
    },

    title: {
        text: 'Revenue this month'
    },

    // Defines the gauge area
    pane: {
        startAngle: -90,
        endAngle: 90,
        size: '100%',
        center: ['50%', '75%'],
        background: null
    },

    // The value axis
    yAxis: {
        min: 0,
        max: 200000,
        tickWidth: 0,
        minorTickInterval: null,
        labels: {
            distance: 20
        },
        lineWidth: 0,
        plotBands: [{
            from: 0,
            to: 130000,
            color: '#DF5353', // red
            thickness: '25%'
        }, {
            from: 132000,
            to: 160000,
            color: '#DDDF0D', // yellow
            thickness: '25%'
        }, {
            from: 162000,
            to: 200000,
            color: '#55BF3B', // green
            thickness: '25%'
        }]
    },

    series: [{
        name: 'Revenue',
        enableMouseTracking: false,
        data: [80000],
        tooltip: {
            valuePrefix: '$'
        },
        // Show a large data label
        dataLabels: {
            format: '${y:,.0f}',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: -10,
            style: {
                fontSize: '1.4em'
            }
        },
        // The dial pointer can be heavily customized
        dial: {
            radius: '72%', // Matching the plot band thickness
            backgroundColor: 'var(--highcharts-neutral-color-80, #333)',
            baseWidth: 12,
            baseLength: '85%',
            rearLength: '-85%'
        },
        pivot: {
            radius: 0
        }
    }]

});
