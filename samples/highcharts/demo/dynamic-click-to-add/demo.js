// Plugin to add a pulsating marker on add point
Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
    const point = e.point,
        series = e.target;

    if (!series.pulse) {
        series.pulse = series.chart.renderer.circle()
            .add(series.markerGroup);
    }
    setTimeout(() => {
        series.pulse
            .attr({
                x: series.xAxis.toPixels(point.x, true),
                y: series.yAxis.toPixels(point.y, true),
                r: series.options.marker.radius,
                opacity: 1,
                fill: series.color
            })
            .animate({
                r: 20,
                opacity: 0
            }, {
                duration: 1000
            });
    }, 1);
});

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        margin: [70, 50, 60, 80],
        events: {
            click: function (e) {
                // find the clicked values and the series
                const x = Math.round(e.xAxis[0].value),
                    y = Math.round(e.yAxis[0].value),
                    series = this.series[0];

                // Add it
                series.addPoint([x, y]);

            }
        }
    },
    title: {
        text: 'User supplied data',
        align: 'left'
    },
    subtitle: {
        text: 'Click the plot area to add a point. Click a point to remove it.',
        align: 'left'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        gridLineWidth: 1,
        minPadding: 0.2,
        maxPadding: 0.2,
        maxZoom: 60
    },
    yAxis: {
        title: {
            text: 'Value'
        },
        minPadding: 0.2,
        maxPadding: 0.2,
        maxZoom: 60,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            stickyTracking: false,
            lineWidth: 3,
            point: {
                events: {
                    click: function () {
                        if (this.series.data.length > 1) {
                            this.remove();
                        }
                    }
                }
            }
        }
    },
    series: [{
        data: [[20, 20], [80, 80]],
        color: Highcharts.getOptions().colors[3],
        marker: {
            lineWidth: 2,
            radius: 6
        }
    }]
});
