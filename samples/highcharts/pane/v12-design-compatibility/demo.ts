/*
 * General v12 design compatibility for gauge and solid gauge charts.
 * Note that in addition to the global options set by `setOptions`, there are
 * also some options that must be set on the `yAxis` instance.
 */
Highcharts.setOptions({
    pane: {
        startAngle: 0,
        endAngle: 360,
        background: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#ffffff'], // or var(--highcharts-background-color)
                    [1, '#e6e6e6'] // or var(--highcharts-neutral-color-10)
                ]
            },
            borderWidth: 1,
            outerRadius: '105%',
            innerRadius: 0
        },
        size: '85%',
        center: ['50%', '50%'],
        thickness: 10
    },
    plotOptions: {
        gauge: {
            dial: {
                baseLength: '70%',
                baseWidth: 3,
                borderRadius: 0,
                radius: '80%',
                rearLength: '10%',
                topWidth: 1
            },
            pivot: {
                // or var(--highcharts-neutral-color-100)
                backgroundColor: '#000000',
                borderWidth: 0,
                radius: 5
            },
            dataLabels: {
                borderColor: '#cccccc', // or var(--highcharts-neutral-color-20)
                borderRadius: 3,
                borderWidth: 1,
                style: {
                    fontSize: '0.7em'
                },
                y: 15
            }
        },

        solidgauge: {
            dataLabels: {
                borderColor: '#cccccc', // or var(--highcharts-neutral-color-20)
                borderRadius: 3,
                borderWidth: 1,
                style: {
                    fontSize: '0.7em'
                },
                verticalAlign: 'top',
                y: 0
            },
            innerRadius: '60%'
        }
    }
});


Highcharts.chart('container-1', {
    title: {
        text: 'Gauge'
    },
    yAxis: [{
        plotBands: [
            { from: 50, to: 70, color: '#FFBF00' },
            { from: 70, to: 100, color: '#00A96B' }
        ],
        min: 0,
        max: 100,

        // Start v12 design defaults ---
        labels: {
            distance: -25
        },
        lineWidth: 1,
        minorTickLength: 10,
        minorTicksPerMajor: 5,
        offset: 0
        // End v12 design defaults ---

    }],
    series: [{
        name: 'Speed',
        type: 'gauge',
        data: [80]
    }]
});

Highcharts.chart('container-2', {
    title: {
        text: 'Solid Gauge'
    },
    yAxis: {
        min: 0,
        max: 100,

        // Start v12 design defaults ---
        labels: {
            distance: -25
        },
        lineWidth: 1,
        minorTickLength: 10,
        minorTicks: true,
        minorTicksPerMajor: 5,
        offset: 0,
        tickLength: 10
        // End v12 design defaults ---
    },
    series: [{
        name: 'Speed',
        type: 'solidgauge',
        data: [80]
    }]
});
