Highcharts.chart('container', {
    chart: {
        type: 'spline',
        inverted: true,

        events: {
            load: function () {
                // Access the chart renderer
                var renderer = this.renderer;

                // Define the gradient colors
                var gradientColors = {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#001F33'],
                        [0.2, '#001F3F'],
                        [0.6, '#0088CC'],
                        [0.7, '#3399CC'],
                        [1, '#66C2E0']
                    ]
                };

                // Create a rectangle with gradient background within the plot area
                renderer
                    .rect(
                        this.plotLeft,
                        this.plotTop,
                        this.plotWidth,
                        this.plotHeight
                    )
                    .attr({
                        fill: gradientColors,
                        zIndex: -1 // Place the rectangle behind the chart series
                    })
                    .add();
            }
        }
    },
    title: {
        text: 'Atmosphere Temperature by Altitude',
        align: 'left'
    },
    subtitle: {
        text: 'According to the Standard Atmosphere Model',
        align: 'left'
    },
    xAxis: {
        reversed: false,
        title: {
            enabled: true,
            text: 'Altitude'
        },
        labels: {
            format: '{value} km'
        },
        accessibility: {
            rangeDescription: 'Range: 0 to 80 km.'
        },
        maxPadding: 0.05,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Temperature'
        },
        labels: {
            format: '{value}°'
        },
        accessibility: {
            rangeDescription: 'Range: -90°C to 20°C.'
        },
        lineWidth: 2
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x} km: {point.y}°C'
    },
    plotOptions: {
        spline: {
            lineWidth: 3,
            lineColor: '#FFFFFF',
            marker: {
                enable: false,
                fillColor: '#FFFFFF',
                lineWidth: 1,
                lineColor: '#0f0f0f',
                // lineColor: '#FFFFFF',
                radius: 6
            }
        }
    },
    series: [
        {
            name: 'Temperature',
            data: [
                [0, 15],
                [10, -50],
                [20, -56.5],
                [30, -46.5],
                [40, -22.1],
                [50, -2.5],
                [60, -27.7],
                [70, -55.7],
                [80, -76.5]
            ]
        }
    ]
});
