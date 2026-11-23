// Plugin to add a pulsating marker on add point
(({ addEvent, Series }) => {
    const pulseMap = new WeakMap<Highcharts.Series, Highcharts.SVGElement>();
    addEvent(Series, 'addPoint', (
        e: Highcharts.SeriesAddPointEventObject
    ) => {
        const series = e.target,
            options = series.options as Highcharts.SeriesScatterOptions,
            x = e.point.x;

        let pulse = pulseMap.get(series);
        pulse ||= series.chart.renderer.circle()
            .add(series.markerGroup);
        pulseMap.set(series, pulse);

        setTimeout(() => {
            pulse
                .attr({
                    r: options.marker.radius,
                    opacity: 1,
                    fill: series.color
                })
                .animate({
                    r: 20,
                    opacity: 0
                }, {
                    duration: 1000,
                    step: () => {
                        const point = series.points[series.points.length - 1],
                            graphic = point?.graphic;
                        if (point && point.x === x && graphic) {
                            pulse.attr({
                                x: Number(graphic.attr('x')) +
                                    Number(graphic.attr('width')) / 2,
                                y: Number(graphic.attr('y')) +
                                    Number(graphic.attr('height')) / 2
                            });
                        }
                    }
                });
        }, 1);
    });
})(Highcharts);

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
        color: 'var(--highcharts-color-3)',
        marker: {
            lineWidth: 2,
            radius: 6
        }
    }]
} satisfies Highcharts.Options);
